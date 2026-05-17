import EventEmitter from "./index.js";

// Create an event bus (global or local)
const notifications = new EventEmitter();

// ------------------------------------------------------------
// 1. Different modules subscribe to events they care about
// ------------------------------------------------------------

// Email module – sends welcome email
const unsubscribeWelcome = notifications.on("user:registered", (user) => {
  console.log(`📧 Sending welcome email to ${user.email}`);
});

// Analytics module – tracks signups
notifications.on("user:registered", (user) => {
  console.log(`📊 Tracking signup for user ${user.id}`);
});

// Admin module – only once, to notify on first user registration
notifications.once("user:registered", (user) => {
  console.log(`🔔 First user registered: ${user.name} – alerting admin`);
});

// Logger module – listens to everything (using a wildcard if implemented)
notifications.on("*", (event, ...args) => {
  console.log(`📝 Log: ${event} with`, args);
});

// ------------------------------------------------------------
// 2. Somewhere else in the code, we emit events
// ------------------------------------------------------------

console.log("\n--- First user registration ---");
notifications.emit("user:registered", {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
});

console.log("\n--- Second user registration ---");
notifications.emit("user:registered", {
  id: 2,
  name: "Bob",
  email: "bob@example.com",
});

// ------------------------------------------------------------
// 3. Later, we can unsubscribe a module
// ------------------------------------------------------------
console.log("\n--- Removing email module ---");
unsubscribeWelcome(); // Email module no longer listens

notifications.emit("user:registered", {
  id: 3,
  name: "Charlie",
  email: "charlie@example.com",
});

// ------------------------------------------------------------
// 4. Using `off` directly
// ------------------------------------------------------------
const tempListener = (msg) => console.log(`TEMP: ${msg}`);
notifications.on("test", tempListener);
notifications.emit("test", "Hello"); // TEMP: Hello
notifications.off("test", tempListener);
notifications.emit("test", "Hello again"); // (nothing printed)

// ------------------------------------------------------------
// 5. Error handling demonstration
// ------------------------------------------------------------
console.log("\n--- Error handling ---");
notifications.on("buggy", () => {
  throw new Error("Oops!");
});
notifications.on("error", (err) => console.log(`✅ Caught: ${err.message}`));
notifications.emit("buggy"); // Error caught, application does not crash
