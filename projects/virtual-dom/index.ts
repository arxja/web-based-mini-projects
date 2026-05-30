// Represents a DOM element as a plain object
interface VNode {
  type: string; // 'div', 'span', 'button', etc.
  props: Record<string, any>; // { id: 'app', className: 'container', onClick: fn }
  children: (VNode | string | number)[]; // Nested elements or text
}

// Helper to create VNodes (like React.createElement or h())
function h(
  type: string,
  props: Record<string, any>,
  ...children: (VNode | string | number)[]
): VNode {
  return {
    type,
    props: props || {},
    children: children.flat(),
  };
}

// Convert VNode to real DOM element
function createRealDOM(vnode: VNode | string | number): HTMLElement | Text {
  // Handle text nodes
  if (typeof vnode === "string" || typeof vnode === "number") {
    return document.createTextNode(String(vnode));
  }

  // Create element
  const element = document.createElement(vnode.type);

  // Set properties and event listeners
  for (const [key, value] of Object.entries(vnode.props)) {
    if (key.startsWith("on") && typeof value === "function") {
      // Event listener: onClick -> click
      const eventName = key.slice(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === "className") {
      // className -> class
      element.setAttribute("class", value);
    } else if (key === "style" && typeof value === "object") {
      // Style object
      Object.assign(element.style, value);
    } else {
      // Regular attribute
      element.setAttribute(key, value);
    }
  }

  // Append children recursively
  for (const child of vnode.children) {
    element.appendChild(createRealDOM(child));
  }

  return element;
}

// Types of changes we can apply
type Patch =
  | { type: "REPLACE"; newVNode: VNode | string | number }
  | { type: "REMOVE" }
  | { type: "SET_TEXT"; text: string }
  | { type: "SET_ATTRIBUTE"; key: string; value: any }
  | { type: "REMOVE_ATTRIBUTE"; key: string }
  | { type: "CHILDREN"; patches: (Patch | null)[] };

// Diff two VNodes, returns patches to apply
function diff(
  oldVNode: VNode | string | number | null,
  newVNode: VNode | string | number | null,
): Patch | null {
  // Case 1: Old node doesn't exist -> replace with new
  if (oldVNode === null || oldVNode === undefined) {
    if (newVNode === null || newVNode === undefined) return null;
    return { type: "REPLACE", newVNode };
  }

  // Case 2: New node doesn't exist -> remove old
  if (newVNode === null || newVNode === undefined) {
    return { type: "REMOVE" };
  }

  // Case 3: Different types or different element types -> replace
  if (typeof oldVNode !== typeof newVNode) {
    return { type: "REPLACE", newVNode };
  }

  // Case 4: Text nodes (string or number)
  if (typeof oldVNode === "string" || typeof oldVNode === "number") {
    if (oldVNode !== newVNode) {
      return { type: "SET_TEXT", text: String(newVNode) };
    }
    return null;
  }

  // Case 5: Different element types -> replace
  if (oldVNode.type !== (newVNode as VNode).type) {
    return { type: "REPLACE", newVNode };
  }

  // Case 6: Same element type – diff props and children
  const oldElement = oldVNode as VNode;
  const newElement = newVNode as VNode;

  const patches: Patch[] = [];

  // Diff props
  const allProps = new Set([
    ...Object.keys(oldElement.props),
    ...Object.keys(newElement.props),
  ]);
  for (const key of allProps) {
    const oldValue = oldElement.props[key];
    const newValue = newElement.props[key];

    if (oldValue !== newValue) {
      if (newValue === undefined || newValue === null) {
        patches.push({ type: "REMOVE_ATTRIBUTE", key });
      } else {
        patches.push({ type: "SET_ATTRIBUTE", key, value: newValue });
      }
    }
  }

  // Diff children (simple – assumes children are in order)
  const maxLen = Math.max(
    oldElement.children.length,
    newElement.children.length,
  );
  const childPatches: (Patch | null)[] = [];

  for (let i = 0; i < maxLen; i++) {
    const oldChild = oldElement.children[i];
    const newChild = newElement.children[i];
    childPatches.push(diff(oldChild, newChild));
  }

  patches.push({ type: "CHILDREN", patches: childPatches });

  return { type: "CHILDREN", patches };
}

// Apply computed patches to actual DOM element
function patch(
  domElement: HTMLElement | Text,
  patches: Patch | null,
): HTMLElement | Text | null {
  if (!patches) return domElement;

  switch (patches.type) {
    case "REPLACE":
      if (domElement.parentNode) {
        const newDOM = createRealDOM(patches.newVNode);
        domElement.parentNode.replaceChild(newDOM, domElement);
        return newDOM;
      }
      return domElement;

    case "REMOVE":
      if (domElement.parentNode) {
        domElement.parentNode.removeChild(domElement);
      }
      return null;

    case "SET_TEXT":
      if (domElement.nodeType === Node.TEXT_NODE) {
        (domElement as Text).textContent = patches.text;
      }
      return domElement;

    case "SET_ATTRIBUTE":
      if (domElement instanceof HTMLElement) {
        if (
          patches.key.startsWith("on") &&
          typeof patches.value === "function"
        ) {
          const eventName = patches.key.slice(2).toLowerCase();
          domElement.addEventListener(eventName, patches.value);
        } else if (patches.key === "className") {
          domElement.setAttribute("class", patches.value);
        } else if (
          patches.key === "style" &&
          typeof patches.value === "object"
        ) {
          Object.assign(domElement.style, patches.value);
        } else {
          domElement.setAttribute(patches.key, patches.value);
        }
      }
      return domElement;

    case "REMOVE_ATTRIBUTE":
      if (domElement instanceof HTMLElement) {
        if (patches.key.startsWith("on")) {
          const eventName = patches.key.slice(2).toLowerCase();
          // Remove event listener (need to store reference to remove)
          // For simplicity, we'll just leave it
        } else if (patches.key === "className") {
          domElement.removeAttribute("class");
        } else {
          domElement.removeAttribute(patches.key);
        }
      }
      return domElement;

    case "CHILDREN":
      let currentDOM = domElement;
      for (let i = 0; i < patches.patches.length; i++) {
        const childPatch = patches.patches[i];
        if (
          childPatch &&
          currentDOM instanceof HTMLElement &&
          currentDOM.childNodes[i]
        ) {
          const childDOM = currentDOM.childNodes[i] as HTMLElement | Text;
          const result = patch(childDOM, childPatch);
          if (result === null && currentDOM.childNodes[i]) {
            // Child was removed
            continue;
          }
        }
      }
      return domElement;

    default:
      return domElement;
  }
}

class Component {
  private vnode: VNode | null = null;
  private domElement: HTMLElement | Text | null = null;
  private container: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  // Override this in your component
  render(): VNode {
    return h("div", null, "Hello World !");
  }

  // Called when state changes
  private update() {
    const newVNode = this.render();

    if (this.vnode) {
      const patches = diff(this.vnode, newVNode);
      if (patches && this.domElement) {
        this.domElement = patch(this.domElement as HTMLElement, patches);
      }
    } else {
      this.domElement = createRealDOM(newVNode);
      this.container.appendChild(this.domElement);
    }

    this.vnode = newVNode;
  }

  // Call this when you want to re-render
  protected rerender() {
    this.update();
  }

  // Mount the component
  mount() {
    this.update();
  }
}

// === Usage Example ===

// Create a counter component
// class Counter extends Component {
//   private count = 0;

//   constructor(container: HTMLElement) {
//     super(container);
//   }

//   increment = () => {
//     this.count++;
//     this.rerender(); // Triggers Virtual DOM diff + patch
//   };

//   render(): VNode {
//     return h(
//       "div",
//       { style: { textAlign: "center", padding: "20px" } },
//       h("h1", null, `Count: ${this.count}`),
//       h(
//         "button",
//         { onClick: this.increment, style: { padding: "10px 20px" } },
//         "Increment",
//       ),
//       h("p", null, `Double: ${this.count * 2}`),
//     );
//   }
// }

// // Run it
// const app = document.getElementById("app");
// if (app) {
//   const counter = new Counter(app);
//   counter.mount();
// }
