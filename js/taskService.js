// TaskService manages data, validation, calculations, and array methods[cite: 5, 6].
class TaskService {
  constructor() {
    this.tasks = [];
  }

  // Task Object Creator[cite: 5]
  createTaskObject(title, description, priority, status, dueDate) {
    return {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      dueDate,
      createdAt: new Date().toISOString()
    };
  }

  // Validation[cite: 5]
  validateTask(title, description, dueDate, currentTaskId = null) {
    const trimmedTitle = title ? title.trim() : "";
    if (!trimmedTitle) {
      return { valid: false, message: "Task Title cannot be empty or whitespace only." };
    }

    if (!description || !description.trim()) {
      return { valid: false, message: "Task Description cannot be empty." };
    }

    if (!dueDate) {
      return { valid: false, message: "Please select a valid Due Date." };
    }

    // Prevent past due dates when creating new tasks[cite: 5]
    const todayStr = new Date().toISOString().split('T')[0];
    if (!currentTaskId && dueDate < todayStr) {
      return { valid: false, message: "Due Date cannot be set in the past for new tasks." };
    }

    // Check Duplicate Title[cite: 5]
    const isDuplicate = this.tasks.some(
      t => t.title.toLowerCase() === trimmedTitle.toLowerCase() && t.id !== currentTaskId
    );
    if (isDuplicate) {
      return { valid: false, message: "A task with this title already exists." };
    }

    return { valid: true };
  }

  // CRUD Operations
  addTask(task) {
    this.tasks.push(task);
  }

  updateTask(id, updatedFields) {
    const task = this.getTaskById(id); // Uses find()[cite: 6]
    if (task) {
      Object.assign(task, updatedFields);
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(task => task.id !== id); // Uses filter()[cite: 6]
  }

  getTaskById(id) {
    return this.tasks.find(task => task.id === id); // Uses find()[cite: 6]
  }

  // Business Logic Methods
  isOverdue(task) {
    if (task.status === "Completed") return false;
    const today = new Date().toISOString().split('T')[0];
    return task.dueDate < today;
  }

  getPriorityLabel(priority) {
    return `Priority: ${priority}`;
  }

  getStatusLabel(status) {
    return `Status: ${status}`;
  }

  // Filter, Sort & Analytics[cite: 6]
  getFilteredAndSortedTasks({ search = "", status = "ALL", priority = "ALL", sortBy = "dueDate" }) {
    // Uses filter()[cite: 6]
    let result = this.tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "ALL" || task.status === status;
      const matchesPriority = priority === "ALL" || task.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    });

    // Immutable Sorting using Array Spread [...result][cite: 6]
    const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };

    return [...result].sort((a, b) => {
      if (sortBy === "priority") {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      if (sortBy === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      // Default: dueDate
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  // Dashboard Analytics using reduce() and some()[cite: 6]
  getAnalytics() {
    const total = this.tasks.length;
    
    // Check if any overdue task exists using some()[cite: 6]
    const hasAnyOverdue = this.tasks.some(task => this.isOverdue(task));

    // Stats calculation using reduce()[cite: 6]
    const stats = this.tasks.reduce(
      (acc, task) => {
        if (task.status === "Completed") acc.completed++;
        else if (task.status === "In Progress") acc.inProgress++;
        else if (task.status === "To Do") acc.pending++;

        if (this.isOverdue(task)) acc.overdue++;
        return acc;
      },
      { completed: 0, inProgress: 0, pending: 0, overdue: 0 }
    );

    // Prevent division by zero[cite: 6]
    const rate = total > 0 ? ((stats.completed / total) * 100).toFixed(1) : "0.0";

    return {
      total,
      completed: stats.completed,
      pending: stats.pending,
      inProgress: stats.inProgress,
      overdue: stats.overdue,
      rate: `${rate}%`,
      hasAnyOverdue
    };
  }
}