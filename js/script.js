'use strict';


let tasks = [];
let contacts = [];
let subtasks = [];

/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    await includeHTML();
    highlightActiveMenuItem();
    logoutModalEventListener();
}


/**
 * Inserts the HTML from the template files into the referenced file.
 */
async function includeHTML() {
    const includeElements = document.querySelectorAll('[template-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        const file = element.getAttribute("template-html");
        const resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


/**
 * Highlights the active menu item after the page is loaded. The marking takes place on the basis of the path.
 */
function highlightActiveMenuItem() {
    const currentPath = location.pathname;

    switch (currentPath) {
        case '/summary.html':
            addActiveClass('summary');
            break;
        case '/board.html':
            addActiveClass('board');
            break;
        case '/task.html':
            addActiveClass('task');
            break;
        case '/contacts.html':
            addActiveClass('contacts');
            break;
        case '/legal.html':
            document.getElementById('legal-desktop').classList.add('active');
            break;
        default:
            break;
    }
}


/**
 * Adds the class .active to the given element.
 * @param {String} item String of the item
 */
function addActiveClass(item) {
    document.getElementById(`${item}-desktop`).classList.add('active');
    document.getElementById(`${item}-mobile`).classList.add('active');
}


/**
 * Adds an event listener to the profile picture to toggle the logout modal.
 */
function logoutModalEventListener() {
    try {
        document.getElementById('profile-picture').addEventListener('click', () => {
            document.getElementById('logout-modal').classList.toggle('d-none');
        });
    } catch (error) {

    }

}


/**
 * Loads the tasks from the backend. If no tasks are available an empty array is created.
 */
async function loadTasks() {
    tasks = await JSON.parse(backend.getItem('tasks')) || [];
}


/**
 * Loads the contacts from the backend. If no contacts are available an empty array is created.
 */
async function loadContacts() {
    contacts = await JSON.parse(backend.getItem('contacts')) || [];
}


/**
 * Stores the tasks in the backend.
 */
async function storeTasks() {
    await backend.setItem('tasks', JSON.stringify(tasks));
}


/**
 * Stores the contacts in the backend.
 */
async function storeContacts() {
    await backend.setItem('contacts', JSON.stringify(contacts));
}


// !--> Wird function noch benötigt? <--!
function getNewContactID() {
    let value = 0;
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        if (contact.id > value) value = contact.id + 1;
    }
    return value;
}


/**
 * Function to convert the date Format
 * @param {String} date 
 * @returns dd.mm.yyy
 */
function convertDateString(date) { // yyy-mm-dd
    const dateArray = date.split('-');
    return dateArray[2] + '.' + dateArray[1] + '.' + dateArray[0]
}

/**
 * toggles the Type of the password input field between text/password
 */
function togglePW() {
    let pwLock = document.getElementById('inputPassword');
    if (pwLock.type == 'text') pwLock.type = 'password';
    else pwLock.type = 'text';
}

function addSubtask() {
    let text = document.getElementById('subtask').value;
    subtasks.push({ 'text': text, 'done': false })
    renderSubtasks();
    document.getElementById('subtask').value = '';
    hideIcon();
}

function clearSubtask() {
    document.getElementById('subtask').value = '';
    hideIcon();
}

function showIcon() {
    document.getElementById('add').classList.add('d-none');
    document.getElementById('edit').classList.remove('d-none');
    //if(document.getElementById('subtask').value == '') hideIcon();
}

function hideIcon() {
    document.getElementById('add').classList.remove('d-none');
    document.getElementById('edit').classList.add('d-none');
}

function renderSubtasks() {
    const element = document.getElementById('contentSubtasks');
    element.innerHTML = '';
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        element.innerHTML += `
            <input type="checkbox" id="check${i}" class="subtaskCheckbox" ${getSubtaskCheckedString(subtask)}>
            <label for="check${i}" class="subtaskLabel">${subtask.text}</label><br>
        `;
    }
}

function renderEditSubtasks(task) {
    const element = document.getElementById('contentSubtasks');
    element.innerHTML = '';    
    for (let i = 0; i < task.subtasks.length; i++) {
        const subtask = task.subtasks[i];
        element.innerHTML += `
            <input type="checkbox" id="check${i}" class="subtaskEditCheckbox" ${getSubtaskCheckedString(subtask)}>
            <label for="check${i}" class="subtaskLabel">${subtask.text}</label><br>
        `;
    }
}

function getSubtasks(){
    let subtasks = [];
    let elements = document.querySelectorAll('.subtaskCheckbox');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let done = element.checked;
        let text = element.nextElementSibling.textContent;
        subtasks.push({'text' : text, 'done' : done})
    }

    return subtasks;
}

function getEditSubtasks(){
    let subtasks = [];
    let elements = document.querySelectorAll('.subtaskEditCheckbox');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let done = element.checked;
        let text = element.nextElementSibling.textContent;
        subtasks.push({'text' : text, 'done' : done})
    }

    return subtasks;
}

function getSubtaskCheckedString(subtask){
    let checkedString = '';
    if(subtask.done) checkedString = 'checked';
    return checkedString;
}

init();