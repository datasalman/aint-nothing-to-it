document.addEventListener('DOMContentLoaded', () => {
    // Get all the day columns
    const dayColumns = document.querySelectorAll('.day-column'); // This gets a list of all elements with class 'day-column'

    // Loop through each day column
    dayColumns.forEach(column => {
        // For each column, find its specific form, input, and list
        const todoForm = column.querySelector('.todo-form');
        const todoInput = column.querySelector('.todo-input');
        const todoList = column.querySelector('.todo-list');
        const dayName = column.querySelector('h2').textContent.split(' ')[0]; // Get the day name like "Monday"

        if (todoForm && todoInput && todoList) { // Make sure we found all elements
            todoForm.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent page reload

                const taskText = todoInput.value.trim();

                if (taskText !== "") {
                    const newTask = document.createElement('li');
                    newTask.textContent = taskText;
                    // You could add classes or other attributes to newTask here if needed

                    todoList.appendChild(newTask);
                    todoInput.value = ""; // Clear the input
                } else {
                    // You could make this more specific, e.g., "Please enter a task for [Day Name]!"
                    alert(`Hey, you gotta write something for the task on ${dayName}! 📝`);
                }
            });
        }
    });

    // Next up: Marking tasks as complete and deleting them!
});