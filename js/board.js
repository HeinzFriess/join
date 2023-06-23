"use strict";

const toDoElement = document.getElementById('toDo');
const inProgressElement = document.getElementById('inProgress');
const awaitingFeedbackElement = document.getElementById('awaitingFeedback');
const doneElement = document.getElementById('done');
const priorities = ["Urgent", "Medium", "Low"];
let statusCall = '';
let draggedElement;
let searchString = '';

/**
 * initial load of necessary functions
 */
async function initBoard() {
    //await downloadFromServer();
    await loadTasks();
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
function renderTasks() {
    render('To do', toDoElement);
    render('In progress', inProgressElement);
    render('Awaiting feedback', awaitingFeedbackElement);
    render('Done', doneElement);
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
 * collects the inputfields of the new task window and stores it to the backend
 */
function createNewTask() {
    tasks.push(getTaskJson(false));
    closeSlide();
    storeTasks();
    renderTasks();
    notify('Der Task wurde angelegt');
    subtasks = [];
    
}

/**
 * gets the task inputfileds and returns the taskJson
 * @returns JSON
 */
function getTaskJson(isEdit) {
    const assigned = [];
    document.querySelectorAll('input[class="assigneeClass"]:checked').forEach(assignee => assigned.push(assignee.value));
    let subtasks = [];
    if(isEdit) subtasks = getEditSubtasks() ? getEditSubtasks() : [];
    if(!isEdit) subtasks = getSubtasks() ? getSubtasks() : [];
    return {
        "assigned": assigned,
        "category": document.getElementById('category').value,
        "description": document.getElementById('description').value,
        "dueDate": document.getElementById('date').value,
        "id": Date.now().toString(36),
        "maintask": true,
        "priority": getPriority() ? getPriority() : 'low',
        "status": statusCall,
        "subtasks": subtasks,
        "title": document.getElementById('title').value
    };
}

/**
 * itertates the priority buttons 
 * @returns priority as string
 */
function getPriority() {
    let priority;
    for (let i = 0; i < priorities.length; i++) {
        const element = document.getElementById(priorities[i].toLowerCase());
        if (element.checked) priority = priorities[i];
    }
    return priority;
}

/**
 * deletes the task from the backend
 * @param {string} taskID 
 */
function deleteTask(taskID) {
    const task = tasks.find(({ id }) => id == taskID);
    const indexOfTask = tasks.indexOf(task);
    tasks.splice(indexOfTask, 1);
    storeTasks();
    renderTasks();
    closeEdit();
    notify(`Der Task wurde gelöscht`);

}

/**
 * saves the changes of the taks to the backend
 * @param {string} taskID 
 */
function saveChanges(taskID) {
    const task = tasks.find(({ id }) => id == taskID);
    const indexOfTask = tasks.indexOf(task);
    statusCall = task.status;
    tasks.splice(indexOfTask, 1, getTaskJson(true));
    subtasks = [];
    storeTasks();
    renderTasks();
    closeEdit();
    notify('Die Änderungen wurden übernommen')
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
    const indexOfTask = tasks.indexOf(task);
    task.status = status;
    tasks.splice(indexOfTask, 1, task);
    storeTasks();
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
        ${templateEditMenu(taskID)}
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