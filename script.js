document.addEventListener('DOMContentLoaded', () => {
    const dayColumns = document.querySelectorAll('.day-column');

    dayColumns.forEach(column => {
        const todoForm = column.querySelector('.todo-form');
        const todoInput = column.querySelector('.todo-input');
        const todoList = column.querySelector('.todo-list');
        const dayName = column.querySelector('h2').textContent.split(' ')[0];

        if (todoForm && todoInput && todoList) {
            // --- ADDING A NEW TASK ---
            todoForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const taskText = todoInput.value.trim();

                if (taskText !== "") {
                    const newTaskLi = document.createElement('li');
                    const taskTextSpan = document.createElement('span');
                    taskTextSpan.textContent = taskText;

                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = '❌';
                    deleteButton.classList.add('delete-btn-item');

                    newTaskLi.appendChild(taskTextSpan);
                    newTaskLi.appendChild(deleteButton);
                    todoList.appendChild(newTaskLi);
                    todoInput.value = "";
                } else {
                    alert(`Hey, you gotta write something for the task on ${dayName}! 📝`);
                }
            });

            // --- HANDLING CLICKS ON TASKS (MARK COMPLETE OR DELETE) ---
            todoList.addEventListener('click', function(event) {
                const clickedElement = event.target;

                if (clickedElement.classList.contains('delete-btn-item')) {
                    const taskItemToRemove = clickedElement.parentElement;
                    taskItemToRemove.remove();
                } else if (clickedElement.tagName === 'LI') {
                    clickedElement.classList.toggle('completed');
                } else if (clickedElement.parentElement.tagName === 'LI' && !clickedElement.classList.contains('delete-btn-item')) {
                    clickedElement.parentElement.classList.toggle('completed');
                }
            });
        }
    });
});