# Priority Task Scheduler

> A robust, priority-based task scheduling system built on a MinHeap data structure with support for dynamic priority aging, retry logic, and parallel execution.

## 🎯 About

This project is a comprehensive implementation of a priority-based task scheduler that demonstrates advanced data structure usage, asynchronous programming, and real-world scheduling patterns. Built around a custom MinHeap implementation, the system provides efficient O(log n) priority queue operations with features like automatic priority aging, task retries with exponential backoff, and configurable parallel execution.

The scheduler is designed to handle realistic scenarios such as task timeouts, retry mechanisms, and dynamic priority adjustments, making it an excellent learning tool for understanding heap data structures and building production-ready job queues.

## ✨ Features

- **MinHeap Implementation**: Complete, type-safe heap with O(log n) push/pop operations
- **Priority Aging**: Tasks waiting longer automatically increase in priority (configurable)
- **Automatic Retry Logic**: Failed tasks are re-queued with adjusted priority
- **Parallel Execution**: Configurable maximum concurrent task processing
- **Task Timeout Protection**: Prevents tasks from running indefinitely
- **Comprehensive Tracking**: Complete execution history with statistics
- **Priority-based Sorting**: Lower numbers = higher priority
- **Task Metadata Support**: Flexible task configuration with custom executors
- **Heap Visualization**: Built-in tree visualization helper
- **Execution Summary**: Detailed reporting of task outcomes

## 🎯 What You'll Learn

- **Data Structures**: Complete MinHeap implementation from scratch
- **Priority Queues**: Understanding heap operations and priority-based sorting
- **Asynchronous JavaScript**: Working with Promises, async/await, and race conditions
- **Concurrency Patterns**: Parallel task execution with Promise.all
- **Error Handling**: Retry logic with exponential backoff
- **Algorithm Design**: Priority aging algorithms and dynamic priority adjustment
- **Software Design Patterns**: Static factory methods, private class fields, and composition
- **Real-world Application**: Building production-ready task queues

## 💻 How to Use

### Basic Setup

```javascript
const scheduler = new PriorityTaskScheduler({
  enableAging: true, // Enable priority aging
  agingFactor: 0.1, // Priority improvement per second
  maxParallel: 2, // Number of tasks to process concurrently
  taskTimeout: 30000, // Task timeout in milliseconds
});
```

### Adding Tasks

```js
// Add a simple task
scheduler.addTask("Data Backup", 3, {
  executor: async () => {
    await sleep(2000);
    return "Backup completed successfully";
  },
});

// Add a task with custom retry settings
scheduler.addTask("Critical Operation", 1, {
  executor: async () => {
    // Task logic here
    return "Operation completed";
  },
  maxAttempts: 5, // Maximum retry attempts
});
```

### Processing Tasks

```js
// Process a single task
await scheduler.processNextTask();

// Process all tasks in parallel
const results = await scheduler.processAll();

// Get current statistics
const stats = scheduler.getStats();
console.log(stats);
```

### Priority Management

```js
// Lower number = higher priority
scheduler.addTask("Emergency Fix", 1); // Highest priority
scheduler.addTask("Regular Update", 5); // Medium priority
scheduler.addTask("Cleanup Task", 10); // Lowest priority

// Tasks age over time - waiting tasks get priority boosts
// So a cleanup task waiting 10 seconds might become priority 9
```

## 🎨 Customization

### Custom Task Executors

```js
// With error handling
scheduler.addTask("API Call", 2, {
  executor: async () => {
    const response = await fetch("https://api.example.com/data");
    if (!response.ok) throw new Error("API request failed");
    return await response.json();
  },
});

// With progress tracking
scheduler.addTask("Large Export", 3, {
  executor: async () => {
    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      console.log(`Progress: ${i}%`);
      await sleep(100);
    }
    return "Export completed";
  },
});
```

### Custom Retry Logic

```js
// Task will retry up to 5 times with increasing priority
scheduler.addTask("Unstable Service", 4, {
  executor: async () => {
    if (Math.random() > 0.3) {
      throw new Error("Service temporarily unavailable");
    }
    return "Service call successful";
  },
  maxAttempts: 5,
});
```

## 📁 Project Structure

```text
priority-queue/
├── main.js           # Complete implementation with MinHeap and Scheduler
└── README.md          # This file
```

## 📊 Example Output

```js
📝 Added: "Critical Bug Fix" (priority: 1)
📝 Added: "User Data Backup" (priority: 3)

🚀 STARTING TASK SCHEDULER (max parallel: 2)
📊 Queue size: 6

🔄 Processing: "Critical Bug Fix" (priority: 1)
✅ Completed: "Critical Bug Fix"

🔄 Processing: "Security Patch" (priority: 2)
✅ Completed: "Security Patch"

==================================================
📊 EXECUTION SUMMARY
==================================================
⏱️  Total time: 3.25s
✅ Completed: 5
❌ Failed: 1
📝 Remaining: 0

✅ Completed tasks:
  • Critical Bug Fix (priority: 1)
  • Security Patch (priority: 2)
  • User Data Backup (priority: 3)
```

## 📝 License
MIT License - feel free to use, modify, and distribute this code for learning and production purposes.
