"use strict";

const toDoElement = document.getElementById('toDo');
const inProgressElement = document.getElementById('inProgress');
const awaitingFeedbackElement = document.getElementById('awaitingFeedback');
const doneElement = document.getElementById('done');
const priorities = ["Urgent", "Medium", "Low"];
let statusCall = '';

async function initBoard() {
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
    renderTasks();
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
        const task = tasks[i];
        if (task.status == status && task.maintask) {
            content.innerHTML += categoryCardTemplate(task);
        };
    }
}

function categoryCardTemplate(task) {
    return `
    <div class="categoryCard" onclick="showDetail('${task.id}')">
        <div class="categoryName" style="background-color: ${getColorcodeForCategory(task.category)}">${task.category}</div>
        <span class="cardHeadline">${task.title}</span>
        <p class="cardContent">${task.description}</p>
        <div id="progressDiv">${progressTemplate(task)}</div>
        <div id="cardMembers">${memberTemplate(task)}</div>
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
            <img src="./assets/icons/edit_button.svg" onclick="editTask('${taskID}')" style="cursor: pointer;">
        </div>
    `
}

function taskTemplate(task) {
    return `
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

function createTask() {
    let title = document.getElementById('title').value;
    let dueDate = document.getElementById('date').value;
    let category = document.getElementById('category').value;
    let description = document.getElementById('description').value;

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

function getPriority() {
    let priority;
    for (let i = 0; i < priorities.length; i++) {
        const element = document.getElementById(priorities[i].toLowerCase());
        if (element.checked) priority = element.value;
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

function editTask(taskID){
    const task = tasks.find(({ id }) => id == taskID);
    document.getElementById('editPopUp').classList.remove('d-none');
    document.getElementById('boardPopup').classList.add('d-none');
    renderPopupEdit(task)

}

function deleteTask(taskID){
    const task = tasks.find(({ id }) => id == taskID);

}

function renderPopupEdit(task){
    const content = document.getElementById('popupCategory');
    
}

function closeEdit(){
    document.getElementById('editPopUp').classList.add('d-none');
}




