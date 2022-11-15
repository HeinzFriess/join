"use strict";

const assigneeMenu = document.getElementById('assignee');
const assigneeBackground = document.getElementById('assignee-background');
const assigneeContainer = document.getElementById('assignee-container');
const addTaskBtn = document.getElementById('add-task');


assigneeMenu.addEventListener('click', toggleDropdown);
addTaskBtn.addEventListener('click', addTask);


/**
 * Toggles the custom dropdown menu
 */
function toggleDropdown() {
    assigneeBackground.classList.toggle('d-none');
    assigneeContainer.classList.toggle('d-none');
}


function addTask() {
    tasks.push({
        "id" : 1,
        "maintask" : true,
        "status" : "To do",
        "category" : "Design",
        "title" : "Webdesite redesign",
        "description" : "Modify the content of the main website...",
        "priority" : "Low",
        "dueDate" : "01.01.2023",
        "subtasks" : [],
        "assigned" : [1,2,3]
    });

    storeTasks();
}


loadTasks()

