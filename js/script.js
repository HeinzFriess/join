'use strict';


let tasks = [];
let contacts = [];

async function init() {
    await includeHTML();
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
 * Adds an event listener to the profile picture to toggle the logout modal.
 */
function logoutModalEventListener() {
    document.getElementById('profile-picture').addEventListener('click', () => {
        document.getElementById('logout-modal').classList.toggle('d-none');
    });
}

async function loadTasks() {
    //return await fetch('/tasks.json').then(resp => resp.json());
    tasks = JSON.parse(backend.getItem('tasks')) || [];
}

async function loadContacts() {
    //return await fetch('/contacts.json').then(resp => resp.json());
    contacts = JSON.parse(backend.getItem('contacts')) || [];
}

function storeTasks(){
    backend.setItem('tasks', JSON.stringify(tasks));
}

function storeContacts(){
    backend.setItem('contacts', JSON.stringify(contacts));
}

function getNewContactID(){
    let value = 0;
    for (let i = 0; i < contacts.length; i++) {
        const contact = contacts[i];
        if(contact.id > value) value = contact.id +1;
    }
    return value;
}



init();