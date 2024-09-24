document.addEventListener('DOMContentLoaded', loadTasks);

const taskLists = document.querySelectorAll('.task-list');
const addTaskButton = document.getElementById('add-task-btn');
const newTaskInput = document.getElementById('new-task');


// Add new task to "To Do" column
addTaskButton.addEventListener('click', addTask);
newTaskInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addTask();
  }
});


// Add task function
function addTask() {
  const taskText = newTaskInput.value;
  if (taskText.trim()) {
    createTaskElement(taskText, 'todo');
    newTaskInput.value = '';
    saveTasks();
  }
}


// Create a new task element and add drag events
function createTaskElement(text, columnId) {
  const task = document.createElement('div');
  task.classList.add('task');
  task.draggable = true;

  // Create and append task text
  const taskText = document.createElement('span');
  taskText.classList.add('task-text');
  taskText.textContent = text;
  task.appendChild(taskText);

  // Add action buttons container
  const actionButtons = document.createElement('div');
  actionButtons.classList.add('action-buttons');

  
  // Add Remove button with bold X
  const removeButton = document.createElement('button');
  removeButton.innerHTML = '<strong>[x]</strong>'; // Bold X for remove
  removeButton.classList.add('remove');
  removeButton.addEventListener('click', () => {
    task.remove();
    saveTasks(); // Update tasks after removing
  });
  actionButtons.appendChild(removeButton);

  // Add Done button with tick mark
  const doneButton = document.createElement('button');
  doneButton.innerHTML = '<strong>:)</strong>'; // Tick mark for done
  doneButton.classList.add('done');
  doneButton.addEventListener('click', () => {
    moveTaskToDone(task);
  });
  actionButtons.appendChild(doneButton);

  
  task.appendChild(actionButtons);

  
  // Add drag event listeners
  task.addEventListener('dragstart', dragStart);
  task.addEventListener('dragend', dragEnd);

  // Append to the correct column
  const column = document.getElementById(columnId).querySelector('.task-list');
  column.appendChild(task);
  updateTaskButton(); // Update button state
}


// Move task to "Done" column
function moveTaskToDone(task) {
  const doneColumn = document.getElementById('done').querySelector('.task-list');
  doneColumn.appendChild(task);
  updateTaskButton(); // Update button state
  saveTasks(); // Save tasks after moving
}

// Handle drag and drop events
taskLists.forEach(list => {
  list.addEventListener('dragover', dragOver);
  list.addEventListener('dragenter', dragEnter);
  list.addEventListener('dragleave', dragLeave);
  list.addEventListener('drop', dragDrop);
});

let draggedTask = null;

function dragStart() {
  draggedTask = this;
  setTimeout(() => (this.style.display = 'none'), 0);
}


function dragEnd() {
  setTimeout(() => {
    draggedTask.style.display = 'block';
    draggedTask = null;
    updateTaskButton();
    saveTasks(); // Save tasks after reordering
  }, 0);
}

function dragOver(e) {
  e.preventDefault();
}

function dragEnter(e) {
  e.preventDefault();
  this.classList.add('over');
}

function dragLeave() {
  this.classList.remove('over');
}

function dragDrop() {
  this.classList.remove('over');
  this.appendChild(draggedTask);
  updateTaskButton(); // Update button state
  saveTasks(); // Save tasks after dropping
}

// Update the button to "Done" when the task is moved to the "Done" column
function updateTaskButton() {
  document.querySelectorAll('.task').forEach(task => {
    const taskColumn = task.closest('.task-column').id;
    const doneButton = task.querySelector('button.done');
    const removeButton = task.querySelector('button.remove');

    if (taskColumn === 'done') {
      doneButton.style.display = 'none'; // Hide Done button in Done column
      removeButton.innerHTML = '<strong>&#10005;</strong>'; // Bold X for remove
    } else {
      doneButton.style.display = 'block'; // Show Done button in other columns
    }
  });
}

// Save tasks to localStorage
function saveTasks() {
  const tasks = {
    todo: [],
    inProgress: [],
    done: []
  };

  taskLists.forEach(list => {
    const columnId = list.closest('.task-column').id;
    list.querySelectorAll('.task').forEach(task => {
      tasks[columnId].push(task.querySelector('.task-text').textContent.trim());
    });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks'));
  if (!savedTasks) return;



  
  Object.keys(savedTasks).forEach(columnId => {
    savedTasks[columnId].forEach(taskText => {
      createTaskElement(taskText, columnId);
    });
  });
}
