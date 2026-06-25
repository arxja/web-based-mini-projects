class MinHeap {
  constructor() {
    this.heap = [];
  }

  // Utility methods
  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  peek() {
    return this.heap[0] || null;
  }

  // Index calculation

  #parentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  #leftChildIndex(i) {
    return 2 * i + 1;
  }

  #rightChildIndex(i) {
    return 2 * i + 2;
  }

  // Swap Helper
  #swap(i, j) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }

  // CORE OPERATION 1: Push (bubble up)
  push(value) {
    // Step 1: Add to end of array
    this.heap.push(value);

    // Step 2: Bubble up to correct position
    this.#bubbleUp(this.heap.length - 1);

    return this;
  }

  #bubbleUp(index) {
    let currentIndex = index;

    while (currentIndex > 0) {
      const parentIndex = this.#parentIndex(currentIndex);

      // If current is smaller than parent, swap
      if (this.heap[currentIndex] < this.heap[parentIndex]) {
        this.#swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
      } else {
        // Found correct position
        break;
      }
    }
  }

  // CORE OPERATION 2: Pop (bubble down)
  pop() {
    if (this.isEmpty()) return null;

    // Step 1: Save root (minimum value)
    const minValue = this.heap[0];

    // Step 2: Move last element to root
    const lastValue = this.heap.pop();

    // Step 3: If heap not empty, bubble down the new root
    if (!this.isEmpty()) {
      this.heap[0] = lastValue;
      this.#bubbleDown(0);
    }

    return minValue;
  }

  #bubbleDown(index) {
    let currentIndex = index;

    while (true) {
      const leftIndex = this.#leftChildIndex(currentIndex);
      const rightIndex = this.#rightChildIndex(currentIndex);
      let smallestIndex = currentIndex;

      // Check if left child is smaller
      if (
        leftIndex < this.heap.length &&
        this.heap[leftIndex] < this.heap[smallestIndex]
      ) {
        smallestIndex = leftIndex;
      }

      // Check if right child is smaller
      if (
        rightIndex < this.heap.length &&
        this.heap[rightIndex] < this.heap[smallestIndex]
      ) {
        smallestIndex = rightIndex;
      }

      // If smallest is not current, swap and continue
      if (smallestIndex !== currentIndex) {
        this.#swap(currentIndex, smallestIndex);
        currentIndex = smallestIndex;
      } else {
        break; // Found correct position
      }
    }
  }

  // Build heap from array (heapify)
  static fromArray(arr) {
    const heap = new MinHeap();
    heap.heap = [...arr];

    // Start from last non-leaf node and bubble down each
    const lastNonLeaf = Math.floor(heap.heap.length / 2) - 1;
    for (let i = lastNonLeaf; i >= 0; i--) {
      heap.#bubbleDown(i);
    }

    return heap;
  }

  // Visualization
  visualize() {
    IndexCalculator.visualizeTree(this.heap);
  }
}

class PriorityTask {
  constructor(name, priority, metadata = {}) {
    this.name = name;
    this.priority = priority; // lower number = higher priority
    this.createdAt = Date.now();
    this.metadata = metadata;
    this.status = "pending";
    this.attempts = 0;
    this.maxAttempts = metadata.maxAttempts || 3;
  }
}

class PriorityTaskScheduler {
  constructor(options = {}) {
    this.heap = new MinHeap();
    this.taskMap = new Map(); // For O(1) lookup
    this.completedTasks = [];
    this.failedTasks = [];
    this.isRunning = false;

    // Configuration
    this.enableAging = options.enableAging !== false;
    this.agingFactor = options.agingFactor || 0.1; // Priority improvement per second
    this.maxParallel = options.maxParallel || 1;
    this.taskTimeout = options.taskTimeout || 30000; // 30 seconds
  }

  // Add task with priority (lower number = higher priority)
  addTask(name, priority, metadata = {}) {
    const task = new PriorityTask(name, priority, metadata);

    // Store in heap - custom comparison for task objects
    this.heap.push({
      task,
      get priority() {
        return task.priority;
      },
    });

    this.taskMap.set(name, task);
    console.log(`📝 Added: "${name}" (priority: ${priority})`);

    return task;
  }

  // Get highest priority task without removing
  peekNextTask() {
    if (this.heap.isEmpty()) return null;
    return this.heap.peek().task;
  }

  // Process single highest priority task
  async processNextTask() {
    if (this.heap.isEmpty()) {
      console.log("✅ No tasks remaining");
      return null;
    }

    const item = this.heap.pop();
    const task = item.task;

    console.log(`\n🔄 Processing: "${task.name}" (priority: ${task.priority})`);

    try {
      task.status = "running";
      task.attempts++;

      // Execute with timeout
      const result = await this.executeWithTimeout(task);

      task.status = "completed";
      task.completedAt = Date.now();
      task.result = result;
      this.completedTasks.push(task);

      console.log(`✅ Completed: "${task.name}"`);
      return task;
    } catch (error) {
      if (task.attempts < task.maxAttempts) {
        // Re-queue with adjusted priority
        console.log(
          `⚠️  Failed: "${task.name}" (attempt ${task.attempts}/${task.maxAttempts})`,
        );

        task.priority = Math.max(0, task.priority - 1); // Increase priority
        task.status = "pending";

        this.heap.push({
          task,
          get priority() {
            return task.priority;
          },
        });
      } else {
        // Permanently failed
        task.status = "failed";
        task.error = error.message;
        this.failedTasks.push(task);
        console.log(`❌ Permanently failed: "${task.name}"`);
      }
    }

    return task;
  }

  // Execute task with timeout
  async executeWithTimeout(task) {
    const executor = task.metadata.executor || (() => Promise.resolve());

    return Promise.race([
      executor(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Task timeout")), this.taskTimeout),
      ),
    ]);
  }

  // Apply aging to waiting tasks (improve their priority over time)
  applyAging() {
    if (!this.enableAging) return;

    const now = Date.now();
    const heapCopy = [...this.heap.heap];

    this.heap = new MinHeap();

    for (const item of heapCopy) {
      const ageInSeconds = (now - item.task.createdAt) / 1000;
      item.task.priority = Math.max(
        0,
        item.task.priority - ageInSeconds * this.agingFactor,
      );
      this.heap.push(item);
    }

    if (heapCopy.length > 0) {
      console.log(`⏰ Applied aging to ${heapCopy.length} tasks`);
    }
  }

  // Process all tasks with optional parallel execution
  async processAll() {
    console.log(
      `\n🚀 STARTING TASK SCHEDULER (max parallel: ${this.maxParallel})`,
    );
    console.log(`📊 Queue size: ${this.heap.size()}\n`);

    this.isRunning = true;
    const startTime = Date.now();

    const agingInterval = setInterval(() => {
      if (this.isRunning) this.applyAging();
    }, 5000);

    while (!this.heap.isEmpty() && this.isRunning) {
      // Process tasks in parallel batches
      const batchSize = Math.min(this.maxParallel, this.heap.size());
      const batch = [];

      for (let i = 0; i < batchSize; i++) {
        batch.push(this.processNextTask());
      }

      await Promise.all(batch);
    }

    clearInterval(agingInterval);

    const duration = Date.now() - startTime;
    this.printSummary(duration);

    return {
      completed: this.completedTasks,
      failed: this.failedTasks,
      duration,
    };
  }

  // Cancel all tasks
  cancelAll() {
    this.isRunning = false;
    console.log("🛑 Task scheduler cancelled");
  }

  // Print execution summary
  printSummary(duration) {
    console.log("\n" + "=".repeat(50));
    console.log("📊 EXECUTION SUMMARY");
    console.log("=".repeat(50));
    console.log(`⏱️  Total time: ${(duration / 1000).toFixed(2)}s`);
    console.log(`✅ Completed: ${this.completedTasks.length}`);
    console.log(`❌ Failed: ${this.failedTasks.length}`);
    console.log(`📝 Remaining: ${this.heap.size()}`);

    if (this.completedTasks.length > 0) {
      console.log("\n✅ Completed tasks:");
      this.completedTasks.forEach((task) => {
        console.log(`  • ${task.name} (priority: ${task.priority})`);
      });
    }

    if (this.failedTasks.length > 0) {
      console.log("\n❌ Failed tasks:");
      this.failedTasks.forEach((task) => {
        console.log(`  • ${task.name}: ${task.error}`);
      });
    }
  }

  // Get statistics
  getStats() {
    return {
      queueSize: this.heap.size(),
      completed: this.completedTasks.length,
      failed: this.failedTasks.length,
      nextTask: this.peekNextTask()?.name || null,
      averageWaitTime:
        this.completedTasks.reduce((sum, task) => {
          return sum + (task.completedAt - task.createdAt);
        }, 0) / (this.completedTasks.length || 1),
    };
  }
}

// DEMO: Simulating real tasks
async function demoScheduler() {
  const scheduler = new PriorityTaskScheduler({
    enableAging: true,
    maxParallel: 2, // Process 2 tasks at once
    taskTimeout: 5000,
  });

  // Add tasks with different priorities
  scheduler.addTask("Critical Bug Fix", 1, {
    executor: async () => {
      await sleep(1000);
      return "Bug fixed in production";
    },
    maxAttempts: 5,
  });

  scheduler.addTask("User Data Backup", 3, {
    executor: async () => {
      await sleep(2000);
      return "Backup completed";
    },
  });

  scheduler.addTask("Generate Report", 5, {
    executor: async () => {
      await sleep(1500);
      return "Report generated";
    },
  });

  scheduler.addTask("Send Welcome Emails", 4, {
    executor: async () => {
      if (Math.random() > 0.5) {
        throw new Error("Email service down");
      }
      await sleep(500);
      return "Emails sent";
    },
    maxAttempts: 2,
  });

  scheduler.addTask("Clean Temp Files", 8, {
    executor: async () => {
      await sleep(300);
      return "Temp files cleaned";
    },
  });

  scheduler.addTask("Security Patch", 2, {
    executor: async () => {
      await sleep(800);
      return "Security patch applied";
    },
  });

  // Process all tasks
  const results = await scheduler.processAll();

  console.log("\n📈 Final Stats:", scheduler.getStats());
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Run the demo
demoScheduler().catch(console.error);
