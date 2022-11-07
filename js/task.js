"use strict";

const assigneeMenu = document.getElementById('assignee');
const assigneeBackground = document.getElementById('assignee-background');
const assigneeContainer = document.getElementById('assignee-container');


// assigneeBackground.addEventListener('click', hideDropdown);
assigneeMenu.addEventListener('click', toggleDropdown);


/**
 * Toggles the custom dropdown menu
 */
function toggleDropdown() {
    assigneeBackground.classList.toggle('d-none');
    assigneeContainer.classList.toggle('d-none');
}
