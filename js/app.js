// Main Controller Wireup & Event Management[cite: 6]
document.addEventListener("DOMContentLoaded", () => {
  const taskService = new TaskService();
  const ui = new UI();

  // Form Elements
  const taskForm = document.querySelector("#taskForm");
  const taskIdInput = document.querySelector("#taskId");
  const titleInput = document.querySelector("#taskTitle");
  const descInput = document.querySelector("#taskDesc");
  const priorityInput = document.querySelector("#taskPriority");
  const statusInput = document.querySelector("#taskStatus");
  const dueDateInput = document.querySelector("#taskDueDate");
  const formTitle = document.querySelector("#formTitle");
  const btnSubmit = document.querySelector("#btnSubmit");
  const btnCancelEdit = document.querySelector("#btnCancelEdit");

  // Controls Elements
  const searchInput = document.querySelector("#searchInput");
  const filterStatus = document.querySelector("#filterStatus");
  const filterPriority = document.querySelector("#filterPriority");
  const sortControl = document.querySelector("#sortControl");

  // Core Render Trigger
  const updateUI = () => {
    const filters = {
      search: searchInput.value,
      status: filterStatus.value,
      priority: filterPriority.value,
      sortBy: sortControl.value
    };

    const tasksToDisplay = taskService.getFilteredAndSortedTasks(filters);
    ui.renderTasks(tasksToDisplay, taskService);
    ui.updateAnalytics(taskService.getAnalytics());
  };

  const resetForm = () => {
    taskForm.reset();
    taskIdInput.value = "";
    formTitle.textContent = "Create New Task";
    btnSubmit.textContent = "Add Task";
    btnCancelEdit.style.display = "none";
    ui.clearFormMessage();
  };

  // Form Submission (Create / Edit)[cite: 5, 6]
  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = taskIdInput.value ? Number(taskIdInput.value) : null;
    const title = titleInput.value;
    const desc = descInput.value;
    const priority = priorityInput.value;
    const status = statusInput.value;
    const dueDate = dueDateInput.value;

    const validation = taskService.validateTask(title, desc, dueDate, id);
    if (!validation.valid) {
      ui.showFormMessage(validation.message, "error");
      return;
    }

    if (id) {
      // Edit mode
      taskService.updateTask(id, {
        title: title.trim(),
        description: desc.trim(),
        priority,
        status,
        dueDate
      });
      ui.showFormMessage("Task updated successfully!", "success");
    } else {
      // Create mode
      const newTask = taskService.createTaskObject(title, desc, priority, status, dueDate);
      taskService.addTask(newTask);
      ui.showFormMessage("Task created successfully!", "success");
    }

    resetForm();
    updateUI();
  });

  btnCancelEdit.addEventListener("click", resetForm);

  // Event Delegation for Task Actions (Edit, Delete, Complete)[cite: 6]
  document.querySelector("#taskList").addEventListener("click", (e) => {
    const card = e.target.closest(".task-card");
    if (!card) return;

    const taskId = Number(card.dataset.id);

    // Delete Action
    if (e.target.classList.contains("action-delete")) {
      if (confirm("Are you sure you want to delete this task?")) {
        taskService.deleteTask(taskId);
        updateUI();
      }
    }

    // Complete Action
    if (e.target.classList.contains("action-complete")) {
      taskService.updateTask(taskId, { status: "Completed" });
      updateUI();
    }

    // Edit Action
    if (e.target.classList.contains("action-edit")) {
      const task = taskService.getTaskById(taskId);
      if (task) {
        taskIdInput.value = task.id;
        titleInput.value = task.title;
        descInput.value = task.description;
        priorityInput.value = task.priority;
        statusInput.value = task.status;
        dueDateInput.value = task.dueDate;

        formTitle.textContent = "Edit Task";
        btnSubmit.textContent = "Update Task";
        btnCancelEdit.style.display = "inline-block";
        ui.clearFormMessage();
      }
    }
  });

  // Live Controls Listeners
  searchInput.addEventListener("input", updateUI);
  filterStatus.addEventListener("change", updateUI);
  filterPriority.addEventListener("change", updateUI);
  sortControl.addEventListener("change", updateUI);

  // Initial Seed & Render
  updateUI();
});