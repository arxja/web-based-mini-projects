# Event Emitter

> A lightweight, custom implementation of the publish-subscribe pattern with `on`, `once`, `emit`, and `off` methods.

## 🔧 About

This project implements an **Event Emitter** from scratch – the core pattern behind Node.js events, browser DOM events, and many decoupled architectures.  
It allows you to **subscribe** (listen) to named events and **publish** (emit) them with data, without the emitter knowing who the listeners are.  
Building this yourself demystifies how systems like `process.on`, `socket.on`, or even your own job queue’s event system work under the hood.

## ✨ Features

- **`on(event, callback)`** – Subscribe to an event. Returns an unsubscribe function.
- **`once(event, callback)`** – Subscribe for a single emission; auto‑removes after first call.
- **`emit(event, ...args)`** – Trigger all listeners of an event with any arguments.
- **`off(event, callback)`** – Remove a specific listener.
- **Error resilience** – A crashing listener does not break other listeners or the emitter itself.
- **Lightweight** – Uses native `Map` and `Set` for efficient listener storage.

## 🎯 What You'll Learn

- How the **publish‑subscribe (pub/sub)** pattern decouples software components.
- Managing collections of callbacks with `Map` and `Set`.
- Implementing `once` using a wrapper function that auto‑unsubscribes.
- Graceful error handling inside event loops.
- Building a reusable, testable module with a clean API.

## 💻 How to Use

```js
import EventEmitter from './event-emitter.js';

const emitter = new EventEmitter();

// Subscribe
const unsubscribe = emitter.on('greet', (name) => {
console.log(`Hello, ${name}!`);
});

// Emit
emitter.emit('greet', 'World'); // "Hello, World!"

// Subscribe only once
emitter.once('start', () => console.log('Started once'));
emitter.emit('start'); // "Started once"
emitter.emit('start'); // (nothing)

// Unsubscribe
unsubscribe();
emitter.emit('greet', 'Again'); // (nothing)
```

## 🎨 Customization

You can easily extend the emitter with additional features:

- **Wildcard events** – `emitter.on('user:*', cb)` to match `user:login`, `user:logout`.
- **Priority listeners** – store callbacks in an array sorted by priority.
- **Async `emit`** – return a `Promise` that resolves after all listeners (even async ones) finish.
- **Event history** – keep a log of last N emitted events for debugging.
- **Listener limits** – warn when too many listeners are added to an event.

## 📁 Project Structure

```text
event-emitter/
├── index.js # EventEmitter class implementation
├── usage.js # Usage examples (notification system, error handling)
└── README.md # This file
```

## 🚀 Run Locally

1. Clone / download the project.
2. Open a terminal in the project folder.
3. Run the usage:
   ```bash
   node usage.js
   ```
   No installation or build step required – pure JavaScript.

## 📝 License

MIT License – feel free to use, modify, and share.
