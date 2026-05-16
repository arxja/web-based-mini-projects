import LRUCache from "./main";

const cache = new LRUCache(3);

cache.put("A", 1);
cache.put("B", 2);
cache.put("C", 3);

console.log(cache.getOrder()); // ['A', 'B', 'C'] (A is oldest)

cache.get("A"); // Access A
console.log(cache.getOrder()); // ['B', 'C', 'A'] (A moves to end)

cache.put("D", 4); // Add D, evict B
console.log(cache.getOrder()); // ['C', 'A', 'D']

console.log(cache.getStats());
// { size: 3, capacity: 3, hitRate: '50.00%', hits: 1, misses: 1 }
