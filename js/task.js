"use strict";

const assigneeMenu = document.getElementById('assignee');
const assigneeBackground = document.getElementById('assignee-background');
const assigneeContainer = document.getElementById('assignee-container');
const addTaskBtn = document.getElementById('add-task');


assigneeMenu.addEventListener('click', toggleDropdown);
addTaskBtn.addEventListener('click', (event) => addTask(event, true));


async function init() {
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
}

/**
 * Toggles the custom dropdown menu
 */
function toggleDropdown() {
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
        "priority" : priority.value,
        "description" : description.value,
        "subtasks" : []
    })

    storeTasks();
    emptyForm();
}


function emptyForm() {
    document.getElementById('title').value = '';
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(assignee => assignee.checked = false);
    document.getElementById('date').value = '';
    document.getElementById('category').value = '';
    document.querySelector('input[name="priority"]:checked').checked = false;
    document.getElementById('description').value = '';
}


init();