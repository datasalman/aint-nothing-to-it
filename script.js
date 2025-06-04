document.addEventListener('DOMContentLoaded', () => {
    // Get all the day columns (sections) from the HTML
    const dayColumns = document.querySelectorAll('.day-column');

    // Loop through each day column to set up its functionality
    dayColumns.forEach(column => {
        // Inside each 'column' (e.g., Monday's section), find its specific form, input, and list
        const todoForm = column.querySelector('.todo-form'); // The form for adding new tasks
        const todoInput = column.querySelector('.todo-input'); // The input field for typing tasks
        const todoList = column.querySelector('.todo-list');   // The <ul> where tasks will be shown
        
        // Get the day name from the <h2> tag for more specific alerts (optional but nice)
        const dayName = column.querySelector('h2').textContent.split(' ')[0];

        // Safety check: only proceed if all necessary elements are found for this column
        if (todoForm && todoInput && todoList) {

            // --- 1. ADDING A NEW TASK ---
            // Listen for the 'submit' event on the form (e.g., clicking '+' or pressing Enter)
            todoForm.addEventListener('submit', function(event) {
                event.preventDefault(); // IMPORTANT: Stop the browser from reloading the page on form submission

                // Get the text from the input field and remove leading/trailing spaces
                const taskText = todoInput.value.trim();

                // Only add the task if the input field wasn't empty
                if (taskText !== "") {
                    // Create a new list item (<li>) element
                    const newTaskLi = document.createElement('li');

                    // Create a <span> element to hold the task text
                    // This helps separate the text from the delete button for styling and clicking
                    const taskTextSpan = document.createElement('span');
                    taskTextSpan.textContent = taskText;

                    // Create a delete button (<button>) element
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '❌'; // Set the button's text to an emoji
                    deleteButton.classList.add('delete-btn-item'); // Add a class for styling and identifying it

                    // Append the task text span and the delete button to the new list item (<li>)
                    newTaskLi.appendChild(taskTextSpan);
                    newTaskLi.appendChild(deleteButton);

                    // Append the new list item (with text and delete button) to the actual to-do list (<ul>)
                    todoList.appendChild(newTaskLi);

                    // Clear the input field for the next task entry
                    todoInput.value = "";
                } else {
                    // If the input was empty, show an alert
                    alert(`Hey, you gotta write something for the task on ${dayName}! 📝`);
                }
            });

            // --- 2. HANDLING CLICKS ON TASKS (MARK COMPLETE OR DELETE) ---
            // Event Delegation: Attach ONE click listener to the parent <ul> (todoList).
            // This listener will handle clicks on any tasks (<li>) or delete buttons inside it,
            // even if they are added dynamically AFTER the page loads.
            todoList.addEventListener('click', function(event) {
                const clickedElement = event.target; // 'event.target' is the exact element that was clicked

                // A. Check if the clicked element is a DELETE BUTTON
                if (clickedElement.classList.contains('delete-btn-item')) {
                    // If it's a delete button, find its parent <li> and remove it
                    const taskItemToRemove = clickedElement.parentElement; // The parent of the button is the <li>
                    taskItemToRemove.remove(); // Remove the <li> from the page
                }
                // B. Else, check if the clicked element is a TASK ITEM (LI) itself
                //    (or the span inside it, so we check the parent too)
                else if (clickedElement.tagName === 'LI') {
                    // If it's an <li>, toggle the 'completed' class on it
                    clickedElement.classList.toggle('completed');
                } else if (clickedElement.parentElement.tagName === 'LI' && !clickedElement.classList.contains('delete-btn-item')) {
                    // This handles clicking on the task text (span) within the LI
                    clickedElement.parentElement.classList.toggle('completed');
                }
            });
        }
    });
});