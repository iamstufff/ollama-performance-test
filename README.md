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
     'llama3',
     'mistral',
     'gemma',
     // Add your installed models here
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
1. phi3: 3520.67ms (24.85 tokens/sec)
2. gemma: 5142.33ms (16.74 tokens/sec)
3. llama3: 6824.00ms (12.88 tokens/sec)
4. mistral: 7345.33ms (11.45 tokens/sec)

Detailed results saved to speed-results.json
```

## Troubleshooting

- Make sure the Ollama server is running before starting tests
- Verify that all models listed in the `MODELS` array are installed in Ollama
- If a model consistently fails, try running it directly through Ollama to check for issues

## License

MIT
