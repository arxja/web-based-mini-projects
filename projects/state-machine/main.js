function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class StateMachine {
  constructor(config) {
    this.initialState = config.initial;
    this.currentState = config.initial;
    this.states = config.states;
    this.context = config.context || {};
    this.listeners = [];

    // Validate initial state
    if (!this.states[this.initialState]) {
      throw new Error(`Invalid initial state ${this.initialState}`);
    }
  }

  // Get the current state
  get state() {
    return this.currentState;
  }

  // Transition to new state
  transition(event, payload = {}) {
    const currentStateConfig = this.states[this.currentState];

    if (!currentStateConfig) {
      throw new Error(`Invalid state: ${this.currentState}`);
    }

    // Check if transition is allowed
    const transition = currentStateConfig.on?.[event];

    if (!transition) {
      console.warn(
        `Invalid transition: ${this.currentState} -> ${event}. Allowed: ${Object.keys(
          currentStateConfig.on || {},
        ).join(", ")}`,
      );
      return false;
    }

    // Get the target state
    const targetState =
      typeof transition === "string" ? transition : transition.target;

    // Run guards if they exist
    if (typeof transition === "object" && transition.guard) {
      const guardFn = transition.guard;
      if (!guardFn(this.context, payload)) {
        console.log(
          `Guard prevented transition: ${this.currentState} -> ${event}`,
        );
        return false;
      }
    }

    // Execute exit action of current state
    if (currentStateConfig.exit) {
      currentStateConfig.exit(this.context, payload);
    }

    // Update state
    const previousState = this.currentState;
    this.currentState = targetState;

    // Execute transition action
    if (typeof transition === "object" && transition.action) {
      transition.action(this.context, payload);
    }

    // Execute entry action of new state
    const newStateConfig = this.states[targetState];
    if (newStateConfig.entry) {
      newStateConfig.entry(this.context, payload);
    }

    // Notify listeners
    this.listeners.forEach((listener) =>
      listener({
        previousState,
        currentState: targetState,
        event,
        payload,
        context: this.context,
      }),
    );

    return true;
  }

  // Subscribe to state changes
  onChange(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  // Check if can transition
  can(event) {
    const currentStateConfig = this.states[this.currentState];
    return !!currentStateConfig.on?.[event];
  }

  // Get allowed transitions
  getAllowedTransitions() {
    const currentStateConfig = this.states[this.currentState];
    return Object.keys(currentStateConfig.on || {});
  }

  // Reset to initial state
  reset() {
    this.currentState = this.initialState;
    this.notifyListeners();
  }
}

// DEMO: Simple Toggle
const toggleMachine = new StateMachine({
  initial: "off",
  states: {
    off: {
      on: { TOGGLE: "on" },
    },
    on: {
      on: { TOGGLE: "off" },
    },
  },
});

console.log("Toggle Machine Demo:");
console.log("Initial:", toggleMachine.state); // off
toggleMachine.transition("TOGGLE");
console.log("After toggle:", toggleMachine.state); // on
toggleMachine.transition("TOGGLE");
console.log("After toggle:", toggleMachine.state); // off
toggleMachine.transition("INVALID"); // Warning: Invalid transition

class FetchMachine {
  constructor(options = {}) {
    this.machine = new StateMachine({
      initial: "idle",
      context: {
        data: null,
        error: null,
        retryCount: 0,
        maxRetries: options.maxRetries || 3,
        url: options.url || "",
        retryDelay: options.retryDelay || 1000,
      },
      states: {
        // IDLE STATE
        idle: {
          entry: (ctx) => {
            console.log("💤 Machine idle");
            ctx.data = null;
            ctx.error = null;
            ctx.retryCount = 0;
          },
          on: {
            FETCH: {
              target: "loading",
              guard: (ctx) => {
                if (!ctx.url) {
                  console.error("No URL provided");
                  return false;
                }
                return true;
              },
            },
          },
        },

        // LOADING STATE
        loading: {
          entry: (ctx) => {
            console.log("⏳ Loading...");
            this._executeFetch(ctx);
          },
          on: {
            SUCCESS: {
              target: "success",
              action: (ctx, payload) => {
                ctx.data = payload.data;
                console.log("✅ Data loaded");
              },
            },
            ERROR: {
              target: "error",
              action: (ctx, payload) => {
                ctx.error = payload.error;
                console.log("❌ Error occurred");
              },
            },
            CANCEL: "idle",
          },
          exit: (ctx) => {
            // Cleanup any ongoing requests
            if (ctx.abortController) {
              ctx.abortController.abort();
            }
          },
        },

        // SUCCESS STATE
        success: {
          entry: (ctx) => {
            console.log("✨ Success! Data available");
          },
          on: {
            RESET: "idle",
            FETCH: "loading", // Can fetch again from success
          },
        },

        // ERROR STATE
        error: {
          entry: (ctx) => {
            console.log(
              `⚠️  Error (attempt ${ctx.retryCount + 1}/${ctx.maxRetries})`,
            );
          },
          on: {
            RETRY: {
              target: "loading",
              guard: (ctx) => {
                if (ctx.retryCount >= ctx.maxRetries) {
                  console.log("❌ Max retries reached");
                  return false;
                }
                return true;
              },
              action: (ctx) => {
                ctx.retryCount++;
              },
            },
            RESET: "idle",
            IGNORE: "idle",
          },
        },
      },
    });

    // Auto-retry on error
    this.machine.onChange(({ currentState, context }) => {
      if (currentState === "error" && context.retryCount < context.maxRetries) {
        console.log(`🔄 Auto-retrying in ${context.retryDelay}ms...`);
        setTimeout(() => {
          this.retry();
        }, context.retryDelay);
      }
    });
  }

  async _executeFetch(ctx) {
    ctx.abortController = new AbortController();

    try {
      const response = await fetch(ctx.url, {
        signal: ctx.abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      this.machine.transition("SUCCESS", { data });
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request cancelled");
      } else {
        this.machine.transition("ERROR", { error });
      }
    }
  }

  fetch(url) {
    if (url) {
      this.machine.context.url = url;
    }
    return this.machine.transition("FETCH");
  }

  retry() {
    return this.machine.transition("RETRY");
  }

  cancel() {
    return this.machine.transition("CANCEL");
  }

  reset() {
    return this.machine.transition("RESET");
  }

  get state() {
    return this.machine.state;
  }

  get context() {
    return this.machine.context;
  }

  onChange(listener) {
    return this.machine.onChange(listener);
  }

  getStatus() {
    return {
      state: this.machine.state,
      isLoading: this.machine.state === "loading",
      isSuccess: this.machine.state === "success",
      isError: this.machine.state === "error",
      isIdle: this.machine.state === "idle",
      canRetry: this.machine.can("RETRY"),
      canFetch: this.machine.can("FETCH"),
      data: this.machine.context.data,
      error: this.machine.context.error,
      retryCount: this.machine.context.retryCount,
    };
  }
}

// DEMO: Using the Fetch Machine
async function demoFetchMachine() {
  console.log("🚀 Fetch Machine Demo\n");

  const fetcher = new FetchMachine({
    maxRetries: 3,
    retryDelay: 1000,
  });

  // Subscribe to state changes
  const unsubscribe = fetcher.onChange(
    ({ previousState, currentState, event }) => {
      console.log(
        `📍 Transition: ${previousState} → ${currentState} (${event})`,
      );
      console.log("Status:", fetcher.getStatus(), "\n");
    },
  );

  // Try fetching a valid URL
  console.log("1️⃣  Fetching valid data...");
  fetcher.fetch("https://jsonplaceholder.typicode.com/posts/1");
  await sleep(3000);

  // Try fetching an invalid URL (will trigger retry)
  console.log("\n2️⃣  Fetching invalid URL...");
  fetcher.fetch("https://invalid-url.example.com/data");
  await sleep(5000);

  unsubscribe();
}

demoFetchMachine().catch(console.error);
