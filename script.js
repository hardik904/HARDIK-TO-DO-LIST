document.addEventListener("DOMContentLoaded", () => {
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskInput = document.getElementById("taskInput");
  const taskDate = document.getElementById("taskDate");
  const taskPriority = document.getElementById("taskPriority");
  const taskList = document.getElementById("taskList");
  const taskCounter = document.getElementById("taskCounter");
  const filterTasks = document.getElementById("filterTasks");
  const toggleDarkMode = document.getElementById("toggleDarkMode");

  // ✅ Load saved tasks
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // ✅ Dark Mode Toggle
  toggleDarkMode.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    toggleDarkMode.textContent =
      document.body.classList.contains("dark") ? "☀️ Light Mode" : "🌙 Dark Mode";

    localStorage.setItem("darkMode", document.body.classList.contains("dark"));
  });

  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
    toggleDarkMode.textContent = "☀️ Light Mode";
  }

  // ✅ Add Task
  addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    const date = taskDate.value;
    const priority = taskPriority.value;

    if (taskText === "") {
      alert("Please enter a task name!");
      return;
    }

    const task = {
      id: Date.now(),
      text: taskText,
      date,
      priority,
      completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskDate.value = "";
    taskPriority.value = "low";
  });

  // ✅ Render Tasks
  function renderTasks() {
    taskList.innerHTML = "";
    const filter = filterTasks.value;

    const filteredTasks = tasks.filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    });

    filteredTasks.forEach(task => {
      const li = document.createElement("li");
      li.className = task.completed ? "completed" : "";

      const taskTop = document.createElement("div");
      taskTop.className = "task-top";

      const taskInfo = document.createElement("div");
      taskInfo.className = "task-info";
      taskInfo.innerHTML = `
        <strong>${task.text}</strong>
        <span class="task-meta">📅 ${task.date || "No date"} | 
          <span class="priority-${task.priority}">⚡ ${task.priority}</span>
        </span>
      `;

      const taskButtons = document.createElement("div");
      taskButtons.className = "task-buttons";

      // Complete Button
      const completeBtn = document.createElement("button");
      completeBtn.className = "complete-btn";
      completeBtn.innerHTML = "✔";
      completeBtn.addEventListener("click", () => {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
      });

      // Edit Button
      const editBtn = document.createElement("button");
      editBtn.className = "edit-btn";
      editBtn.innerHTML = "✏️";
      editBtn.addEventListener("click", () => {
        const newText = prompt("Edit Task Name:", task.text);
        if (newText !== null && newText.trim() !== "") {
          task.text = newText.trim();
        }

        const newDate = prompt("Edit Due Date (YYYY-MM-DD):", task.date);
        if (newDate !== null) {
          task.date = newDate;
        }

        const newPriority = prompt("Edit Priority (low/medium/high):", task.priority);
        if (newPriority !== null && ["low", "medium", "high"].includes(newPriority.toLowerCase())) {
          task.priority = newPriority.toLowerCase();
        }

        saveTasks();
        renderTasks();
      });

      // Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.innerHTML = "🗑";
      deleteBtn.addEventListener("click", () => {
        tasks = tasks.filter(t => t.id !== task.id);
        saveTasks();
        renderTasks();
      });

      taskButtons.appendChild(completeBtn);
      taskButtons.appendChild(editBtn);
      taskButtons.appendChild(deleteBtn);

      taskTop.appendChild(taskInfo);
      taskTop.appendChild(taskButtons);

      li.appendChild(taskTop);
      taskList.appendChild(li);
    });

    updateCounter();
  }

  // ✅ Save to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // ✅ Update Counter
  function updateCounter() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;
    taskCounter.textContent = `Total: ${total} | Completed: ${completed} | Pending: ${pending}`;
  }

  filterTasks.addEventListener("change", renderTasks);

  renderTasks();
});
