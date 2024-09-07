document.addEventListener('DOMContentLoaded', function() {
  loadTasksForSelectedDate();
  document.getElementById('calendar-button').addEventListener('click', toggleCalendar);
  document.getElementById('date-picker').addEventListener('change', loadTasksForSelectedDate);
});

// Add task when "Add Task" button is clicked
document.getElementById('add-todo').addEventListener('click', function() {
  const input = document.getElementById('todo-input');
  const taskText = input.value.trim();

  if (taskText !== "") {
    addTask(taskText);
    saveTaskToLocalStorage(getSelectedDate(), taskText);
    input.value = ''; // Clear input after adding task
  }
});

// Toggle calendar dropdown
function toggleCalendar() {
  const calendarMenu = document.getElementById('calendar-menu');
  calendarMenu.classList.toggle('show');
}

// Get the selected date from the date picker
function getSelectedDate() {
  const datePicker = document.getElementById('date-picker');
  return datePicker.value || new Date().toISOString().split('T')[0]; // Default to today's date
}

// Load tasks for the selected date
function loadTasksForSelectedDate() {
  const selectedDate = getSelectedDate();
  document.getElementById('todo-list').innerHTML = ''; // Clear current list
  const tasks = getTasksFromLocalStorage(selectedDate);
  tasks.forEach(task => {
    addTask(task.text, task.completed);
  });
}

// Add a task to the UI
function addTask(task, isCompleted = false) {
  const todoList = document.getElementById('todo-list');
  const li = document.createElement('li');
  li.classList.add('todo-item');
  if (isCompleted) li.classList.add('completed');

  const taskText = document.createElement('span');
  taskText.textContent = task;

  const completeBtn = document.createElement('button');
  completeBtn.innerHTML = '✔️';
  completeBtn.classList.add('complete-btn');
  completeBtn.addEventListener('click', function() {
    li.classList.toggle('completed');
    updateTaskStatusInLocalStorage(getSelectedDate(), task);
  });

  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = '❌';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', function() {
    li.remove();
    removeTaskFromLocalStorage(getSelectedDate(), task);
  });

  li.appendChild(taskText);
  li.appendChild(completeBtn);
  li.appendChild(deleteBtn);
  todoList.appendChild(li);
}

// Save task to localStorage
function saveTaskToLocalStorage(date, task) {
  let tasks = getTasksFromLocalStorage(date);
  tasks.push({ text: task, completed: false });
  localStorage.setItem(date, JSON.stringify(tasks));
}

// Get tasks from localStorage for a specific date
function getTasksFromLocalStorage(date) {
  const tasks = localStorage.getItem(date);
  return tasks ? JSON.parse(tasks) : [];
}

// Update task completion status in localStorage
function updateTaskStatusInLocalStorage(date, taskText) {
  let tasks = getTasksFromLocalStorage(date);
  tasks = tasks.map(task => {
    if (task.text === taskText) {
      task.completed = !task.completed;
    }
    return task;
  });
  localStorage.setItem(date, JSON.stringify(tasks));
}

// Remove task from localStorage
function removeTaskFromLocalStorage(date, taskText) {
  let tasks = getTasksFromLocalStorage(date);
  tasks = tasks.filter(task => task.text !== taskText);
}
