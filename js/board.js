"use strict";

const toDoElement = document.getElementById('toDo');
const inProgressElement = document.getElementById('inProgress');
const awaitingFeedbackElement = document.getElementById('awaitingFeedback');
const doneElement = document.getElementById('done');

let tasks = [];
let contacts = [];

async function init() {
    tasks = await loadTasks();
    contacts = await loadContacts();
    renderTasks();
}
async function loadTasks() {
    return await fetch('/tasks.json').then(resp => resp.json());
}

async function loadContacts() {
    return await fetch('/contacts.json').then(resp => resp.json());
}

function renderTasks() {
    render('To do', toDoElement);
    render('In progress', inProgressElement);
    render('Await feedback', awaitingFeedbackElement);
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
        const element = tasks[i];
        if (element.status == status && element.maintask) {
            content.innerHTML += categoryCardTemplate(element);
        };
    }
}

function categoryCardTemplate(element) {
    return `
    <div class="categoryCard" onclick="showDetail(${element.id})">
        <div class="categoryName" style="background-color: ${getColorcodeForCategory(element.category)}">${element.category}</div>
        <span class="cardHeadline">${element.title}</span>
        <p class="cardContent">${element.description}</p>
        <div id="progressDiv">${progressTemplate(element)}</div>
        <div id="cardMembers">${memberTemplate(element)}</div>
    </div>
    `;
}

function progressTemplate(element) {
    const subtasks = element.subtasks;
    let finishedSubtasks = 0;
    for (let i = 0; i < subtasks.length; i++) {
        const element = subtasks[i];
        for (let j = 0; j < tasks.length; j++) {
            const task = tasks[j];
            if (task.status == 'Done' && task.id == element) finishedSubtasks++;
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
    let initials = contacts[member].firstname.substring(0, 1) + contacts[member].lastname.substring(0, 1);
    let translate = indexLoop * -20;
    let zIndex = 100 + 10 * indexLoop;
    return `
        <p class="cardMember" style="z-index: ${zIndex};
        transform: translateX(${translate}px); background: hsl(${contacts[member].color}, 100%, 40%)">${initials}</p>`;
}

function renderPopup(taskID) {
    const content = document.getElementById('popupCategory');
    const task = tasks.find(({ id }) => id === taskID)
    content.innerHTML = `
        <div class="popupCategoryNameDiv">
            <p class="popupCategoryName" style="background-color: ${getColorcodeForCategory(task.category)}">${task.category}</p>
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
        <div id="popupCardMembers" class="popupTopics">
            <span class="popupSpan">Assigned To:</span>
                ${memberTemplatePopup(task)}
        </div>
    `
}

function memberTemplatePopup(task) {
    const members = task.assigned;
    let html = '';

    for (let i = 0; i < members.length; i++) {
        const member = members[i];
        let initials = contacts[member].firstname.substring(0, 1) + contacts[member].lastname.substring(0, 1);
        html += `
            <div class="popupCardMemberDiv">
                <p class="popupCardMember" style="background: hsl(${contacts[member].color}, 100%, 40%)">${initials}</p>
                <span>${contacts[member].firstname} ${contacts[member].lastname}</span>
            </div>`;
    }



    return html;
}

function getColorcodeForCategory(category) {
    switch (category) {
        case 'Design':
            return '#FF7A00';
            break;

        case 'Sales':
            return '#FC71FF';
            break;

        case 'Backoffice':
            return '#1FD7C1';
            break;

        case 'Media':
            return '#FFC701';
            break;

        case 'Marketing':
            return '#0038FF';
            break;
        default:
            break;
    }


}

init();