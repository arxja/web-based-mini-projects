# 🗃️ LRU Cache

> A clean, production-ready LRU (Least Recently Used) cache implementation in JavaScript using Map's native insertion order

## 🎯 About

An LRU Cache is like your phone's recent apps - when memory fills up, it automatically removes the item you haven't used for the longest time. This project implements a complete LRU Cache from scratch in just ~30 lines of clean JavaScript.

**Why build this?** Understanding LRU Cache teaches you fundamental computer science concepts like caching strategies, O(1) time complexity, and how Map preserves insertion order - all while building something you can actually use in real projects (database query caching, API response caching, browser history, etc.).

## ✨ Features

- **⚡ O(1) Operations** - Both `get()` and `put()` run in constant time
- **📏 Automatic Eviction** - Removes least recently used item when capacity is exceeded
- **🔄 Order Tracking** - Automatically tracks access order using JavaScript Map
- **📊 Stats Tracking** - Optional hit/miss ratio monitoring
- **🔍 Debug Support** - Peek at cache order without modifying recency
- **🧹 Clean Methods** - `size()`, `clear()`, and `getOrder()` helpers

## 🎯 What You'll Learn

- **Map Insertion Order** - How JavaScript's Map maintains key order and why it's perfect for LRU
- **Caching Strategies** - Understanding LRU vs LFU vs FIFO eviction policies
- **Time Complexity** - Why O(1) matters and how to achieve it
- **Real-World Problem Solving** - How databases, browsers, and CDNs manage memory
- **JavaScript Edge Cases** - Handling capacity limits, updates, and key management

## 💻 How to Use

### Basic Usage

```javascript
// Import or copy the class
import LRUCache from "./lru-cache.js";

// Create a cache that holds 3 items
const cache = new LRUCache(3);

// Add items
cache.put("A", "Apple");
cache.put("B", "Banana");
cache.put("C", "Cherry");

// Access an item (moves it to most recent)
console.log(cache.get("B")); // Returns 'Banana'

// Add new item when full - evicts least recent ('A')
cache.put("D", "Date");

console.log(cache.get("A")); // Returns -1 (was evicted)
console.log(cache.get("D")); // Returns 'Date'
```

### Advance Usage

```js
const cache = new LRUCache(3);

cache.put("user:1", { name: "Alice" });
cache.put("user:2", { name: "Bob" });
cache.get("user:1");

console.log(cache.getStats());
// {
//   size: 2,
//   capacity: 3,
//   hitRate: '100.00%',
//   hits: 1,
//   misses: 0
// }

// See current order (most recent last)
console.log(cache.getOrder()); // ['user:2', 'user:1']
```

### Real-World Example: API Response Caching

```js
class APICache {
  constructor(maxEntries = 50) {
    this.cache = new LRUCache(maxEntries);
  }

  async fetch(endpoint) {
    // Check cache first
    const cached = this.cache.get(endpoint);
    if (cached !== -1) {
      console.log(`📦 Cache hit: ${endpoint}`);
      return cached;
    }

    // Fetch from API
    console.log(`🌐 Fetching: ${endpoint}`);
    const response = await fetch(endpoint);
    const data = await response.json();

    // Store in cache
    this.cache.put(endpoint, data);
    return data;
  }
}
```

## 🎨 Customization

- **Add TTL (Time To Live)** - Auto-expire entries after X milliseconds
- **Persistent Storage** - Save cache to localStorage between sessions
- **Size-Based Eviction** - Evict by total bytes instead of item count
- **LFU Cache** - Track frequency instead of recency
- **Async Loading** - Preload frequently accessed items
- **Event Emitter** - Emit 'evict' events when items are removed

## 📁 Project Structure

```text
lru-cache/
├── example.js     # Usage examples and demos
├── main.js     # Main LRU Cache implementation
└── README.md     # This file
```

## 🚀 Run Locally

```bash
# Clone the repository
git clone <repo remote url>.git
cd lru-cache

# Run with Node.js or Bun
node/bun lru-cache.js
node/bun example.js
```

