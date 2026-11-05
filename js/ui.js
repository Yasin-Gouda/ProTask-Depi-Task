// Safe DOM Manipulation and UI rendering layer[cite: 6, 7]
class UI {
  constructor() {
    // Select Elements using querySelector[cite: 6]
    this.statTotal = document.querySelector("#statTotal");
    this.statCompleted = document.querySelector("#statCompleted");
    this.statPending = document.querySelector("#statPending");
    this.statInProgress = document.querySelector("#statInProgress");
    this.statOverdue = document.querySelector("#statOverdue");
    this.statRate = document.querySelector("#statRate");

    this.taskList = document.querySelector("#taskList");
    this.formMsg = document.querySelector("#formMsg");
  }

  showFormMessage(msg, type) {
    this.formMsg.textContent = msg;
    this.formMsg.className = `form-msg ${type}`;
  }

  clearFormMessage() {
    this.formMsg.textContent = "";
    this.formMsg.className = "form-msg";
  }

  updateAnalytics(stats) {
    this.statTotal.textContent = stats.total;
    this.statCompleted.textContent = stats.completed;
    this.statPending.textContent = stats.pending;
    this.statInProgress.textContent = stats.inProgress;
    this.statOverdue.textContent = stats.overdue;
    this.statRate.textContent = stats.rate;
  }

  // Safe DOM Rendering without untrusted innerHTML[cite: 6, 7]
  renderTasks(tasks, taskService) {
    this.taskList.innerHTML = "";

    if (tasks.length === 0) {
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-state";
      emptyDiv.textContent = "No tasks found matching current filters.";
      this.taskList.appendChild(emptyDiv);
      return;
    }

    // Render using DOM element creation & forEach()[cite: 6]
    tasks.forEach(task => {
      const isOverdue = taskService.isOverdue(task);

      const card = document.createElement("div");
      card.className = `task-card priority-${task.priority} ${isOverdue ? 'overdue' : ''}`;
      card.dataset.id = task.id;

      // Main Info
      const mainDiv = document.createElement("div");
      mainDiv.className = "task-main";

      const titleEl = document.createElement("h4");
      titleEl.textContent = task.title;

      const descEl = document.createElement("p");
      descEl.className = "task-desc";
      descEl.textContent = task.description;

      const metaDiv = document.createElement("div");
      metaDiv.className = "task-meta";

      const statusBadge = document.createElement("span");
      statusBadge.className = "badge badge-status";
      statusBadge.textContent = taskService.getStatusLabel(task.status);

      const priorityBadge = document.createElement("span");
      priorityBadge.className = "badge";
      priorityBadge.textContent = taskService.getPriorityLabel(task.priority);

      const dateSpan = document.createElement("span");
      dateSpan.textContent = `Due: ${task.dueDate}`;

      metaDiv.appendChild(statusBadge);
      metaDiv.appendChild(priorityBadge);
      metaDiv.appendChild(dateSpan);

      if (isOverdue) {
        const overdueBadge = document.createElement("span");
        overdueBadge.className = "badge badge-overdue";
        overdueBadge.textContent = "OVERDUE";
        metaDiv.appendChild(overdueBadge);
      }

      mainDiv.appendChild(titleEl);
      mainDiv.appendChild(descEl);
      mainDiv.appendChild(metaDiv);

      // Actions
      const actionsDiv = document.createElement("div");
      actionsDiv.className = "task-actions";

      if (task.status !== "Completed") {
        const btnComplete = document.createElement("button");
        btnComplete.className = "btn btn-secondary action-complete";
        btnComplete.textContent = "Complete";
        actionsDiv.appendChild(btnComplete);
      }

      const btnEdit = document.createElement("button");
      btnEdit.className = "btn btn-primary action-edit";
      btnEdit.textContent = "Edit";

      const btnDelete = document.createElement("button");
      btnDelete.className = "btn btn-danger action-delete";
      btnDelete.textContent = "Delete";

      actionsDiv.appendChild(btnEdit);
      actionsDiv.appendChild(btnDelete);

      card.appendChild(mainDiv);
      card.appendChild(actionsDiv);

      this.taskList.appendChild(card);
    });
  }
}