# File System Scanner & Traversal

> A comprehensive demonstration of recursive and iterative tree traversal algorithms using a virtual file system

## 🗂️ About

This project is an educational implementation of a file system scanner that demonstrates various tree traversal techniques. It builds a virtual file system structure and provides multiple methods to traverse, search, and analyze the directory tree. Perfect for understanding fundamental computer science concepts like recursion, DFS, BFS, and tree data structures in a practical context.

## ✨ Features

- **Multiple Traversal Methods**: Recursive, Iterative DFS (stack-based), and BFS (queue-based) implementations
- **File Search**: Find specific files by name using recursive DFS search
- **Size Calculation**: Calculate total directory sizes using post-order traversal
- **Visual Representation**: Pretty-print the entire file tree with emoji icons and indentation
- **Virtual File System**: Pre-built sample directory structure with realistic file types

## 🎯 What You'll Learn

- **Recursive Programming**: Implementing tree traversal through recursive function calls
- **Stack-based DFS**: Understanding how to convert recursive algorithms to iterative ones
- **BFS vs DFS**: Comparing breadth-first and depth-first search strategies
- **Tree Data Structures**: Working with hierarchical data and node-based structures
- **File System Concepts**: Understanding directory structures and file organization

## 💻 How to Use

1. **Run the Demo**: Open the JavaScript file in Node.js or a browser console
2. **View Output**: See the file tree structure and traversal results in the console
3. **Search Files**: Use `findFile()` to locate specific files by name
4. **Calculate Sizes**: Use `calculateSize()` to get total directory sizes
5. **Experiment**: Modify the file system structure or add new traversal methods

## 🎨 Customization

- **Add File Sizes**: Modify the FileNode class to include size properties
- **Different Tree Structures**: Create your own directory structures for testing
- **New Traversal Methods**: Implement additional algorithms like post-order iterative traversal
- **Output Formats**: Change the pretty printer to output JSON or HTML format
- **File Filtering**: Add filtering capabilities (e.g., only .js files)

## 📁 Project Structure

```text
file-system-scanner/
├── main.js # Node class for tree structure
└── README.md # This file
```


## 🚀 Run Locally

1. **Install Node.js** (if not already installed)
2. **Save the code** to a `.js` file
3. **Run** with: `node filename.js`
4. **Or** paste into browser console

## 📝 Understanding the Code

### Key Methods:

- **`listFilesRecursive()`**: Recursively traverses tree, collecting all file nodes
- **`listFilesDFS()`**: Iterative depth-first search using a stack
- **`listFilesBFS()`**: Breadth-first search using a queue
- **`findFile()`**: Recursively searches for a specific file by name
- **`calculateSize()`**: Post-order traversal to compute total directory sizes
- **`printTree()`**: Pretty prints the entire directory structure

### Time Complexities:

- **All traversals**: O(n) where n is the number of nodes
- **Space complexity**: 
  - Recursive: O(h) where h is tree height (call stack)
  - Iterative DFS/BFS: O(w) where w is maximum width

### Sample Output:

```text
📂 File System Structure:
📁 root
  📁 Documents
    📄 resume.pdf
    📄 cover-letter.docx
    📁 Projects
      📁 web-app
        📄 index.html
        📄 styles.css
        📄 app.js
  📁 Pictures
    📄 vacation.jpg
    📄 family.png
  📁 Music
    📄 song1.mp3
    📄 song2.mp3

📄 All files (recursive): [
  "root", "Documents", "resume.pdf", "cover-letter.docx", "Projects", "web-app", "index.html",
  "styles.css", "app.js", "Pictures", "vacation.jpg", "family.png", "Music", "song1.mp3", "song2.mp3"
]
📄 All files (DFS): [ "resume.pdf", "cover-letter.docx", "index.html", "styles.css", "app.js",
  "vacation.jpg", "family.png", "song1.mp3", "song2.mp3"
]
📄 All files (BFS): [ "resume.pdf", "cover-letter.docx", "vacation.jpg", "family.png",
  "song1.mp3", "song2.mp3", "index.html", "styles.css", "app.js"
]
```

## 📝 License

MIT License - Feel free to use, modify, and distribute as needed for learning purposes.