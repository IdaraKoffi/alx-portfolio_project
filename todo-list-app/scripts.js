document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const taskDate = document.getElementById("task-date");
  const addTaskBtn = document.getElementById("add-task-btn");
  const taskList = document.getElementById("task-list");
  const filter = document.getElementById("filter");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const saveTasks = () => localStorage.setItem("tasks", JSON.stringify(tasks));

  const renderTasks = () => {
    const filterValue = filter.value;
    const today = new Date().toISOString().split("T")[0];
    const oneWeekFromToday = new Date();
    oneWeekFromToday.setDate(oneWeekFromToday.getDate() + 7);

    taskList.innerHTML = "";

    tasks
      .filter(task => {
        if (filterValue === "daily") {
          return task.date === today;
        } else if (filterValue === "weekly") {
          return task.date >= today && task.date <= oneWeekFromToday.toISOString().split("T")[0];
        } else if (filterValue === "monthly") {
          return task.date.startsWith(today.slice(0, 7)); // Match the YYYY-MM part
        }
        return true; // "all" filter
      })
      .forEach((task, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
          <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}">
          <span class="${task.completed ? "completed" : ""}">${task.text} - ${task.date}</span>
          <button class="complete-task" data-index="${index}" style="background-color: green;">Complete</button>
          <button class="delete-task" data-index="${index}" style="background-color: red;">Delete</button>
        `;
        taskList.appendChild(li);
      });
  };

  const addTask = () => {
    const taskText = taskInput.value.trim();
    const taskDueDate = taskDate.value;

    if (taskText && taskDueDate) {
      tasks.push({ text: taskText, date: taskDueDate, completed: false });
      saveTasks();
      renderTasks();
      taskInput.value = "";
      taskDate.value = "";
    }
  };

  const handleTaskAction = e => {
    const index = e.target.dataset.index;

    if (e.target.classList.contains("delete-task")) {
      tasks.splice(index, 1);
    } else if (e.target.classList.contains("complete-task")) {
      tasks[index].completed = !tasks[index].completed;
    }

    saveTasks();
    renderTasks();
  };

  addTaskBtn.addEventListener("click", addTask);
  taskList.addEventListener("click", handleTaskAction);
  filter.addEventListener("change", renderTasks);

  renderTasks();
});