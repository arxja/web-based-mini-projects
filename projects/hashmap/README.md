# Custom HashMap with Object Key Support

> A from‑scratch HashMap implementation in JavaScript that supports both primitive and object keys, complete with dynamic resizing, iterators, and a performance profiling script against the native `Map`.

## 🎯 About

This project implements a fully functional **HashMap** (hash table) using separate chaining for collision resolution. Unlike JavaScript's native `Map`, this custom implementation demonstrates the core algorithms behind hash maps while adding a unique feature: **object keys are supported via a `WeakMap`‑based identity system**.

The implementation includes:

- **Buckets array** – each bucket is an array of `[key, value]` pairs (separate chaining).
- **Hashing** – converts keys to strings (using a `WeakMap` for objects/functions) and then to a numeric index using a 31‑bit hash.
- **Dynamic resizing** – doubles capacity when the load factor exceeds 0.75, rehashing all entries.
- **Full Map API** – `set`, `get`, `has`, `delete`, `clear`, `size`, `forEach`, and iterators (`entries`, `keys`, `values`, `Symbol.iterator`).

A companion profiling script compares the custom HashMap against the native `Map` for 10,000 object‑keyed insertions and 1,000 random lookups, showing the expected performance gap (custom is ~5x slower due to JavaScript overhead, but algorithmically correct).

## ✨ Features

- **Object keys** – uses a `WeakMap` to assign unique IDs to objects and functions, enabling them as keys.
- **Primitive keys** – supports strings, numbers, booleans, `null`, and `undefined`.
- **Separate chaining** – collisions handled by storing multiple entries in a bucket array.
- **Dynamic resizing** – automatically rehashes when load factor exceeds 0.75 (capacity doubles).
- **Full iteration support** – `entries()`, `keys()`, `values()`, and `[Symbol.iterator]()`.
- **`forEach` method** – iterates with `(value, key, map)` callback.
- **Zero dependencies** – pure vanilla JavaScript, works in Node.js and modern browsers.
- **Profiling script** – benchmarks against native `Map` with clear timing output.

## 🎯 What You'll Learn

- **Hash map internals** – hashing, buckets, collision resolution, load factor, rehashing.
- **WeakMap for object identity** – how to associate metadata with objects without preventing garbage collection.
- **Hash function design** – converting arbitrary keys to numeric indices.
- **Iterators and iterables** – implementing `Symbol.iterator` and generator methods.
- **Performance trade‑offs** – why native `Map` is faster and when a custom implementation might be useful.
- **Algorithm complexity** – average O(1) for `set`/`get`/`delete`, O(n) worst case.

## 🎮 How to Use

### Basic Usage

```js
import { HashMap } from "./main.js";

const map = new HashMap();

// Primitive keys
map.set("name", "Alice");
map.set(42, "answer");
map.set(true, "yes");

// Object keys
const user = { id: 1 };
map.set(user, "User object data");

console.log(map.get("name")); // 'Alice'
console.log(map.get(user)); // 'User object data'
console.log(map.has(42)); // true

// Iteration
for (const [key, value] of map) {
  console.log(key, value);
}

// forEach
map.forEach((value, key) => {
  console.log(key, "=>", value);
});

// Delete
map.delete("name");
console.log(map.size); // 3 (if we added 4 items initially)
```

### Running the Profiling Script

```bash
node profiling.js
```

The script will output timings for `set` and `get` operations on both the native `Map` and the custom `HashMap`, along with final sizes.

### Example Output (Node.js)

```text
=== Profiling Set Operation ===
Native Map Set: ~8ms
Custom Map Set: ~45ms
=== Profiling Get Operation (random) ===
Native Map Get: ~2ms
Custom Map Get: ~15ms
=== Native Map Size: 10000
=== Custom Map Size: 10000
```

## 🎨 Customization

### Adjusting Initial Capacity and Load Factor

```js
const map = new HashMap(32, 0.5); // start with 32 buckets, resize at 50% full
```

### Changing the Hash Function

Modify the `_hash` method to use a different hashing algorithm (e.g., FNV‑1a, djb2).

### Adding New Key Types

The `hashKey` function currently handles primitives and objects/functions. You can extend it to support symbols or other types.

### Disabling Object Key Support

If you only need primitive keys, you can remove the `WeakMap` logic and simplify `hashKey` – but then objects will be converted to `"[object Object]"`, causing collisions.

## 📁 Project Structure

```text
hashmap/
├── main.js          # HashMap implementation (exported class)
├── profiling.js     # Benchmark script comparing custom vs native Map
└── README.md        # This file
```

## 🔧 API Reference

### `new HashMap(initialCapacity = 16, loadFactor = 0.75)`

Creates a new HashMap instance.

### Methods

| Method                       | Description                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| `set(key, value)`            | Adds or updates a key‑value pair. Returns `this` (chainable). |
| `get(key)`                   | Returns the value for `key`, or `undefined`.                  |
| `has(key)`                   | Returns `true` if key exists.                                 |
| `delete(key)`                | Removes the entry. Returns `true` if found and removed.       |
| `clear()`                    | Removes all entries.                                          |
| `size`                       | Number of entries (getter property).                          |
| `forEach(callback, thisArg)` | Iterates with `(value, key, map)`.                            |
| `entries()`                  | Generator yielding `[key, value]` pairs.                      |
| `keys()`                     | Generator yielding keys.                                      |
| `values()`                   | Generator yielding values.                                    |
| `[Symbol.iterator]()`        | Returns `entries()` iterator.                                 |

## 🚀 Run Locally

### Node.js

```bash
node profiling.js
```

### In the Browser

You can import `HashMap` into any modern browser using ES modules:

```html
<script type="module">
  import { HashMap } from "./main.js";
  const map = new HashMap();
  map.set("hello", "world");
  console.log(map.get("hello"));
</script>
```

## 📝 License

MIT License – free to use, modify, and distribute.
