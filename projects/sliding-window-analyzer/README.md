# Sliding Window Analyzer

> A comprehensive JavaScript implementation of sliding window algorithms for data analysis and real-time stream processing

## 🔧 About

The Sliding Window Analyzer is an educational JavaScript class that demonstrates three fundamental sliding window techniques used in data processing and algorithm design. It provides hands-on examples of fixed-size windows, variable-size windows, and real-time stream processing, making complex algorithmic concepts accessible through practical, visual examples.

This project serves as both a learning tool for understanding sliding window algorithms and a utility for analyzing numerical data patterns. Each method is implemented with clarity and efficiency, showcasing the O(n) time complexity that makes sliding windows so powerful for data analysis.

## ✨ Features

- **Fixed Window Maximum Sum**: Find the maximum sum of exactly k consecutive elements with start index tracking
- **Variable Window Longest Subarray**: Find the longest contiguous subarray with sum ≤ target using dynamic window sizing
- **Real-time Stream Processing**: Simulate processing of live data streams with sliding window statistics
- **Performance Optimized**: All methods run in O(n) time with O(1) additional space
- **Detailed Output**: Returns both calculated values and the actual subarrays for verification
- **Generator Function**: Implements ES6 generators for memory-efficient stream processing

## 🎯 What You'll Learn

- **Sliding Window Technique**: Master both fixed and variable window approaches
- **Two-Pointer Method**: Understand left/right pointer manipulation for dynamic windows
- **Stream Processing**: Learn how to handle continuous data streams efficiently
- **Algorithm Optimization**: Practice reducing time complexity from O(n²) to O(n)
- **Real-world Applications**: Apply concepts to stock prices, sensor data, and network traffic analysis
- **JavaScript Generators**: Implement memory-efficient data processing with yield statements
- **Edge Case Handling**: Understand window boundaries, empty arrays, and negative values

## 💻 How to Use

### Basic Setup

```javascript
// Create an analyzer with your data
const analyzer = new SlidingWindowAnalyzer([1, 4, 2, 10, 23, 3, 1, 0, 20]);

// 1. Find maximum sum of 4 consecutive elements
const maxSum = analyzer.maxSubarraySum(4);
console.log(maxSum);
// { maxSum: 39, startIndex: 1, subarray: [4, 2, 10, 23] }

// 2. Find longest subarray with sum ≤ 15
const longest = analyzer.longestSubarrayWithSumLimit(15);
console.log(longest);
// { maxLength: 4, startIndex: 0, endIndex: 3, subarray: [1, 4, 2, 10], sum: 17 }

// 3. Process as a data stream with window size 3
const stream = analyzer.streamProcessor(3);
for (const snapshot of stream) {
  console.log(
    `Window: [${snapshot.window}], Avg: ${snapshot.average.toFixed(2)}`,
  );
}
```

## 🎨 Customization

### Add Validation

```js
// Add input validation to maxSubarraySum
maxSubarraySum(k) {
    if (!this.data.length) throw new Error('Data array is empty');
    if (k > this.data.length) throw new Error('k cannot exceed array length');
    if (k <= 0) throw new Error('k must be positive');
    // ... rest of implementation
}
```

### Extend with New Methods

```js
// Find minimum sum of k elements
minSubarraySum(k) {
    // Similar to max but track minimum
}

// Find subarray with sum closest to target
closestSubarrayToTarget(target) {
    // Variable window with absolute difference tracking
}
```

### Modify Stream Processor

```js
// Add more statistics
*streamProcessor(windowSize) {
    // ... existing code
    yield {
        window: [...window],
        average: avg,
        max: Math.max(...window),
        min: Math.min(...window),
        sum: window.reduce((a, b) => a + b, 0),
        timestamp: Date.now()
    };
}
```

## 📁 Project Structure

```text
sliding-window-analyzer/
├── main.js      # Main SlidingWindowAnalyzer class
├── README.md        # This file
```

## 🚀 Run Locally

1. Clone the repository:

```bash
git clone https://github.com/<remote url>
cd sliding-window-analyzer
```
2. Run the example:

```bash
node/bun main.js
# or in browser: open index.html with script tags
```