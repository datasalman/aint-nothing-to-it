// script.js

// SECTION 1: Supabase Configuration (ONCE at the very top)
const SUPABASE_URL = 'https://lylyjfpemeqzgyjddtsb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bHlqZnBlbWVxemd5amRkdHNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwNjI1MTcsImV4cCI6MjA2NDYzODUxN30.WVOM1CFfjaAMFwnyx9bSJkPwQGDaF5yGjB-i9k6IB8w';

// Declare a variable that will hold your Supabase client instance.
let supabaseClient;

// SECTION 2: DOMContentLoaded listener (ONCE, wrapping the rest)
document.addEventListener('DOMContentLoaded', () => {
    // Check if the Supabase global object and its createClient method are available
    if (typeof supabase === 'undefined' || typeof supabase.createClient === 'undefined') {
        console.error('Supabase library (supabase) is not defined or createClient method is missing. Check your Supabase CDN script tag in index.html, network connection, and for any browser console errors related to loading the CDN script.');
        alert('Critical Error: Supabase features cannot be initialized. Please check the console for details.');
        return; // Stop further execution if Supabase is not available
    }

    // Destructure the createClient function from the global supabase object
    const { createClient } = supabase;

    // Initialize the Supabase client
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Quick check if client initialization was successful (it should return an object)
    if (!supabaseClient) {
        console.error('Supabase client initialization failed. createClient might have returned null or undefined.');
        alert('Critical Error: Failed to initialize Supabase client. Please check the console.');
        return; 
    }
    
    // --- The rest of your application logic ---
    const dayColumns = document.querySelectorAll('.day-column');

    dayColumns.forEach(column => {
        const todoForm = column.querySelector('.todo-form');
        const todoInput = column.querySelector('.todo-input');
        const todoList = column.querySelector('.todo-list');
        const dayName = column.querySelector('h2').textContent.split(' ')[0];

        if (todoForm && todoInput && todoList) {
            // --- ADDING A NEW TASK (Async, with Supabase) ---
            todoForm.addEventListener('submit', async function(event) {
                event.preventDefault();
                const taskText = todoInput.value.trim();

                if (taskText !== "") {
                    const taskDataForSupabase = {
                        task_text: taskText,
                        is_completed: false,
                        day_of_week: dayName
                    };

                    try {
                        const { data, error } = await supabaseClient // Use our initialized client
                            .from('todos')
                            .insert([taskDataForSupabase])
                            .select();

                        if (error) {
                            throw error;
                        }

                        if (data && data.length > 0) {
                            const newDbTask = data[0];
                            const newTaskLi = document.createElement('li');
                            newTaskLi.dataset.id = newDbTask.id;
                            const taskTextSpan = document.createElement('span');
                            taskTextSpan.textContent = newDbTask.task_text;
                            const deleteButton = document.createElement('button');
                            deleteButton.textContent = '❌';
                            deleteButton.classList.add('delete-btn-item');
                            newTaskLi.appendChild(taskTextSpan);
                            newTaskLi.appendChild(deleteButton);
                            todoList.appendChild(newTaskLi);
                            todoInput.value = "";
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