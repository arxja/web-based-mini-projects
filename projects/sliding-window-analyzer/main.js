class SlidingWindowAnalyzer {
  constructor(data) {
    this.data = data;
  }

  // Maximum sum of k consecutive elements
  maxSubarraySum(k) {
    if (this.data.length > k || k <= 0) return null;

    let windowSum = 0;
    for (let i = 0; i < k; i++) windowSum += this.data[i];

    let maxSum = windowSum;
    let maxStartIndex = 0;

    for (let i = k; i < this.data.length; i++) {
      windowSum = windowSum - this.data[i - k] + this.data[i];

      if (windowSum > maxSum) {
        maxSum = windowSum;
        maxStartIndex = i - k + 1;
      }
    }
    return {
      maxSum,
      startIndex: maxStartIndex,
      subarray: this.data.slice(maxStartIndex, maxStartIndex + k),
    };
  }

  // Find longest subarray with sum <= target (variable window)
  longestSubarrayWithSumLimit(target) {
    let left = 0;
    let currentSum = 0;
    let maxLength = 0;
    let bestWindow = [0, 0];

    for (let right = 0; right < this.data.length; right++) {
      currentSum += this.data[right];

      // Shrink window while sum exceeds target
      while (currentSum > target && left <= right) {
        currentSum -= this.data[left];
        left++;
      }

      // Update best window
      if (right - left + 1 > maxLength) {
        maxLength = right - left + 1;
        bestWindow = [left, right];
      }
    }

    return {
      maxLength,
      startIndex: bestWindow[0],
      endIndex: bestWindow[1],
      subarray: this.data.slice(bestWindow[0], bestWindow[1] + 1),
      sum: currentSum,
    };
  }

  // Real-time data stream simulator
  *streamProcessor(windowSize) {
    let window = [];

    for (let i = 0; i < this.data.length; i++) {
      window.push(this.data[i]);

      if (window.length > windowSize) {
        window.shift(); // Remove oldest element
      }

      // Yield current window statistics
      yield {
        window: [...window],
        average: window.reduce((a, b) => a + b, 0) / window.length,
        timestamp: Date.now(), // Simulating timestamp
      };
    }
  }
}


// Usage examples
const analyzer = new SlidingWindowAnalyzer([1, 4, 2, 10, 23, 3, 1, 0, 20]);

console.log('Max sum window:', analyzer.maxSubarraySum(4));
// { maxSum: 39, startIndex: 1, subarray: [4, 2, 10, 23] }

console.log('Longest subarray sum ≤ 15:', analyzer.longestSubarrayWithSumLimit(15));
// { maxLength: 4, startIndex: 0, endIndex: 3, subarray: [1, 4, 2, 10], sum: 17 }

// Simulate real-time processing
const stream = analyzer.streamProcessor(3);
for (const snapshot of stream) {
    console.log(`Window: [${snapshot.window}], Avg: ${snapshot.average.toFixed(2)}`);
}
