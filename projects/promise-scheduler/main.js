class AdvancedPromisePool {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.active = 0;
    this.queue = [];
  }

  // Factory function like p-limit
  async run(fn, ...args) {
    return new Promise((resolve, reject) => {
      const task = {
        fn,
        args,
        resolve,
        reject,
      };

      this.queue.push(task);
      this.#dequeue();
    });
  }

  #dequeue() {
    // If nothing to process or at capacity
    if (this.active >= this.concurrency || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    this.active++;

    // Execute task
    Promise.resolve(task.fn(...task.args))
      .then((result) => {
        task.resolve(result);
      })
      .catch((error) => {
        task.reject(error);
      })
      .finally(() => {
        this.active--;
        this.#dequeue(); // Process next
      });
  }

  // Get active count
  get pending() {
    return this.queue.length;
  }

  get running() {
    return this.active;
  }
}

class RateLimitedAPIClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL;
    this.rateLimit = options.rateLimit || 10; // requests per second
    this.concurrency = options.concurrency || 3;
    this.pool = new AdvancedPromisePool(this.concurrency);
    this.rateLimiter = this.#createRateLimiter();
  }

  #createRateLimiter() {
    const tokens = this.rateLimit;
    let available = tokens;
    const interval = 1000; // 1 second window

    setInterval(() => {
      available = Math.min(tokens, available + tokens);
    }, interval);

    return {
      async acquire() {
        while (available <= 0) {
          await sleep(100); // Wait for tokens
        }
        available--;
      },
    };
  }

  async get(path, options = {}) {
    return this.request("GET", path, options);
  }

  async post(path, body, options = {}) {
    return this.request("POST", path, { ...options, body });
  }

  async request(method, path, options = {}) {
    const execute = async () => {
      // Wait for rate limit token
      await this.rateLimiter.acquire();

      const url = `${this.baseURL}${path}`;
      console.log(`🌐 ${method} ${url}`);

      const response = await fetch(url, {
        method,
        ...options,
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    };

    return this.pool.run(execute);
  }

  async batchRequests(requests) {
    const promises = requests.map((req) =>
      this.request(req.method, req.path, req.options),
    );
    return Promise.allSettled(promises);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Demo: Simulate API client with rate limiting
async function demoAPIClient() {
  const api = new RateLimitedAPIClient({
    baseURL: "https://jsonplaceholder.typicode.com",
    rateLimit: 5, // 5 requests per second
    concurrency: 2, // 2 at a time
  });

  // Fetch multiple resources
  const requests = Array.from({ length: 10 }, (_, i) => ({
    method: "GET",
    path: `/posts/${i + 1}`,
  }));

  console.log("🚀 Starting API requests with rate limiting...\n");
  const results = await api.batchRequests(requests);

  console.log("\n📊 Results:");
  results.forEach((result, i) => {
    if (result.status === "fulfilled") {
      console.log(`  ✓ Post ${i + 1}: ${result.value.title}`);
    } else {
      console.log(`  ✗ Post ${i + 1}: ${result.reason.message}`);
    }
  });
}

demoAPIClient().catch(console.error);