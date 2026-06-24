class Graph {
  constructor(params) {
    this.adjacencyList = new Map();
    this.nodes = new Set();
  }

  addNode(node) {
    if (!this.adjacencyList.has(node)) {
      this.adjacencyList.set(node, []);
      this.nodes.add(node);
    }
  }

  addEdge(from, to) {
    // Ensure both nodes exits
    this.addNode(from);
    this.addNode(to);

    // Add edge: from → to
    this.adjacencyList.get(from).push(to);
  }

  getNeighbors(node) {
    return this.adjacencyList.get(node) || [];
  }

  // Visualize the graph
  print() {
    for (const [node, neighbors] of this.adjacencyList) {
      const neighborStr = neighbors.length ? neighbors.join(", ") : "none";
      console.log(`${node} → [${neighborStr}]`);
    }
  }

  // Get all edges as [from, to] pairs
  getAllEdges() {
    const edges = [];
    for (const [from, neighbors] of this.adjacencyList) {
      for (const to of neighbors) {
        edges.push([from, to]);
      }
    }
    return edges;
  }
}

function topologicalSort(graph) {
  // Step 1: Calculate in-degrees
  const inDegree = new Map();
  for (const node of graph.adjacencyList.keys()) {
    inDegree.set(node, 0);
  }
  for (const [node, neighbors] of graph.adjacencyList) {
    for (const neighbor of neighbors) {
      inDegree.set(neighbor, inDegree.get(neighbor) + 1);
    }
  }
  // Step 2: Find all nodes with 0 in-degree (no prerequisites)
  const queue = []; // BFS-style queue
  for (const [node, degree] of inDegree) {
    if (degree === 0) {
      queue.push(node);
    }
  }
  // Step 3: Process nodes in order
  const result = [];
  const processedOrder = []; // Track when each node was processed
  while (queue.length > 0) {
    const current = queue.shift(); // Dequeue
    result.push(current);
    processedOrder.push(current);

    // Step 4: "Remove" this node (decrease in-degree of neighbors)
    for (const neighbor of graph.getNeighbors(current)) {
      inDegree.set(neighbor, inDegree.get(neighbor) - 1);

      // If neighbor has no more prerequisites, add to queue
      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
      }
    }
  }

  // Step 5: Check for cycles
  if (result.length !== graph.adjacencyList.size) {
    throw new Error("Cycle detected! Cannot complete topological sort.");
  }

  return result;
}

class CourseScheduler {
  constructor() {
    this.graph = new Graph();
    this.courses = new Map();
  }

  addCourse(courseId, metadata = {}) {
    this.graph.addNode(courseId);
    this.courses.set(courseId, {
      id: courseId,
      name: metadata.name || courseId,
      credits: metadata.credits || 3,
      difficulty: metadata.difficulty || "medium",
    });
  }

  addPrerequisite(courseId, prerequisiteId) {
    this.graph.addEdge(prerequisiteId, courseId);
  }

  getStudyPlan() {
    return topologicalSort(this.graph);
  }

  canTakeCourse(courseId, completedCourse) {
    const prerequisites = this.getPrerequisites(courseId);
    return prerequisites.every((prerequisite) =>
      completedCourse.has(prerequisite),
    );
  }

  getPrerequisites(courseId, visited = new Set()) {
    const prerequisites = [];

    for (const [node, neighbors] of this.graph.adjacencyList) {
      if (neighbors.includes(courseId) && !visited.has(node)) {
        visited.add(node);
        prerequisites.push(node);
        // Recursively get prerequisites of prerequisites
        prerequisites.push(...this.getPrerequisites(node, visited));
      }
    }

    return prerequisites;
  }

  // Which courses can be taken together?
  getParallelSchedule() {
    const inDegree = new Map();
    for (const node of this.graph.adjacencyList.keys()) {
      inDegree.set(node, 0);
    }
    for (const [node, neighbors] of this.graph.adjacencyList) {
      for (const neighbor of neighbors) {
        inDegree.set(neighbor, inDegree.get(neighbor) + 1);
      }
    }

    // Group courses by "semester" (parallel groups)
    const semesters = [];
    let currentSemester = [];

    // Find all courses with no prerequisites
    for (const [node, degree] of inDegree) {
      if (degree === 0) {
        currentSemester.push(node);
      }
    }

    while (currentSemester.length > 0) {
      semesters.push([...currentSemester]);

      const nextSemester = [];

      // Process current semester's courses
      for (const course of currentSemester) {
        for (const neighbor of this.graph.getNeighbors(course)) {
          const newDegree = inDegree.get(neighbor) - 1;
          inDegree.set(neighbor, newDegree);

          if (newDegree === 0) {
            nextSemester.push(neighbor);
          }
        }
      }

      currentSemester = nextSemester;
    }

    return semesters;
  }

  // Find the critical path (longest path through prerequisites)
  getCriticalPath() {
    const sorted = this.getStudyPlan();
    const longestPath = new Map();
    let maxPath = 0;
    let criticalPath = [];

    // Initialize all courses with path length 1
    for (const course of sorted) {
      longestPath.set(course, 1);
    }

    // For each course in topological order
    for (const course of sorted) {
      for (const neighbor of this.graph.getNeighbors(course)) {
        const newLength = longestPath.get(course) + 1;
        if (newLength > longestPath.get(neighbor)) {
          longestPath.set(neighbor, newLength);

          if (newLength > maxPath) {
            maxPath = newLength;
          }
        }
      }
    }

    return {
      length: maxPath,
      criticalCourses: [...longestPath.entries()]
        .filter(([_, len]) => len === maxPath)
        .map(([course]) => course),
    };
  }

  // Detect cycles with detailed error message
  validateNoCycles() {
    try {
      this.getStudyPlan();
      return { valid: true };
    } catch (error) {
      // Find the cycle for debugging
      const cycle = this.findCycle();
      return {
        valid: false,
        cycle,
        message: `Circular dependency: ${cycle.join(" → ")}`,
      };
    }
  }

  // Find the actual cycle for debugging
  findCycle() {
    const visited = new Set();
    const recursionStack = new Set();
    const path = [];

    function dfs(node, graph) {
      visited.add(node);
      recursionStack.add(node);
      path.push(node);

      for (const neighbor of graph.getNeighbors(node)) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, graph)) return true;
        } else if (recursionStack.has(neighbor)) {
          // Found cycle - trim path to show cycle
          const cycleStart = path.indexOf(neighbor);
          path.splice(0, cycleStart);
          path.push(neighbor); // Complete the cycle
          return true;
        }
      }

      path.pop();
      recursionStack.delete(node);
      return false;
    }

    for (const node of this.graph.adjacencyList.keys()) {
      if (!visited.has(node)) {
        if (dfs(node, this.graph)) return path;
      }
    }

    return [];
  }

  // Generate a visual schedule
  printSchedule() {
    const semesters = this.getParallelSchedule();

    console.log("\n📚 COURSE SCHEDULE");
    console.log("═══════════════════");

    semesters.forEach((semester, index) => {
      console.log(`\n📅 Semester ${index + 1}:`);
      semester.forEach((course) => {
        const info = this.courses.get(course);
        const prereqs = this.getPrerequisites(course);
        console.log(`  📖 ${info.name || course} (${info.credits} credits)`);
        if (prereqs.length > 0) {
          console.log(`    Prerequisites: ${prereqs.join(", ")}`);
        }
      });
    });

    console.log(`\n⏱️  Total semesters: ${semesters.length}`);
    console.log(
      `📊 Critical path length: ${this.getCriticalPath().length} courses`,
    );
  }
}

// Let's create a real Computer Science curriculum
const scheduler = new CourseScheduler();

// Add courses with metadata
const courses = [
  { id: "CS101", name: "Intro to Programming", credits: 3, difficulty: "easy" },
  { id: "CS102", name: "Data Structures", credits: 4, difficulty: "medium" },
  { id: "CS201", name: "Algorithms", credits: 4, difficulty: "hard" },
  {
    id: "CS301",
    name: "AI & Machine Learning",
    credits: 4,
    difficulty: "hard",
  },
  { id: "CS302", name: "Database Systems", credits: 3, difficulty: "medium" },
  { id: "CS401", name: "Senior Project", credits: 6, difficulty: "hard" },
  { id: "MATH101", name: "Calculus I", credits: 4, difficulty: "medium" },
  { id: "MATH201", name: "Linear Algebra", credits: 3, difficulty: "medium" },
  { id: "MATH301", name: "Statistics", credits: 3, difficulty: "medium" },
];

courses.forEach((c) => scheduler.addCourse(c.id, c));

// Add prerequisites
scheduler.addPrerequisite("CS102", "CS101");
scheduler.addPrerequisite("CS201", "CS102");
scheduler.addPrerequisite("CS201", "MATH101");
scheduler.addPrerequisite("CS301", "CS201");
scheduler.addPrerequisite("CS301", "MATH301");
scheduler.addPrerequisite("CS302", "CS201");
scheduler.addPrerequisite("CS401", "CS301");
scheduler.addPrerequisite("CS401", "CS302");
scheduler.addPrerequisite("MATH201", "MATH101");
scheduler.addPrerequisite("MATH301", "MATH201");

// Print the schedule
scheduler.printSchedule();

// Check for cycles
const validation = scheduler.validateNoCycles();
console.log("\n✅ Schedule valid:", validation.valid);

// Add a cycle to demonstrate error detection
scheduler.addPrerequisite("CS101", "CS401"); // Circular dependency!
const badValidation = scheduler.validateNoCycles();
console.log("\n❌ After adding cycle:");
console.log(badValidation.message);
