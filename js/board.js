"use strict";

const toDoElement = document.getElementById('toDo');
const inProgressElement = document.getElementById('inProgress');
const awaitingFeedbackElement = document.getElementById('awaitingFeedback');
const doneElement = document.getElementById('done');
//const priorities = ["Urgent", "Medium", "Low"];
let statusCall = '';
let draggedElement;
let searchString = '';

/**
 * initial load of necessary functions
 */
async function initBoard() {
    //await downloadFromServer();
    await loadDBEntries();
    await loadContacts();
    renderTasks();
    //addAllEventListenersTask();
}

/**
 * Adds event listeners to all the listed elments.
 */
function addAllEventListeners() {
    const assigneeMenu = document.getElementById('assignee');
    assigneeMenu.addEventListener('click', toggleDropdown);
}

/**
 * Adds event listeners to all the listed elments.
 */
function addAllEventListenersTask() {
    const addTaskBtn = document.getElementById('createTask');
    addTaskBtn.addEventListener('click', (event) => createTask(event, true));
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
 * renders the tasks into the status aereas
 */
async function renderTasks() {
    await loadTasks();
    render(1, toDoElement);
    render(2, inProgressElement);
    render(3, awaitingFeedbackElement);
    render(4, doneElement);
}

/**
 * returns an HSL colorcode depending on the category string
 * @param {string} category 
 * @returns HSL Colorcode
 */
function getColorcodeForCategory(category) {
    return (category.charCodeAt(2) * category.charCodeAt(0) * category.charCodeAt(0)) / 3

}

/**
 * gets the task inputfileds and returns the taskJson
 * @returns JSON
 */
function getTaskJson(isEdit, task) {
    let assigned = '';
    let assignArray = document.querySelectorAll('input[type="checkbox"]:checked')
    for (let index = 0; index < assignArray.length; index++) {
        const assignee = assignArray[index];
        assigned = assigned + assignee.value;
        if(assignee !== assignArray[assignArray.length-1]) assigned = assigned + '|';
    }
    let subtasks = [];
    if (isEdit) subtasks = getEditSubtasks() ? getEditSubtasks() : [];
    if (!isEdit) subtasks = getSubtasks() ? getSubtasks() : [];
    return {
        "assigned": assigned,
        "category": +document.getElementById('category').value,
        "description": document.getElementById('description').value,
        "date": document.getElementById('date').value,
        "id": task.id,
        "maintask": true,
        "priority": getPriority() ? getPriority() : 'low',
        "status": task.status,
        "subtasks": subtasks, //JSON.stringify(task.subtasks),
        "title": document.getElementById('title').value
    };
    // console.log(JSON.stringify(subtasks));
    // return '';
}

/**
 * itertates the priority buttons 
 * @returns priority as string
 */
function getPriority() {
    let priority;
    for (let i = 0; i < prioritiesdb.length; i++) {
        const element = document.getElementById(prioritiesdb[i].name.toLowerCase());
        if (element.checked) priority = prioritiesdb[i].id;
    }
    return priority;
}


/**
 * drag and drop functionality
 * @param {string} taskID 
 */
function startDragging(taskID) {
    draggedElement = taskID;
}

/**
 * drag and drop functionality
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * changes the task according the droped element
 */
function drop(status) {
    const task = tasks.find(({ id }) => id == draggedElement);
    task.status = states.find(({ name }) => name == status).id;
    editTasks(task);
    renderTasks();
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
 * renders the New Task Form content
 */
function renderTaskNew() {
    let element = document.getElementById('newTask');
    element.innerHTML = `
    <form onsubmit="createNewTask(); return false;">
        <Button class="btn-primary create_Task_Button" id="createTask">
            <span class="createShort">Create</span>
            <span class="createLong">Create task </span>
            <img src="./assets/icons/checkButton.svg" alt="">
        </Button>
        <input required type="text" name="title" id="title" placeholder="Enter a title">
        ${templateAssignee()}
        ${templateDueDate()}
        ${templateCategory()}
        ${templatePriority()}
        ${templateDescription()}
        ${templateSubtasks()}
    `;
    element.innerHTML += `</form>`;
}

/**
 * renders the Task Edit Form content
 * @param {string} taskID 
 */
function renderTaskEdit(taskID) {
    let element = document.getElementById('taskEdit');
    const task = tasks.find(({ id }) => id == taskID);
    element.innerHTML = `
    <form onsubmit="return false">
        <div>
            <label for="title">Title</label>
            <input type="text" name="title" id="title" placeholder="Enter a title">
        </div>
        ${templateAssignee()}
        ${templateDueDate()}
        ${templateCategory()}
        ${templatePriority()}
        ${templateDescription()}
        ${templateSubtasks(true, taskID)}
        ${templateEditMenu(task)}
    `;

    renderAssignees();
    renderPopupEdit(task);
    renderEditSubtasks(task);
    addAllEventListeners();
}

/**
 * sets the value for the global searchstring out if the inputfield
 */
function filterTasks() {
    searchString = document.getElementById('searchInput').value.toLowerCase();
    renderTasks();
}

function getTaskPriority(task) {
    let name = ''
    prioritiesdb.forEach(prio => {
        if (prio.id == task.priority) name = prio.name;
    });
    return name;
}

function getTaskCategory(task) {
    let name = ''
    categories.forEach(cat => {
        if (cat.id == task.category) name = cat.name;
    });
    return name;
}

function callEditTask(taskID){
    const task = tasks.find(({ id }) => id == taskID);
    editTasks(getTaskJson(true, task), taskID)
        .then(Response => {
            subtasks = [];
            renderTasks();
            closeEdit();
            notify('Die Änderungen wurden übernommen')
        }

        );
}