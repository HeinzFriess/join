'use strict';


let tasks = [];
let categories = [];
let states = [];
let prioritiesdb = [];
let contacts = [];
let subtasks = [];
let url = 'http://127.0.0.1:8000/';
let token = '';
let Authorization;

/**
 * Initial function that gets executed after the document is loaded.
 */
async function init() {
    if (localStorage.getItem('token')) {
        token = localStorage.getItem('token');
        Authorization = 'token ' + token;
    }
    // token = localStorage.getItem('token');
    // Authorization = 'token ' + token;
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
    const currentPath = location.pathname.replace('/join', '');

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


async function loadDBEntries() {
    await loadTasks();
    await loadCategories();
    await loadPriorities();
    await loadStates();
    await loadContacts();
}

/**
 * Loads the tasks from the backend. If no tasks are available an empty array is created.
 */
async function loadTasks() {
    //tasks = await JSON.parse(backend.getItem('tasks')) || [];
    const response = await fetch(url + 'ticket/', {
        method: "GET",
        headers: {
            'Authorization': Authorization,
        }
    }).then(response => response.json())
        //.then(response => console.log(response))
        .then(response => {
            tasks = response;
            // tasks.forEach(task => {
            //     try {
            //         if(task.subtasks.length > 1) task.subtasks = JSON.parse(task.subtasks);
            //         else task.subtasks = [];
            //     } catch (error) {
            //         console.log('Error', error);
            //     }                
            // });
            //console.log('here are the tasks',tasks);
        })
}

async function editTasks(task) {
    let payload = {
        title: task.title,
        description: task.description,
        maintask: true,
        subtasks: task.subtasks, //JSON.stringify(task.subtasks),
        assigned: task.assigned,
        date: task.date,
        category: task.category,
        priority: task.priority,
        status: task.status
    }
    console.log(task);
    const response = await fetch(url + 'ticket/' + task.id + '/', {
        method: "PUT"
        ,
        body: JSON.stringify(payload),

        headers: {
            'Authorization': Authorization,
            "Content-Type": "application/json",
            "Content-Length": "149",
        }

    }).then(response => { renderTasks();})


}

async function loadCategories() {
    const response = await fetch(url + 'category/', {
        method: "GET",
        headers: {
            'Authorization': Authorization,
        }
    }).then(response => response.json())
        .then(response => { categories = response })

}

async function loadStates() {
    const response = await fetch(url + 'state/', {
        method: "GET",
        headers: {
            'Authorization': Authorization,
        }
    }).then(response => response.json())
        .then(response => { states = response })

}

async function loadPriorities() {
    const response = await fetch(url + 'priority/', {
        method: "GET",
        headers: {
            'Authorization': Authorization,
        }
    }).then(response => response.json())
        .then(response => { prioritiesdb = response })

}


/**
 * Loads the contacts from the backend. If no contacts are available an empty array is created.
 */
async function loadContacts() {
    //contacts = await JSON.parse(backend.getItem('contacts')) || [];
    const response = await fetch(url + 'user/', {
        method: "GET",
        headers: {
            'Authorization': Authorization,
        }
    }).then(response => response.json())
        .then(response => { contacts = response })
}

/**
 * Edits the contacts
 */
async function editContacts(user) {
    let payload = {
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
    }
    const response = await fetch(url + 'user/' + user.id + '/', {
        method: "PUT"
        ,        
        body: JSON.stringify(payload),

        headers: {
            'Authorization': Authorization,
            "Content-Type": "application/json",
            //"Content-Length": "149",
        }
    }).then(response => response.json())
}



async function addTask(task) {
    const payload = {
        "title": task.title,
        "description": task.description,
        "maintask": true,
        "subtasks": task.subtasks,
        "assigned": task.assigned,
        "date": task.date,
        "category": task.category,
        "priority": task.priority,
        "status": task.status
    }
    const response = await fetch(url + 'ticket/', {
        method: "POST",
        headers: {
            'Authorization': Authorization,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    }).then(response => loadTasks())

}


/**
 * Stores the new contact.
 */
async function storeNewContact(user) {
    const payload = {
        "username": user.username,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "password" : user.password
    }
    const response = await fetch(url + 'adduser/', {
        method: "POST",
        headers: {
            'Authorization': Authorization,
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        body: JSON.stringify(payload),
    }).then(response => loadContacts())


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

function addSubtask(edit, taskID) {
    let text = document.getElementById('subtasks').value;
    if (!edit) {
        subtasks.push({ 'text': text, 'done': false });
        renderSubtasks()
    };
    if (edit) {
        const task = tasks.find(({ id }) => id == taskID);
        task.subtasks.push({ 'text': text, 'done': false });
        renderEditSubtasks(task)
    };
    document.getElementById('subtasks').value = '';
    hideIcon();
}

function clearSubtask() {
    document.getElementById('subtasks').value = '';
    hideIcon();
}

function showIcon() {
    document.getElementById('add').classList.add('d-none');
    document.getElementById('edit').classList.remove('d-none');
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

function clearSubtasksContent() {
    document.getElementById('contentSubtasks').innerHTML = '';
}

function getSubtasks() {
    let subtasks = [];
    let elements = document.querySelectorAll('.subtaskCheckbox');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let done = element.checked;
        let text = element.nextElementSibling.textContent;
        subtasks.push({ 'text': text, 'done': done })
    }
    return subtasks;
}

function getEditSubtasks() {
    let subtasks = [];
    let elements = document.querySelectorAll('.subtaskEditCheckbox');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        let done = element.checked;
        let text = element.nextElementSibling.textContent;
        subtasks.push({ 'text': text, 'done': done })
    }
    return subtasks;
}

function getSubtaskCheckedString(subtask) {
    let checkedString = '';
    if (subtask.done) checkedString = 'checked';
    return checkedString;
}

init();