"use strict";


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    //await downloadFromServer();
    await loadTasks();
    await loadContacts();
    renderAssignees();
    addAllEventListenersTask();
}


/**
 * Adds event listeners to all the listed elments.
 */
function addAllEventListenersTask() {
    const assigneeMenu = document.getElementById('assignee');
    const addTaskBtn = document.getElementById('add-task');
    const clearBtn = document.getElementById('clear-task');

    assigneeMenu.addEventListener('click', toggleDropdown);
    addTaskBtn.addEventListener('click', (event) => addTask(event, true));
    clearBtn.addEventListener('click', emptyForm);
}


/**
 * Renders the assignees (all available contacts) into the dropdown selection.
 */
function renderAssignees() {
    const assigneeContainer = document.getElementById('assignee-container');

    assigneeContainer.innerHTML = '';
    contacts.forEach(contact => {
        assigneeContainer.innerHTML += assigneeTemp(contact);
    })
}


/**
 * Toggles the custom dropdown menu for the assignees.
 */
function toggleDropdown() {
    const assigneeBackground = document.getElementById('assignee-background');
    const assigneeContainer = document.getElementById('assignee-container');

    assigneeBackground.classList.toggle('d-none');
    assigneeContainer.classList.toggle('d-none');
}


/**
 * Validates the creation of a new task and creates a new task if conditions are met. Otherwise it will inform
 * the user about the missing information.
 * @param {event} event Event listener event
 * @param {Boolean} isMain Indicator if created event is a main event
 */
function addTask(event, isMain) {
    event.preventDefault();
    const title = document.getElementById('title');
    const assigned = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(assignee => assigned.push(assignee.value));
    const date = document.getElementById('date');
    const category = document.getElementById('category');
    const priority = document.querySelector('input[name="priority"]:checked');
    const description = document.getElementById('description');

    if (title.checkValidity() && date.checkValidity() && category.checkValidity() && assigned.length > 0) {
        createNewTask(isMain, title.value, assigned, date.value, category.value, priority != null ? priority.value : 'low', description.value, getSubtasks());
    } else {
        reportEmptyInputs(title, assigned, date, category);
    }
}


/**
 * Creates a new Task and pushes the task to the tasks array.
 * @param {Boolean} isMain Is main taks
 * @param {String} title Titel of the task
 * @param {Array} assigned Array of assignee id's
 * @param {String} date Date of task creation
 * @param {String} category Task category
 * @param {String} priority Task priority
 * @param {Strin} description Task description
 */
function newTask(isMain, title, assigned, date, category, priority, description, subtasks) {
    let task ={
        "status" : 1,
        "maintask" : isMain,
        "title" : title,
        "assigned" : assigned,
        "date" : date,
        "category" : category,
        "priority" : priority,
        "description" : description,
        "subtasks" : subtasks
    };
    addNewTask(task);
    // tasks.push({
    //     //"id" : Date.now().toString(36),
    //     "status" : "To Do",
    //     "maintask" : isMain,
    //     "title" : title,
    //     "assigned" : assigned,
    //     "date" : date,
    //     "category" : category,
    //     "priority" : priority,
    //     "description" : description,
    //     "subtasks" : subtasks
    // });
    
}


/**
 * Creates a new task, saves all tasks and redirect to the board page.
 * @param {Boolean} isMain Is main taks
 * @param {String} title Titel of the task
 * @param {Array} assigned Array of assignee id's
 * @param {String} date Date of task creation
 * @param {String} category Task category
 * @param {String} priority Task priority
 * @param {Strin} description Task description
 */
async function createNewTask(isMain, title, assigned, date, category, priority, description, subtasks) {
    newTask(
        isMain, title, assigned, date, category, priority, description, subtasks
    );

    await storeTasks();
    emptyForm();
    window.location.href = 'board.html';
}


/**
 * Report validity if inputs are empty.
 * @param {String} title Task title
 * @param {Array} assigned Array with contact id'S
 * @param {String} date Task due date
 * @param {String} category Task category
 */
function reportEmptyInputs(title, assigned, date, category) {
    category.reportValidity();
        date.reportValidity();
        if (assigned.length === 0) {
            document.getElementById('assignee-check').reportValidity();
        }
        title.reportValidity();
}


/**
 * Clears all the input fields for creating a new task.
 */
function emptyForm() {
    document.getElementById('title').value = '';
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(assignee => assignee.checked = false);
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
    document.getElementById('description').value = '';
    clearSubtasksContent();
    clearSubtask();
    const priority = document.querySelector('input[name="priority"]:checked');
    if (priority) {
        priority.checked = false;
    }
}


/**
 * HTML template for rendering the assignee.
 * @param {Object} contact Conact that should be rendered
 * @returns HTML assignee template
 */
function assigneeTemp(contact) {
    let lastName = '';
    if(contact.lastname) lastName = contact.lastname;
    return `
        <label for="${contact.id}">${contact.firstname} ${lastName}
            <input type="checkbox" name="${contact.id}" id="${contact.id}" value="${contact.id}">
            <span class="checkmark"></span>
        </label>`;
}


init();