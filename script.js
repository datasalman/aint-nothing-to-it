// script.js

// SECTION 1: Supabase Configuration
const SUPABASE_URL = 'https://lylyjfpemeqzgyjddtsb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bHlqZnBlbWVxemd5amRkdHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjI1MTcsImV4cCI6MjA2NDYzODUxN30.WVOM1CFfjaAMFwnyx9bSJkPwQGDaF5yGjB-i9k6IB8w';

let supabaseClient;

// SECTION 2: DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    if (typeof supabase === 'undefined' || typeof supabase.createClient === 'undefined') {
        console.error('Supabase library (supabase) is not defined or createClient method is missing. Check your Supabase CDN script tag in index.html, network connection, and for any browser console errors related to loading the CDN script.');
        alert('Critical Error: Supabase features cannot be initialized. Please check the console for details.');
        return;
    }
    const { createClient } = supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    if (!supabaseClient) {
        console.error('Supabase client initialization failed. createClient might have returned null or undefined.');
        alert('Critical Error: Failed to initialize Supabase client. Please check the console.');
        return;
    }

    // --- HELPER FUNCTION TO RENDER A SINGLE TASK ---
    function renderTask(task) {
        // Ensure day_of_week is a string and try to find the column
        const dayOfWeekString = String(task.day_of_week).toLowerCase();
        const dayColumn = document.getElementById(dayOfWeekString);

        if (!dayColumn) {
            console.error(`Could not find day column for: ${dayOfWeekString}. Task ID: ${task.id}`);
            return; // Skip rendering this task if its day column isn't found
        }
        const todoList = dayColumn.querySelector('.todo-list');
        if (!todoList) {
            console.error(`Could not find todo list for: ${dayOfWeekString}. Task ID: ${task.id}`);
            return; // Skip if list isn't found
        }

        const newTaskLi = document.createElement('li');
        newTaskLi.dataset.id = task.id; // Store database ID

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = task.task_text;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌';
        deleteButton.classList.add('delete-btn-item');

        newTaskLi.appendChild(taskTextSpan);
        newTaskLi.appendChild(deleteButton);

        if (task.is_completed) {
            newTaskLi.classList.add('completed'); // Apply 'completed' class if task is completed
        }

        todoList.appendChild(newTaskLi);
    }

    // --- ASYNC FUNCTION TO FETCH AND RENDER ALL TASKS ---
    async function fetchAndRenderTasks() {
        try {
            const { data: tasks, error } = await supabaseClient
                .from('todos')
                .select('*') // Get all columns
                .order('created_at', { ascending: true }); // Show oldest tasks first

            if (error) {
                throw error; // Let the catch block handle it
            }

            // Clear existing tasks from all lists before rendering fetched tasks
            // This prevents duplicates if this function is ever called multiple times
            document.querySelectorAll('.todo-list').forEach(list => {
                list.innerHTML = '';
            });

            if (tasks && tasks.length > 0) {
                tasks.forEach(task => {
                    renderTask(task); // Use our helper function
                });
            } else {
                console.log('No tasks found in the database (or an empty array was returned).');
            }
        } catch (error) {
            console.error('Error fetching tasks from Supabase:', error.message);
            alert('Oops! Could not load your tasks. Please try refreshing the page. 😕');
        }
    }

    // --- INITIALIZE PAGE: Fetch and render existing tasks ---
    fetchAndRenderTasks(); // Call this function when the page loads

    // --- EVENT LISTENERS FOR EACH DAY COLUMN ---
    const dayColumns = document.querySelectorAll('.day-column');
    dayColumns.forEach(column => {
        const todoForm = column.querySelector('.todo-form');
        const todoInput = column.querySelector('.todo-input');
        // const todoList = column.querySelector('.todo-list'); // todoList is now accessed inside renderTask
        const dayName = column.querySelector('h2').textContent.split(' ')[0]; // e.g., "Monday"

        if (todoForm && todoInput) { // todoList is not directly used here anymore for adding
            // --- ADDING A NEW TASK (Async, with Supabase) ---
            todoForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                const taskText = todoInput.value.trim();

                if (taskText !== "") {
                    const taskDataForSupabase = {
                        task_text: taskText,
                        is_completed: false,
                        day_of_week: dayName // Use the dayName like "Monday", "Tuesday"
                    };

                    try {
                        const { data, error } = await supabaseClient
                            .from('todos')
                            .insert([taskDataForSupabase])
                            .select();

                        if (error) {
                            throw error;
                        }

                        if (data && data.length > 0) {
                            const newDbTask = data[0];
                            renderTask(newDbTask); // Use the renderTask helper function!
                            todoInput.value = "";   // Clear the input field
                        } else {
                            console.warn('Supabase insert succeeded but returned no data.');
                        }
                    } catch (error) {
                        console.error('Error adding task to Supabase:', error.message);
                        alert('Oops! Could not save your task. Please check your connection and try again. 😕');
                    }
                } else {
                    alert(`Hey, you gotta write something for the task on ${dayName}! 📝`);
                }
            });

            // --- HANDLING CLICKS ON TASKS (MARK COMPLETE OR DELETE - HTML only for now) ---
            // Note: We need to ensure todoList is available for this listener.
            // It's better to attach this listener once to a static parent if possible,
            // but for now, let's re-select it or ensure it's passed correctly.
            // The renderTask function gets the correct todoList, so for clicks, we should ensure
            // the listener is on a list that exists. The current dayColumns.forEach handles this
            // because todoList is selected within each column's scope.

            const currentColumnTodoList = column.querySelector('.todo-list');
            if (currentColumnTodoList) {
                currentColumnTodoList.addEventListener('click', function(event) {
                    const clickedElement = event.target;
                    if (clickedElement.classList.contains('delete-btn-item')) {
                        const taskItemToRemove = clickedElement.parentElement;
                        // We'll need to delete from Supabase here later
                        taskItemToRemove.remove();
                    } else if (clickedElement.tagName === 'LI') {
                        // We'll need to update is_completed in Supabase here later
                        clickedElement.classList.toggle('completed');
                    } else if (clickedElement.parentElement.tagName === 'LI' && !clickedElement.classList.contains('delete-btn-item')) {
                        // We'll need to update is_completed in Supabase here later
                        clickedElement.parentElement.classList.toggle('completed');
                    }
                });
            }
        }
    });
});