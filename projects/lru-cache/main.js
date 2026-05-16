class LRUCache {
  constructor(capacity) {
    if (capacity <= 0) throw new Error("Capacity must be greater than 0");

    this.capacity = capacity;
    this.cache = new Map(); // Map maintains insertion order!

    this.hits = 0;
    this.misses = 0;
  }

  get(key) {
    // Step 1: Check if exists
    if (!this.cache.has(key)) {
      this.misses++;
      return -1;
    }

    // Step 2: Get the value
    this.hits++;
    const value = this.cache.get(key);

    // Step 3: Move to MOST RECENT (end of Map)
    this.cache.delete(key); // Remove from current position
    this.cache.set(key, value); // Re-add at the END

    return value;
  }

  put(key, value) {
    // If key exists, remove it first (so it goes to the end)
    if (this.cache.has(key)) this.cache.delete(key);

    // Add/update at the end (most recent)
    this.cache.set(key, value);

    // If over capacity, remove the FIRST item (least recent)
    if (this.cache.size > this.capacity) {
      const lruKey = this.cache.keys().next().value; // Get first key
      this.cache.delete(lruKey);
    }
  }

  // Useful helper methods

  peek(key) {
    // Get value without marking as recently used
    return this.cache.get(key) || -1;
  }

  getStats() {
    return {
      size: this.cache.size,
      capacity: this.capacity,
      hitRate: ((this.hits / (this.hits + this.misses)) * 100).toFixed(2) + "%",
      hits: this.hits,
      misses: this.misses,
    };
  }

  getOrder() {
    // See current order (for debugging)
    return [...this.cache.keys()];
  }

  size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
}

export default LRUCache