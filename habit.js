const addHabits = document.querySelector(".add-habit");
const habitsList = document.querySelector(".habits");
const habitCountDisplay = document.getElementById("habit-count");
const habits = JSON.parse(localStorage.getItem("habits")) || [];

// Function to add a habit
function addHabit(e) {
  e.preventDefault();
  const text = this.querySelector("[name=habit]").value;
  const totalCounts = +this.querySelector("[name=reps]").value;
  const timeframe = this.querySelector("[name=timeframe]").value;
  const habit = {
    text: text,
    reps: 0,
    totalCounts: totalCounts,
    timeframe: timeframe,
    completed: false,
  };

  habits.push(habit);
  updateUI();
  this.reset();
}

// Function to list habits
function listHabits(habitList) {
  habitsList.innerHTML = habitList
    .map((habit, i) => `
        <li>
          <input type="checkbox" data-index=${i} id="habit${i}" ${habit.completed ? "checked" : ""} />
          <label for="habit${i}">
            <span>${habit.reps}/${habit.totalCounts} ${habit.timeframe}</span> ${habit.text}
          </label>
          <button class="delete" data-index=${i}>Delete</button>
        </li>
      `)
    .join("");
}

// Function to toggle completion status
function toggleCompleted(e) {
  if (!e.target.matches("input[type=checkbox]")) return;
  const index = e.target.dataset.index;
  habits[index].reps = e.target.checked ? habits[index].reps + 1 : habits[index].reps - 1;

  if (habits[index].reps >= habits[index].totalCounts) {
    habits[index].reps = habits[index].totalCounts;
    habits[index].completed = true;
  } else if (habits[index].reps < 0) {
    habits[index].reps = 0;
    habits[index].completed = false;
  }

  updateUI();
}

// Function to delete a habit
function deleteHabit(e) {
  if (!e.target.matches("button.delete")) return;
  const index = e.target.dataset.index;
  habits.splice(index, 1);
  updateUI();
}

// Function to update UI and local storage
function updateUI() {
  listHabits(habits);
  habitCountDisplay.textContent = habits.length;
  habitCountDisplay.classList.add('scaled');
  
  setTimeout(() => {
    habitCountDisplay.classList.remove('scaled');
  }, 300); // Reset the scale effect
  
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Initial UI update
updateUI();

// Event listeners
addHabits.addEventListener("submit", addHabit);
habitsList.addEventListener("click", toggleCompleted);
habitsList.addEventListener("click", deleteHabit);
