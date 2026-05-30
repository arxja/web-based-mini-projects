type Subscriber = () => void;

let activeSubscriber: Subscriber | null = null;

export function createSignal<T>(initialValue: T) {
  let value = initialValue;
  const subscribers = new Set<Subscriber>();

  // The getter function
  const get = (): T => {
    // Track who's reading this signal
    if (activeSubscriber) {
      subscribers.add(activeSubscriber);
    }
    return value;
  };

  // The setter function
  const set = (newValue: T) => {
    if (value === newValue) return;
    value = newValue;

    // Notify all subscribers
    for (const sub of subscribers) {
      sub();
    }
  };

  return [get, set] as const;
}

export function createEffect(fn: () => void) {
  const execute = () => {
    activeSubscriber = execute;
    fn();
    activeSubscriber = null;
  };

  execute(); // Run once immediately
}

export function createComputed<T>(fn: () => T): () => T {
  let value: T;

  createEffect(() => {
    value = fn();
  });

  return () => value;
}
