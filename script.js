// Wait for the HTML document to be fully loaded before running JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // --- MONDAY ---
    // 1. Get references to the HTML elements for Monday
    const mondayForm = document.querySelector('#monday .todo-form');
    const mondayInput = document.querySelector('#monday .todo-input');
    const mondayList = document.querySelector('#monday .todo-list');

    // 2. Listen for when Monday's form is submitted (e.g., button click or pressing Enter)
    mondayForm.addEventListener('submit', function(event) {
        // 3. When the form is submitted, do the following:
        event.preventDefault(); // Prevent the default form submission which reloads the page

        // Get the text from the input field (and remove any extra spaces)
        const taskText = mondayInput.value.trim();

        // Check if the taskText is not empty
        if (taskText !== "") {
            // Create a new list item (<li>) element
            const newTask = document.createElement('li');
            newTask.textContent = taskText; // Set the text of the list item

            // Add some basic styling or classes later if needed
            // For now, just add it to Monday's list
            mondayList.appendChild(newTask);

            // Clear the input field for the next task
            mondayInput.value = "";
        } else {
            alert("Hey, you gotta write something for the task! 📝");
        }
    });

    // We'll add functionality for other days and features later!
});