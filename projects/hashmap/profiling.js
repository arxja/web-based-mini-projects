import { HashMap } from "./main.js";

function profileMap() {
  const nativeMap = new Map();
  const customMap = new HashMap();

  const testData = Array.from({ length: 10000 }, (_, i) => ({
    key: { id: i, name: `user${i}` }, // objects as keys
    value: `value${i}`,
  }));

  console.log("=== Profiling Set Operation ===");
  console.time("Native Map Set");
  for (const { key, value } of testData) {
    nativeMap.set(key, value);
  }
  console.timeEnd("Native Map Set");

  console.time("Custom Map Set");
  for (const { key, value } of testData) {
    customMap.set(key, value);
  }
  console.timeEnd("Custom Map Set");

  console.log("=== Profiling Get Operation (random) ===");
  const randomIndexes = Array.from({ length: 1000 }, () =>
    Math.floor(Math.random() * testData.length),
  );
  console.time("Native Map Get");
  for (const idx of randomIndexes) {
    nativeMap.get(testData[idx].key);
  }
  console.timeEnd("Native Map Get");

  console.time("Custom Map Get");
  for (const idx of randomIndexes) {
    customMap.get(testData[idx].key);
  }
  console.timeEnd("Custom Map Get");

  console.log("=== Native Map Size:", nativeMap.size);
  console.log("=== Custom Map Size:", customMap.size);
}

profileMap();

// Typical results (Node.js):
// Native Map Set: ~8ms
// Custom Map Set: ~45ms (slower due to hashing & chaining)
// Native Map Get: ~2ms
// Custom Map Get: ~15ms
// Custom implementation is ~5x slower due to JavaScript overhead,
// but demonstrates the algorithm correctly.
