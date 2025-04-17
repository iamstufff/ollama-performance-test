import { Ollama } from "ollama";
import { writeFile } from "fs/promises";

// Array of models to test - with your specific models
const MODELS = [
  "deepseek-r1:8b-llama-distill-q4_K_M",
  "deepseek-r1:14b",
  "mistral-nemo:latest",
  "gemma3:1b",
  "deepseek-r1:1.5b",
  "phi4:latest",
  "phi:2.7b",
  "mistral:7b",
  // Add more models as needed
];

// Test configuration
const TEST_CONFIG = {
  promptToUse: "Explain about the heartbleed vulnerability in detail.",
  numRuns: 2, // Number of runs per model for averaging results
  outputFile: "speed-results.json",
};

// Initialize Ollama client
const ollama = new Ollama();

// Function to measure response time for a single model
async function testModelSpeed(modelName) {
  console.log(`\nTesting model: ${modelName}`);

  const results = [];

  for (let i = 0; i < TEST_CONFIG.numRuns; i++) {
    try {
      console.log(`  Run ${i + 1}/${TEST_CONFIG.numRuns}...`);

      const startTime = Date.now();

      // Use the Ollama chat API
      const response = await ollama.chat({
        model: modelName,
        messages: [
          {
            role: "user",
            content: TEST_CONFIG.promptToUse,
          },
        ],
        // Set a reasonable timeout to avoid hanging
        options: {
          temperature: 0.7,
        },
      });

      const endTime = Date.now();
      const timeTaken = endTime - startTime;

      // Calculate tokens
      const responseContent = response.message?.content || "";
      const inputTokens = TEST_CONFIG.promptToUse.length / 4; // rough approximation
      const outputTokens = responseContent.length / 4; // rough approximation
      const totalTokens = inputTokens + outputTokens;
      const tokensPerSecond = (outputTokens / (timeTaken / 1000)).toFixed(2);

      console.log(
        `  Response time: ${timeTaken}ms (approx. ${tokensPerSecond} tokens/sec)`
      );
      console.log(
        `  Total tokens: ~${Math.round(totalTokens)} (input: ~${Math.round(
          inputTokens
        )}, output: ~${Math.round(outputTokens)})`
      );

      results.push({
        runNumber: i + 1,
        responseTime: timeTaken,
        response: responseContent,
        tokens: {
          input: Math.round(inputTokens),
          output: Math.round(outputTokens),
          total: Math.round(totalTokens),
        },
        approximateTokensPerSecond: parseFloat(tokensPerSecond),
      });
    } catch (error) {
      console.error(
        `  Error testing ${modelName} (Run ${i + 1}): ${error.message}`
      );
      results.push({
        runNumber: i + 1,
        error: error.message,
      });
    }
  }

  // Calculate average (if we have valid results)
  const validRuns = results.filter((r) => !r.error);
  let averageTime = null;
  let averageTokensPerSecond = null;
  let averageTokenCounts = {
    input: 0,
    output: 0,
    total: 0,
  };

  if (validRuns.length > 0) {
    averageTime =
      validRuns.reduce((sum, run) => sum + run.responseTime, 0) /
      validRuns.length;
    averageTokensPerSecond =
      validRuns.reduce((sum, run) => sum + run.approximateTokensPerSecond, 0) /
      validRuns.length;

    // Calculate average token counts
    averageTokenCounts = {
      input: Math.round(
        validRuns.reduce((sum, run) => sum + run.tokens.input, 0) /
          validRuns.length
      ),
      output: Math.round(
        validRuns.reduce((sum, run) => sum + run.tokens.output, 0) /
          validRuns.length
      ),
      total: Math.round(
        validRuns.reduce((sum, run) => sum + run.tokens.total, 0) /
          validRuns.length
      ),
    };
  }

  return {
    model: modelName,
    averageResponseTime: averageTime ? `${averageTime.toFixed(2)}ms` : "N/A",
    averageTokensPerSecond: averageTokensPerSecond
      ? `${averageTokensPerSecond.toFixed(2)}`
      : "N/A",
    averageTokenCounts: averageTokenCounts,
    runs: results,
  };
}

// Main function to run tests on all models
async function runSpeedComparison() {
  console.log("Starting Ollama model speed comparison...");
  console.log(`Testing with prompt: "${TEST_CONFIG.promptToUse}"`);
  console.log(`Number of runs per model: ${TEST_CONFIG.numRuns}`);

  const allResults = {};

  // Test each model in sequence
  for (const model of MODELS) {
    try {
      const modelResult = await testModelSpeed(model);
      allResults[model] = modelResult;
    } catch (error) {
      console.error(`Failed to test model ${model}: ${error.message}`);
      allResults[model] = { error: error.message };
    }
  }

  // Sort models by average response time
  const sortedResults = Object.values(allResults)
    .filter((r) => r.averageResponseTime !== "N/A")
    .sort((a, b) => {
      const timeA = parseFloat(a.averageResponseTime);
      const timeB = parseFloat(b.averageResponseTime);
      return timeA - timeB;
    });

  // Display summary
  console.log("\n--- RESULTS SUMMARY ---");
  console.log("Models ranked by response time (fastest first):");

  sortedResults.forEach((result, index) => {
    console.log(
      `${index + 1}. ${result.model}: ${result.averageResponseTime} (${
        result.averageTokensPerSecond
      } tokens/sec, avg total tokens: ${result.averageTokenCounts.total})`
    );
  });

  // List models that failed all runs
  const failedModels = Object.values(allResults).filter(
    (r) => r.averageResponseTime === "N/A"
  );
  if (failedModels.length > 0) {
    console.log("\nModels with errors:");
    failedModels.forEach((result) => {
      console.log(`- ${result.model}: Could not calculate average`);
    });
  }

  // Save results to file
  await writeFile(
    TEST_CONFIG.outputFile,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        prompt: TEST_CONFIG.promptToUse,
        numRuns: TEST_CONFIG.numRuns,
        results: allResults,
      },
      null,
      2
    )
  );

  console.log(`\nDetailed results saved to ${TEST_CONFIG.outputFile}`);
}

// Run the speed comparison
runSpeedComparison().catch((error) => {
  console.error("Speed comparison failed:", error);
  process.exit(1);
});
