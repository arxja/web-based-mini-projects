const objectHashStore = new WeakMap();
let nextId = 0;

function getObjectHash(obj) {
  if (objectHashStore.has(obj)) {
    return objectHashStore.get(obj);
  }
  const id = `obj_${nextId++}`;
  objectHashStore.set(obj, id);
  return id;
}

function hashKey(key) {
  if (key === null) return "null";
  if (key === undefined) return "undefined";
  if (typeof key === "object" || typeof key === "function") {
    return getObjectHash(key);
  }
  return String(key);
}

export class HashMap {
  constructor(initialCapacity = 16, loadFactor = 0.75) {
    this.capacity = initialCapacity;
    this.loadFactor = loadFactor;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.size = 0;
  }

  // Internal hash: converts key to string and then to a numeric index
  _hash(key) {
    const str = hashKey(key);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash * 31 + str.charCodeAt(i)) & 0x7fffffff; // 31-bit integer
    }
    return hash % this.capacity;
  }

  // Retrieve bucket for a key
  _findBucket(key) {
    const index = this._hash(key);
    const bucket = this.buckets[index];
    for (let i = 0; i < bucket.length; i++) {
      const [k, v] = bucket[i];
      // Need to check equality: for objects, we compare by reference or by our hash
      // Using our hashed string for equality (since we serialized objects)
      // But for proper Map, we must compare by reference.
      // We'll compare by the hash string generated.
      if (hashKey(k) === hashKey(key)) {
        return { bucket, index: i, found: true };
      }
    }
    return { bucket, index: -1, found: false };
  }

  set(key, value) {
    // Ensure we have room
    if (this.size / this.capacity > this.loadFactor) {
      this._resize();
    }

    const { bucket, index, found } = this._findBucket(key);
    if (found) {
      bucket[index] = [key, value]; // update
    } else {
      bucket.push([key, value]);
      this.size++;
    }
    return this;
  }

  get(key) {
    const { bucket, index, found } = this._findBucket(key);
    if (found) {
      return bucket[index][1];
    }
    return undefined;
  }

  has(key) {
    return this._findBucket(key).found;
  }

  delete(key) {
    const { bucket, index, found } = this._findBucket(key);
    if (found) {
      bucket.splice(index, 1);
      this.size--;
      return true;
    }
    return false;
  }

  clear() {
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.size = 0;
  }

  // Re-hashing: double capacity and re-insert all entries
  _resize() {
    const oldBuckets = this.buckets;
    this.capacity = this.capacity * 2;
    this.buckets = new Array(this.capacity).fill(null).map(() => []);
    this.size = 0; // reset, we'll re-add

    for (const bucket of oldBuckets) {
      for (const [key, value] of bucket) {
        this.set(key, value);
      }
    }
  }

  // Iterators
  *entries() {
    for (const bucket of this.buckets) {
      for (const [key, value] of bucket) {
        yield [key, value];
      }
    }
  }

  *keys() {
    for (const [key, value] of this.entries()) {
      yield key;
    }
  }

  *values() {
    for (const [key, value] of this.entries()) {
      yield value;
    }
  }

  // Make it iterable: [Symbol.iterator] returns entries
  [Symbol.iterator]() {
    return this.entries();
  }

  // ForEach method
  forEach(callback, thisArg) {
    for (const [key, value] of this.entries()) {
      callback.call(thisArg, value, key, this);
    }
  }
}
