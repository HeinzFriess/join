"use strict";

const toDoElement = document.getElementById('toDo');
const inProgressElement = document.getElementById('inProgress');
const awaitingFeedbackElement = document.getElementById('awaitingFeedback');
const doneElement = document.getElementById('done');
const priorities = ["Urgent", "Medium", "Low"];
let statusCall = '';
let draggedElement;

async function initBoard() {
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
    renderAssignees();
    renderTasks();
    addAllEventListeners();
}

/**
 * Adds event listeners to all the listed elments.
 */
function addAllEventListeners() {
    const assigneeMenu = document.getElementById('assignee');

    assigneeMenu.addEventListener('click', toggleDropdown);
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


function renderTasks() {
    render('To do', toDoElement);
    render('In progress', inProgressElement);
    render('Awaiting feedback', awaitingFeedbackElement);
    render('Done', doneElement);
}

function showDetail(taskID) {
    let backGround = document.getElementById('boardPopup');
    backGround.classList.remove('d-none');
    renderPopup(taskID);
    let popUp = document.getElementById('popupCategory');
    popUp.classList.add('showPopup');

}

function hideDetail() {
    let popUp = document.getElementById('popupCategory');
    let backGround = document.getElementById('boardPopup');
    popUp.classList.add('hidePopup');
    setTimeout(function () {
        backGround.classList.add('d-none');
        popUp.classList.remove('hidePopup');
        popUp.classList.remove('showPopup');
    }, 230);
}

function render(status, content) {
    content.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task.status == status && task.maintask) {
            content.innerHTML += categoryCardTemplate(task);
        };
    }
}

function categoryCardTemplate(task) {
    return `
    <div draggable="true" class="categoryCard" ondragstart="startDragging('${task.id}')" onclick="showDetail('${task.id}')">
        <div class="categoryName" style="background: hsl(${getColorcodeForCategory(task.category)}, 100%, 40%)">${task.category}</div>
        <span class="cardHeadline">${task.title}</span>
        <p class="cardContent">${task.description}</p>
        <div id="progressDiv">${progressTemplate(task)}</div>
        <div class="cardFooter">
            <div id="cardMembers">${memberTemplate(task)}</div>
            <img src="./assets/icons/${task.priority.toLowerCase()}.svg" class="cardMemberPriorityIcon">
        </div>
    </div>
    `;
}

function progressTemplate(task) {
    const subtasks = task.subtasks;
    let finishedSubtasks = 0;
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        for (let j = 0; j < tasks.length; j++) {
            const task = tasks[j];
            if (task.status == 'Done' && task.id == subtask) finishedSubtasks++;
        }
    }
    if (subtasks.length > 0) {
        return `
                <progress id="file" value="${finishedSubtasks}" max="${subtasks.length}"></progress> ${finishedSubtasks}/${subtasks.length} Done`;
    }
    else return '';
}

function memberTemplate(task) {
    const members = task.assigned;
    let html = '';
    if (members.length < 4) {
        for (let i = 0; i < members.length; i++) html += memberHtmlTemplate(members, i);
    }
    if (members.length > 3) {
        for (let i = 0; i < 2; i++) html += memberHtmlTemplate(members, i);
        html += `
        <p class="cardMember" style="z-index: 120; transform: translateX(-40px); background: hsl(218, 100%, 64%)">+${members.length - 2}</p>`;
    }
    return html;
}

function memberHtmlTemplate(members, indexLoop) {

    const member = members[indexLoop];
    const contact = contacts.find(({ id }) => id === member);
    if (contact) {
        let initials = contact.firstname.substring(0, 1) + contact.lastname.substring(0, 1);
        let translate = indexLoop * -20;
        let zIndex = 100 + 10 * indexLoop;
        return `
        <p class="cardMember" style="z-index: ${zIndex};
        transform: translateX(${translate}px); background: hsl(${contact.color}, 100%, 40%)">${initials}</p>`;
    }
    else return '';
}

function renderPopup(taskID) {
    const content = document.getElementById('popupCategory');
    const task = tasks.find(({ id }) => id == taskID);
    content.innerHTML = `
        ${taskTemplate(task)}
        <div id="popupCardMembers" class="popupTopics">
            <span class="popupSpan">Assigned To:</span>
                ${memberTemplatePopup(task)}
        </div>
        <div class="close">
            <img src="./assets/icons/edit_button.svg" onclick="showEditTask('${taskID}')" style="cursor: pointer;">
        </div>
    `
}

function taskTemplate(task) {
    return `
    <div class="popupCategoryNameDiv">
        <p class="popupCategoryName" style="background: hsl(${getColorcodeForCategory(task.category)}, 100%, 40%)">${task.category}</p>
        <img src="./assets/icons/add.svg" style="transform: rotate(45deg);" onclick="hideDetail()">
    </div>
        <span class="popupCardHeadline">${task.title}</span>
        <p class="popupCardContent">${task.description}</p>
    <div id="popupDuedate" class="popupTopics displayFlexGap8">
        <span class="popupSpan">Due date:</span>
        <p>${task.dueDate}</p>
    </div>
    <div id="popupPriority" class="popupTopics displayFlexGap8">
        <span class="popupSpan">Priority:</span>
        <p class="popupPriorityIcon">${task.priority}<img src="./assets/icons/${task.priority.toLowerCase()}.svg" alt=""></p>
    </div>
    `;
}

function memberTemplatePopup(task) {
    const members = task.assigned;
    let html = '';
    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        const contact = contacts.find(({ id }) => id === member)
        if (contact) {
            let initials = contact.firstname.substring(0, 1) + contact.lastname.substring(0, 1);
            html += `
            <div class="popupCardMemberDiv">
                <p class="popupCardMember" style="background: hsl(${contact.color}, 100%, 40%)">${initials}</p>
                <span>${contact.firstname} ${contact.lastname}</span>
            </div>`;
        }
        else return '';
    }
    return html;
}

function getColorcodeForCategory(category) {
    return (category.charCodeAt(2) * category.charCodeAt(0)  * category.charCodeAt(0) ) / 3

}

function createTask() {
    let title = document.getElementById('title').value;
    let dueDate = document.getElementById('date').value;
    let category = document.getElementById('category').value;
    let description = document.getElementById('description').value;
    const assigned = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(assignee => assigned.push(assignee.value));

    let newTask = {
        "assigned": [],
        "category": category,
        "description": description,
        "dueDate": dueDate,
        "id": Date.now().toString(36),
        "maintask": true,
        "priority": getPriority(),
        "status": statusCall,
        "subtasks": [],
        "title": title
    };

    console.log(newTask);
    tasks.push(newTask);
    closeSlide(); //tbd show message Button
    storeTasks();
    renderTasks();
}

function getPriority(searchString) {
    let priority;
    let thesearchString = ''
    if (searchString) thesearchString = searchString;
    for (let i = 0; i < priorities.length; i++) {
        const element = document.getElementById(thesearchString + priorities[i].toLowerCase());
        if (element.checked) priority = priorities[i];
    }
    return priority;

}

function showSlide(status) {
    statusCall = status;
    document.getElementById('slideIn').classList.remove('d-none');
}

function closeSlide() {
    document.getElementById('slideIn').classList.add('d-none');
}

function showEditTask(taskID) {
    const task = tasks.find(({ id }) => id == taskID);
    document.getElementById('editPopUp').classList.remove('d-none');
    document.getElementById('boardPopup').classList.add('d-none');
    renderPopupEdit(task);
    document.getElementById('deleteButton').innerHTML = `
        <Button class="btn-primary" onclick="deleteTask('${taskID}')">Delete <img style="rotate: 45deg" src="./assets/icons/add_white.svg" alt="">
        </Button>
    `
    document.getElementById('saveButton').innerHTML = `
        <Button class="btn-primary" onclick="saveChanges('${taskID}')">Ok <img src="./assets/icons/checkButton.svg" alt="">
        </Button>
    `

}

function deleteTask(taskID) {
    const task = tasks.find(({ id }) => id == taskID);
    const indexOfTask = tasks.indexOf(task);
    tasks.splice(indexOfTask, 1);
    storeTasks();
    renderTasks();
    closeEdit();

}

function renderPopupEdit(task) {
    document.getElementById('edittitle').value = task.title;
    document.getElementById('editcategory').value = task.category;
    document.getElementById('editdescription').value = task.description;
    document.getElementById('editdate').value = task.dueDate;
    for (let i = 0; i < priorities.length; i++) {
        const priority = priorities[i].toLowerCase();
        const element = document.getElementById('edit' + priority);
        element.id == 'edit' + task.priority.toLowerCase() ? element.checked = true : false;
    }

}

function closeEdit() {
    document.getElementById('editPopUp').classList.add('d-none');
}

function saveChanges(taskID) {
    const task = tasks.find(({ id }) => id == taskID);
    const indexOfTask = tasks.indexOf(task);
    task.title = document.getElementById('edittitle').value;
    task.category = document.getElementById('editcategory').value;
    task.description = document.getElementById('editdescription').value;
    task.dueDate = document.getElementById('editdate').value;
    task.priority = getPriority('edit');
    tasks.splice(indexOfTask, 1, task);
    storeTasks();
    renderTasks();
    closeEdit();
}

function startDragging(taskID) {
    draggedElement = taskID;

}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(status) {
    const task = tasks.find(({ id }) => id == draggedElement);
    const indexOfTask = tasks.indexOf(task);
    task.status = status;
    tasks.splice(indexOfTask, 1, task);
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


