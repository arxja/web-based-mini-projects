import { createSignal, createComputed, createEffect } from "./main";

// State
const [count, setCount] = createSignal(0);

// Derived
const double = createComputed(() => count() * 2);
const isEven = createComputed(() => count() % 2 === 0);

// Effects
createEffect(() => {
  console.log(`Count changed to ${count()}`);
});

createEffect(() => {
  console.log(`Double is ${double()}, Even: ${isEven()}`);
});

// User interaction
setCount(1); // Count changed to 1, Double is 2, Even: false
setCount(2); // Count changed to 2, Double is 4, Even: true
setCount(2); // (No change, no output)
