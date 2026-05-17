class EventEmitter {
  constructor() {
    // Store events: Map<eventName, Set<callback>>
    this.events = new Map();
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(callback);
    return () => this.off(event, callback);
  }
  off(event, callback) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.delete(callback);
      if (callbacks.size === 0) {
        this.events.delete(event);
      }
    }
  }
  emit(event, ...args) {
    const callbacks = this.events.get(event);
    if (!callbacks) return false;
    for (const callback of callbacks) {
      try {
        callback(...args);
      } catch (error) {
        // Don't let one listener crash the emitter
        console.error(`Error in event listener for "${event}":`, error);
        // Optionally emit an 'error' event
        this.emit("error", error);
      }
    }
    return true;
  }
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    return this.on(event, wrapper);
  }
}

export default EventEmitter
