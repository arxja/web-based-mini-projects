# Course Scheduler

> A visual graph theory learning tool that demonstrates topological sorting through a university course prerequisite system.

## 🎓 About

This project is an educational implementation of graph theory concepts, specifically designed to teach topological sorting through a real-world application: university course scheduling. By modeling courses as nodes and prerequisites as directed edges, students can visualize how algorithms like Kahn's algorithm work to create dependency-free schedules.

The scheduler builds a complete Computer Science curriculum with courses, prerequisites, and metadata (credits, difficulty). It then demonstrates several key algorithms: topological sort for study planning, parallel scheduling for semester grouping, critical path analysis for identifying longest prerequisite chains, and cycle detection for validating course prerequisites.

## ✨ Features

- **Graph Construction**: Build directed graphs with nodes (courses) and edges (prerequisites)
- **Topological Sorting**: Generate ordered study plans using Kahn's algorithm
- **Parallel Scheduling**: Group courses into semesters for optimal planning
- **Critical Path Analysis**: Identify the longest chain of prerequisite courses
- **Cycle Detection**: Find and display circular dependencies with detailed error messages
- **Course Management**: Add courses with metadata (credits, difficulty, names)
- **Prerequisite Queries**: Check if a course can be taken based on completed courses
- **Visual Output**: Clean, formatted console output showing semester-by-semester plans

## 🎯 What You'll Learn

- **Graph Theory Fundamentals**: Nodes, edges, directed graphs, and adjacency lists
- **Topological Sorting**: Kahn's algorithm for dependency resolution
- **Cycle Detection**: DFS-based cycle finding in directed graphs
- **Algorithm Analysis**: Time complexity and practical applications
- **Data Structures**: Maps, Sets, and adjacency list implementations
- **Real-World Problem Solving**: How graph algorithms apply to scheduling problems
- **Critical Path Method**: Finding the longest path in a dependency graph
- **JavaScript ES6**: Classes, Maps, Sets, arrow functions, and destructuring

## 🎮 How to Use

1. **Create a Scheduler Instance**

```javascript
const scheduler = new CourseScheduler();
```

2. **Add Courses with Metadata**

```js
scheduler.addCourse("CS101", {
  name: "Intro to Programming",
  credits: 3,
  difficulty: "easy",
});
```

3. **Add Prerequisites (Dependencies)**

```js
scheduler.addPrerequisite("CS102", "CS101"); // CS101 → CS102
```

4. **Generate Study Plan**

```js
const studyPlan = scheduler.getStudyPlan();
console.log(studyPlan); // ['CS101', 'MATH101', 'CS102', ...]
```

5. **View Semester Schedule**

```js
scheduler.printSchedule(); // Shows organized semester-by-semester plan
```

5. **Validate for Cycles**

```js
const validation = scheduler.validateNoCycles();
if (!validation.valid) {
  console.log(`⚠️ Cycle detected: ${validation.message}`);
}
```

## 🎨 Customization

### Modify the Curriculum

Edit the `courses` array in the example section to create your own program:

```js
const courses = [
  { id: "ENG101", name: "English Composition", credits: 3 },
  { id: "HIST101", name: "World History", credits: 3 },
  // Add your own courses
];
```

### Adjust Difficulty Levels

The `difficulty` field accepts any string; you can use "beginner", "intermediate", "advanced" or custom levels.

### Change Credit System

Modify the default credits in the `addCourse` method:

```js
addCourse(courseId, metadata = {}) {
  this.courses.set(courseId, {
    credits: metadata.credits || 4, // Changed from 3 to 4
    // ...
  });
}
```

### Add New Features

Extend the `CourseScheduler` class with custom methods:

```js
class ExtendedScheduler extends CourseScheduler {
  getCoursesByDifficulty(difficulty) {
    return Array.from(this.courses.values()).filter(
      (c) => c.difficulty === difficulty,
    );
  }
}
```

## 📁 Project Structure

```text
course-scheduler/
├── main.js       # Main application with Graph, CourseScheduler, and examples
└── README.md       # This file
```

## 📝 License
MIT License - Feel free to use, modify, and distribute this code for educational purposes.