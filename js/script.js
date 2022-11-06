'use strict';


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


init();