# Ollama Performance Test

A simple tool to compare response speeds of different Ollama models.

## Features

* Test multiple Ollama models with the same prompt
* Compare response times and token generation speeds
* Run multiple tests per model for more accurate results
* Save detailed results to a JSON file for further analysis

## Prerequisites

* Node.js (v14 or later recommended)
* Ollama installed with your models of choice
* Ollama server running locally (default: http://localhost:11434)

## Installation

1. Clone this repository:
```bash
git clone https://github.com/iamstufff/ollama-performance-test.git
cd ollama-performance-test
```

2. Install dependencies:
```bash
npm install
```

## Usage

1. Make sure your Ollama server is running
2. Run the performance test:
```bash
node ollama-speed-test.js
```

## Configuration

Edit the `ollama-speed-test.js` file to:

1. Modify the models you want to test
2. Adjust the test parameters (number of runs, prompt, etc.)
3. Configure output options

## Output Example

```json
{
  "summary": {
    "fastest_model": "deepseek-coder:3b",
    "slowest_model": "mistral:7b",
    "average_response_time": 2845.67
  },
  "detailed_results": {
    // Per-model detailed statistics
  }
}
```

## License

MIT