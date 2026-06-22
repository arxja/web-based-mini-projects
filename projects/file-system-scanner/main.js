class FileNode {
  constructor(name, isDirectory = false) {
    this.name = name;
    this.isDirectory = isDirectory;
    this.children = [];
  }
}

class FileSystemScanner {
  constructor(root) {
    this.root = root;
  }

  /**
   * RECURSIVE: List all files (not directories)
   * @param node
   * @param files[]
   */
  listFilesRecursive(node = this.root, files = []) {
    // Base case
    if (!node) return files;

    // If it's a file (leaf node), add it
    if (!node.IsDirectory) {
      files.push(node.name);
    }

    // Recursive case: process children
    for (const child of node.children) {
      this.listFilesRecursive(child, files);
    }

    return files;
  }

  /**
   * ITERATIVE DFS: Using explicit stack
   */
  listFilesDFS() {
    const files = [];
    const stack = [this.root];

    while (stack.length > 0) {
      const node = stack.pop();

      if (!node.isDirectory) {
        files.push(node.name);
      }

      // Push children in reverse to maintain order
      for (let i = node.children.length - 1; i >= 0; i--) {
        stack.push(node.children[i]);
      }
    }

    return files;
  }

  /**
   * BFS: Level by level - good for finding files near root
   */
  listFilesBFS() {
    const files = [];
    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();

      if (!node.isDirectory) {
        files.push(node.name);
      }

      for (const child of node.children) {
        queue.push(child);
      }
    }

    return files;
  }

  /**
   * RECURSIVE: Find file by name (DFS)
   * @param name
   * @param node
   */
  findFile(name, node = this.node) {
    if (!node) return null;

    if (node.name === name && !node.isDirectory) {
      return node;
    }

    for (const child of node.children) {
      const found = this.findFile(name, child);
      if (found) return found;
    }

    return null;
  }

  /**
   * Calculate total size of directory (post-order traversal)
   * @param node
   */
  calculateSize(node = this.root) {
    if (!node) return 0;

    if (!node.isDirectory) {
      return node.size || 0; // Return file size
    }

    // For directories, sum all children sizes
    let totalSize = 0;
    for (const child of node.children) {
      totalSize += this.calculateSize(child);
    }

    return totalSize;
  }

  /**
   * Pretty print file tree with indentation
   * @param node
   * @param indent
   */
  printTree(node = this.root, indent = 0) {
    if (!node) return;

    const prefix = "  ".repeat(indent);
    const icon = node.isDirectory ? "📁" : "📄";
    console.log(`${prefix}${icon} ${node.name}`);

    for (const child of node.children) {
      this.printTree(child, indent + 1);
    }
  }
}

// Build a realistic file system
function createFileSystem() {
  const root = new FileNode("root", true);

  // Documents directory
  const docs = new FileNode("Documents", true);
  docs.children.push(new FileNode("resume.pdf", false));
  docs.children.push(new FileNode("cover-letter.docx", false));

  const projects = new FileNode("Projects", true);
  const webApp = new FileNode("web-app", true);
  webApp.children.push(new FileNode("index.html", false));
  webApp.children.push(new FileNode("styles.css", false));
  webApp.children.push(new FileNode("app.js", false));
  projects.children.push(webApp);
  docs.children.push(projects);

  // Pictures directory
  const pics = new FileNode("Pictures", true);
  pics.children.push(new FileNode("vacation.jpg", false));
  pics.children.push(new FileNode("family.png", false));

  // Music directory
  const music = new FileNode("Music", true);
  music.children.push(new FileNode("song1.mp3", false));
  music.children.push(new FileNode("song2.mp3", false));

  // Root structure
  root.children.push(docs);
  root.children.push(pics);
  root.children.push(music);

  return root;
}

// Demo the scanner
const fs = createFileSystem();
const scanner = new FileSystemScanner(fs);

console.log("📂 File System Structure:");
scanner.printTree();

console.log("\n📄 All files (recursive):", scanner.listFilesRecursive());
console.log("📄 All files (DFS):", scanner.listFilesDFS());
console.log("📄 All files (BFS):", scanner.listFilesBFS());

const found = scanner.findFile("app.js");
console.log("\n🔍 Found:", found ? found.name : "Not found");
