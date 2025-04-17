# Ollama Performance Test

A simple tool to compare response speeds of different Ollama models.

## Features

- Test multiple Ollama models with the same prompt
- Compare response times and token generation speeds
- Run multiple tests per model for more accurate results
- Save detailed results to a JSON file for further analysis

## Prerequisites

- Node.js (v14 or later recommended)
- [Ollama](https://ollama.ai/) installed with your models of choice
- Ollama server running locally (default: http://localhost:11434)

## Installation

1. Clone this repository:
   ```
   git clone https://github.com/iamstufff/ollama-performance-test.git
   cd ollama-performance-test
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Configuration

Edit the `ollama-speed-test.js` file to:

1. Modify the `MODELS` array to include the models you have installed:
   ```javascript
   const MODELS = [
     "deepseek-r1:8b-llama-distill-q4_K_M",
     "deepseek-r1:14b",
     "mistral-nemo:latest",
     // Add more models as needed
   ];
   ```

2. Customize the test configuration if needed:
   ```javascript
   const TEST_CONFIG = {
     promptToUse: 'Explain quantum computing in simple terms.',
     numRuns: 3, // Number of runs per model for averaging results
     outputFile: 'speed-results.json',
   };
   ```

## Running the Tests

Start your tests with:

```
npm test
```

Or run directly with:

```
node ollama-speed-test.js
```

## Understanding the Results

The script will:

1. Run the specified number of tests for each model
2. Calculate average response times and token generation speeds
3. Display a ranked summary in the console
4. Save detailed results to the specified output file

Example output:

```
--- RESULTS SUMMARY ---
Models ranked by response time (fastest first):
1. deepseek-r1:1.5b: 1520.67ms (28.85 tokens/sec)
2. phi:2.7b: 2542.33ms (22.74 tokens/sec)
3. gemma3:1b: 3124.00ms (18.88 tokens/sec)
4. mistral:7b: 4345.33ms (11.45 tokens/sec)

Detailed results saved to speed-results.json
```

## Troubleshooting

- Make sure the Ollama server is running before starting tests
- Verify that all models listed in the `MODELS` array are installed in Ollama
- If a model consistently fails, try running it directly through Ollama to check for issues
- If you encounter an ESM error, ensure that `"type": "module"` is in your package.json

## Notes About ESM

This project uses ES modules. If you encounter any issues with imports, make sure:
- Your package.json has `"type": "module"`
- You're using `import` syntax instead of `require()`
- Your Node.js version supports ES modules (v14+)

## License

MIT
