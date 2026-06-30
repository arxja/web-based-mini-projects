# State Machine Implementation & Fetch Machine Demo

> A comprehensive, production-ready state machine implementation with a practical HTTP fetch machine demonstrating auto-retry, guards, and event-driven architecture.

## 🏗️ About

This project provides a robust, flexible state machine implementation in JavaScript, complete with a real-world demonstration using an HTTP fetch machine. It's designed to teach core concepts of state management, event-driven architecture, and asynchronous operations in a clean, extensible way.

The implementation showcases how to build predictable, testable state management systems with features like:

- Entry/exit actions for state lifecycle management
- Guard functions for conditional transitions
- Event subscription for reactive programming
- Auto-retry logic for error recovery
- AbortController for request cancellation

## ✨ Features

- **Core State Machine Engine**: Reusable state management with guards, actions, and lifecycle hooks
- **Fetch Machine Implementation**: Practical HTTP client with built-in retry logic
- **Auto-Retry Mechanism**: Automatic retry on failure with configurable delays and max attempts
- **Event Subscription**: Subscribe to state changes with unsubscribe capability
- **Context Management**: Shared data object accessible across all states
- **Guard Functions**: Conditional transitions based on context or payload
- **Entry/Exit Actions**: Side effects when entering or leaving states
- **Error Handling**: Graceful error management with retry, reset, and ignore strategies
- **Request Cancellation**: Abort ongoing requests when transitioning away from loading state
- **Status Reporting**: Comprehensive status object for UI integration
- **Demo Ready**: Toggle machine and fetch machine examples included

## 🎯 What You'll Learn

- **State Machine Fundamentals**: Understanding states, transitions, and events
- **State Lifecycle Management**: Entry/exit actions and transition actions
- **Guard Functions**: Conditional logic for state transitions
- **Event-Driven Architecture**: Pub/sub pattern with listeners
- **Async Operations**: Handling promises and async/await in state machines
- **Error Handling Strategies**: Retry, reset, and ignore patterns
- **Request Cancellation**: Using AbortController with fetch
- **Context Management**: Sharing data across states
- **Testability**: Building predictable, testable state logic
- **Design Patterns**: Observer pattern, state pattern, and more

## 💻 How to Use

### Basic State Machine

```javascript
// Create a simple toggle machine
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

// Use the machine
console.log(toggleMachine.state); // "off"
toggleMachine.transition("TOGGLE");
console.log(toggleMachine.state); // "on"
```

### Fetch Machine with Auto-Retry

```js
// Create a fetch machine with custom options
const fetcher = new FetchMachine({
  maxRetries: 3,
  retryDelay: 1000,
  url: "https://api.example.com/data",
});

// Subscribe to state changes
const unsubscribe = fetcher.onChange(
  ({ previousState, currentState, event }) => {
    console.log(`${previousState} → ${currentState} (${event})`);
  },
);

// Fetch data
fetcher.fetch("https://api.example.com/posts/1");

// Check status
const status = fetcher.getStatus();
console.log(status.isLoading); // true/false
console.log(status.data); // fetched data
console.log(status.error); // error if any

// Manually retry
fetcher.retry();

// Cancel ongoing request
fetcher.cancel();

// Reset to idle
fetcher.reset();
```

### Advanced State Machine Configuration

```js
const machine = new StateMachine({
  initial: "idle",
  context: {
    user: null,
    attempts: 0,
  },
  states: {
    idle: {
      entry: (ctx) => {
        console.log("Entering idle");
        ctx.attempts = 0;
      },
      on: {
        LOGIN: {
          target: "authenticating",
          guard: (ctx) => ctx.user !== null,
        },
      },
    },
    authenticating: {
      entry: (ctx) => {
        console.log("Authenticating...");
        // Start async operation
      },
      on: {
        SUCCESS: {
          target: "authenticated",
          action: (ctx, payload) => {
            ctx.user = payload.user;
          },
        },
        ERROR: "error",
      },
      exit: (ctx) => {
        // Cleanup
        console.log("Exiting authenticating");
      },
    },
  },
});
```

## 🎨 Customization

### Extending the State Machine

```js
// Add persistence
class PersistentStateMachine extends StateMachine {
  save() {
    localStorage.setItem(
      "state",
      JSON.stringify({
        current: this.currentState,
        context: this.context,
      }),
    );
  }

  restore() {
    const saved = localStorage.getItem("state");
    if (saved) {
      const { current, context } = JSON.parse(saved);
      this.currentState = current;
      this.context = context;
    }
  }
}

// Add logging middleware
class LoggingStateMachine extends StateMachine {
  transition(event, payload) {
    console.log(
      `[${new Date().toISOString()}] Transition: ${this.currentState} -> ${event}`,
    );
    const result = super.transition(event, payload);
    console.log(
      `[${new Date().toISOString()}] New state: ${this.currentState}`,
    );
    return result;
  }
}
```

### Customizing the Fetch Machine

```js
// Add custom error strategies
class CustomFetchMachine extends FetchMachine {
  constructor(options) {
    super(options);
    this.errorStrategies = {
      404: "IGNORE",
      500: "RETRY",
      429: "RETRY",
      403: "RESET",
    };
  }

  async _executeFetch(ctx) {
    try {
      const response = await fetch(ctx.url);
      if (!response.ok) {
        const strategy = this.errorStrategies[response.status] || "ERROR";
        if (strategy === "RETRY") {
          this.machine.transition("RETRY", {
            error: new Error(`HTTP ${response.status}`),
          });
        } else if (strategy === "IGNORE") {
          this.machine.transition("IGNORE", {
            error: new Error(`HTTP ${response.status}`),
          });
        } else {
          super._executeFetch(ctx);
        }
      }
    } catch (error) {
      super._executeFetch(ctx);
    }
  }
}
```

### Adding Custom States

```js
// Extend with a 'paused' state
const pausedMachine = new StateMachine({
  initial: "idle",
  states: {
    idle: {
      on: { START: "running" },
    },
    running: {
      on: {
        PAUSE: "paused",
        STOP: "idle",
      },
    },
    paused: {
      entry: (ctx) => console.log("Paused"),
      on: {
        RESUME: "running",
        STOP: "idle",
      },
      exit: (ctx) => console.log("Resuming"),
    },
  },
});
```

## 📁 Project Structure

```text
state-machine-demo/
├── main.js          # Main implementation
└── README.md         # This file
```

## 📝 License

MIT License - Feel free to use, modify, and distribute this code for educational purposes.
