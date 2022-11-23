"use strict";

const toDoElement = document.getElementById('toDo');
const inProgressElement = document.getElementById('inProgress');
const awaitingFeedbackElement = document.getElementById('awaitingFeedback');
const doneElement = document.getElementById('done');
const priorities = ["Urgent", "Medium", "Low"];
let statusCall = '';
let draggedElement;
let searchString = '';

async function initBoard() {
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
    renderTasks();
    addAllEventListenersTask();
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
        if (task.status == status && task.maintask && (task.title.toLowerCase().includes(searchString) || task.description.toLowerCase().includes(searchString))) {
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
            <span class="popupSpan">Assigned To: </span>
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
        <span class="popupSpan">Due date: </span>
        <p>${task.dueDate}</p>
    </div>
    <div id="popupPriority" class="popupTopics displayFlexGap8">
        <span class="popupSpan">Priority: </span>
        <p class="popupPriorityIcon">${task.priority} <img src="./assets/icons/${task.priority.toLowerCase()}.svg" alt=""></p>
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
    return (category.charCodeAt(2) * category.charCodeAt(0) * category.charCodeAt(0)) / 3

}

function createTask(event, isMain) {
    event.preventDefault();
    const title = document.getElementById('title');
    const dueDate = document.getElementById('date');
    const category = document.getElementById('category');
    const description = document.getElementById('description').value;
    const assigned = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(assignee => assigned.push(assignee.value));

    if (title.checkValidity() && dueDate.checkValidity() && category.checkValidity() && assigned.length > 0) {
        let newTask = {
            "assigned": assigned,
            "category": category.value,
            "description": description,
            "dueDate": dueDate.value,
            "id": Date.now().toString(36),
            "maintask": isMain,
            "priority": getPriority() ? getPriority() : 'low',
            "status": statusCall,
            "subtasks": [],
            "title": title.value
        };
        tasks.push(newTask);
        closeSlide(); //tbd show message Button
        storeTasks();
        renderTasks();
    }
    else {
        reportEmptyInputs(title, assigned, dueDate, category);
        console.log('check not ok');
    }


    
}

/**
 * Report validity if inputs are empty.
 * @param {String} title Task title
 * @param {Array} assigned Array with contact id'S
 * @param {String} date Task due date
 * @param {String} category Task category
 */
function reportEmptyInputs(title, assigned, date, category) {
    category.reportValidity();
    date.reportValidity();
    if (assigned.length === 0) {
        document.getElementById('assignee-check').reportValidity();
    }
    title.reportValidity();
}

function getPriority() {
    let priority;
    for (let i = 0; i < priorities.length; i++) {
        const element = document.getElementById(priorities[i].toLowerCase());
        if (element.checked) priority = priorities[i];
    }
    return priority;

}

function showSlide(status) {
    statusCall = status;
    renderTaskNew();
    renderAssignees();
    addAllEventListeners();
    document.getElementById('slideIn').classList.remove('d-none');
    document.getElementById('slideInCategory').classList.add('slideInMotion');
}

function closeSlide() {
    document.getElementById('slideInCategory').classList.remove('slideInMotion');
    document.getElementById('slideInCategory').classList.add('slideOutMotion');
    setTimeout(function () {
        document.getElementById('slideIn').classList.add('d-none');
        document.getElementById('slideInCategory').classList.remove('slideOutMotion');
    }, 230);
    document.getElementById('newTask').innerHTML = '';


}

function showEditTask(taskID) {
    renderTaskEdit(taskID);
    document.getElementById('editPopUp').classList.remove('d-none');
    document.getElementById('boardPopup').classList.add('d-none');
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
    document.getElementById('title').value = task.title;
    document.getElementById('category').value = task.category;
    document.getElementById('description').value = task.description;
    document.getElementById('date').value = task.dueDate;
    for (let i = 0; i < priorities.length; i++) {
        const priority = priorities[i].toLowerCase();
        const element = document.getElementById(priority);
        element.id == task.priority.toLowerCase() ? element.checked = true : false;
    }
    for (let i = 0; i < task.assigned.length; i++) {
        const assign = task.assigned[i];
        document.getElementById(assign).checked = true;
    }

}

function closeEdit() {
    document.getElementById('editPopUp').classList.add('d-none');
    document.getElementById('taskEdit').innerHTML = '';

}

function saveChanges(taskID) {
    const task = tasks.find(({ id }) => id == taskID);
    const indexOfTask = tasks.indexOf(task);
    const assigned = [];
    document.querySelectorAll('input[type="checkbox"]:checked').forEach(assignee => assigned.push(assignee.value));
    task.assigned = assigned;
    task.title = document.getElementById('title').value;
    task.category = document.getElementById('category').value;
    task.description = document.getElementById('description').value;
    task.dueDate = document.getElementById('date').value;
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

function renderTaskNew() {
    let element = document.getElementById('newTask');
    element.innerHTML = `
    <form action="">
        <input type="text" name="title" id="title" placeholder="Enter a title">
        ${templateAssignee()}
        ${templateDueDate()}
        ${templateCategory()}
        ${templatePriority()}
        ${templateDescription()}
    `;
    element.innerHTML += `</form>`;

}

function renderTaskEdit(taskID) {
    let element = document.getElementById('taskEdit');
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
    `;
    element.innerHTML += `
        <div class="editMenu">
            <div id="deleteButton">
                <Button class="btn-primary" onclick="deleteTask('${taskID}')">Delete <img style="rotate: 45deg" src="./assets/icons/add_white.svg" alt=""></Button>
            </div>
            <div id="saveButton">
                <Button class="btn-primary" onclick="saveChanges('${taskID}')">Ok <img src="./assets/icons/checkButton.svg" alt=""></Button>
            </div>
        </div>
    </form>
    `;
    const task = tasks.find(({ id }) => id == taskID);
    renderAssignees();
    renderPopupEdit(task);
    addAllEventListeners();
}

function templateAssignee() {
    return `
    <div name="assignee" id="assignee">
        <input type="checkbox" id="assignee-check" required>
        <span>Select contacts to assign</span>
        <div>
            <div class="assignee-background d-none" id="assignee-background">
            </div>
            <div class="assignee-container d-none" id="assignee-container">
            </div>
        </div>
    </div>
    `;
}

function templateDueDate() {
    return `
    <div>
        <label for="date">Due date</label>
        <input type="date" name="date" id="date">
    </div>
    `;
}

function templateCategory() {
    return `
    <div>
        <label for="category">Category</label>
        <select name="category" id="category">
            <option value="" disabled selected hidden>Select task category</option>
            <option value="Accounting and Finance">Accounting and Finance</option>
            <option value="Research and Development">Research and Development</option>
            <option value="Management">Management</option>
            <option value="IT and EDP">IT and EDP</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Marketing">Marketing</option>
            <option value="Human Resource">Human Resource</option>
            <option value="Production">Production</option>
            <option value="Sales">Sales</option>
            <option value="Legal">Legal</option>
            <option value="Backoffice">Backoffice</option>
        </select>
    </div>
    `;
}

function templatePriority() {
    return `
    <div id="priority">
        <input type="radio" name="priority" id="urgent">
        <label for="urgent">
            <span class="checkmark">Urgent</span>
            <i class="icon icon-urgent"></i>
        </label>
        <input type="radio" name="priority" id="medium">
        <label for="medium">
            <span class="checkmark">Medium</span>
            <i class="icon icon-medium"></i>
        </label>
        <input type="radio" name="priority" id="low">
        <label for="low">
            <span class="checkmark">Low</span>
            <i class="icon icon-low"></i>
        </label>
    </div>
    `;
}

function templateDescription() {
    return `
    <div>
        <label for="description">Description</label>
        <textarea name="description" id="description" cols="1" rows="3"
            placeholder="Enter a description" style="resize: none;"></textarea>
    </div>
    `;
}

function filterTasks() {
    searchString = document.getElementById('searchInput').value.toLowerCase();
    renderTasks();
}