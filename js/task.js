"use strict";


/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
    renderAssignees();
    addAllEventListeners();
}


/**
 * Adds event listeners to all the listed elments.
 */
function addAllEventListeners() {
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


function addTask(event, isMain) {
    event.preventDefault();

    const title = document.getElementById('title');
    const assigned = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(assignee => assigned.push(assignee.value));
    const date = document.getElementById('date');
    const category = document.getElementById('category');
    const priority = document.querySelector('input[name="priority"]:checked');
    const description = document.getElementById('description');

    tasks.push({
        "id" : Date.now().toString(36),
        "status" : "To do",
        "maintask" : isMain,
        "title" : title.value,
        "assigned" : assigned,
        "dueDate" : date.value,
        "category" : category.value,
        "priority" : priority != null ? 'priority.value' : 'low',
        "description" : description.value,
        "subtasks" : []
    })

    // storeTasks();
    emptyForm();
}


/**
 * Clears all the input fields for creating a new task.
 */
function emptyForm() {
    document.getElementById('title').value = '';
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(assignee => assignee.checked = false);
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
    document.querySelector('input[name="priority"]:checked').checked = false;
    document.getElementById('description').value = '';
}


/**
 * HTML template for rendering the assignee.
 * @param {Object} contact Conact that should be rendered
 * @returns HTML assignee template
 */
function assigneeTemp(contact) {
    return `
        <label for="${contact.id}">${contact.firstname} ${contact.lastname}
            <input type="checkbox" name="${contact.id}" id="${contact.id}" value="${contact.id}">
            <span class="checkmark"></span>
        </label>`;
}


init();