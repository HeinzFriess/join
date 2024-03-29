/**
 * calls the detail Popup for the task  with the taskID delivered
 * @param {string} taskID 
 */
function showDetail(taskID) {
    let backGround = document.getElementById('boardPopup');
    backGround.classList.remove('d-none');
    renderPopup(taskID);
    let popUp = document.getElementById('popupCategory');
    popUp.classList.add('showPopup');

}

/**
 * hides the detail Popup
 */
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

/**
 * renders the content for the task edit popup
 * @param {string} taskID 
 */
function renderPopup(taskID) {
    const content = document.getElementById('popupCategory');
    const task = tasks.find(({ id }) => id == taskID);
    content.innerHTML = `
        ${taskTemplate(task)}
        <div id="popupCardMembers" class="popupTopics">
            <span class="popupSpan">Assigned To: </span>
                ${memberTemplatePopup(task)}
        </div>
        <div class="popupTopics">
                ${subtasksTemplatePopup(task)}
        </div>
        <div class="close">
            <img src="./assets/icons/edit_button.svg" onclick="showEditTask('${taskID}')" style="cursor: pointer;">
        </div>
    `
}

/**
 * returns the HTML fragment for members in the detailview of the task
 * @param {JSON} task 
 * @returns HTML string
 */
function memberTemplatePopup(task) {
    let html = '';
    let assigned = task.assigned.split("|");
    for (let i = 0; i < assigned.length; i++) {
        const contact = contacts.find(({ id }) => id == assigned[i])
        if (contact) {
            let lastName = '';
            let firstLetter = '';
            let secondLetter = '';
            if (contact.last_name) lastName = contact.last_name;
            try {
                firstLetter = contact.first_name.substring(0, 1);
                secondLetter = contact.last_name.substring(0, 1);
            } catch (error) {

            }
            let initials = firstLetter + secondLetter;
            html += `<div class="popupCardMemberDiv">
                        <p class="popupCardMember" style="background: hsl(${contact.color}, 100%, 40%)">${initials}</p>
                        <span>${contact.first_name} ${lastName}</span>
                     </div>`;
        }
        else return '';
    }
    return html;
}

/**
 * returns the HTML fragment for subtasks in the detailview of the task
 * @param {JSON} task 
 * @returns HTML string
 */
function subtasksTemplatePopup(task) {
    let html = '<span class="popupSpan">Subtasks:</span>';
    if (task.subtasks.length > 0) {
        for (let i = 0; i < task.subtasks.length; i++) {
            subtask = task.subtasks[i];
            html += `
            <div class="subtaskDiv">
            <input type="checkbox" id="check${i}" class="subtaskCheckbox" ${getSubtaskCheckedString(subtask)} disabled>
            <label for="check${i}" class="subtaskLabel">${subtask.text}</label>
            </div>
            `;
        }
        return html;
    }
    else return '';
    return '';
}

/**
 * shows the NewTask form
 * @param {string} status 
 */
function showSlide(status) {
    statusCall = status;
    renderTaskNew();
    renderAssignees();
    addAllEventListeners();
    document.getElementById('slideIn').classList.remove('d-none');
    document.getElementById('slideInCategory').classList.add('slideInMotion');
}

/**
 * closes the NewTask form
 */
function closeSlide() {
    document.getElementById('slideInCategory').classList.remove('slideInMotion');
    document.getElementById('slideInCategory').classList.add('slideOutMotion');
    setTimeout(function () {
        document.getElementById('slideIn').classList.add('d-none');
        document.getElementById('slideInCategory').classList.remove('slideOutMotion');
    }, 230);
    document.getElementById('newTask').innerHTML = '';
}

/**
 * shows the EditTask form
 * @param {string} taskID 
 */
function showEditTask(taskID) {
    renderTaskEdit(taskID);
    document.getElementById('editPopUp').classList.remove('d-none');
    document.getElementById('boardPopup').classList.add('d-none');
}

/**
 * renders the TaskEdit form and prefills the inputfields
 * @param {JSON} task 
 */
function renderPopupEdit(task) {
    prefillTaskValues(task);
    for (let i = 0; i < prioritiesdb.length; i++) {
        const priority = prioritiesdb[i].name.toLowerCase();
        document.getElementById(priority).id == getTaskPriority(task).toLowerCase() ? document.getElementById(priority).checked = true : false;
    }
    for (let i = 0; i < task.assigned.length; i++) {
        try {
            document.getElementById(task.assigned[i]).checked = true;
        }
        catch { };
    }
}

/**
 * prefills task vlaues in the edit form
 * @param {JSON} task 
 */
function prefillTaskValues(task) {
    document.getElementById('title').value = task.title;
    //const cat = getTaskCategory(task);
    document.getElementById(getTaskCategory(task)).setAttribute('selected', true);
    document.getElementById('description').value = task.description;
    document.getElementById('date').value = task.date;
}

/**
 * closes the EditTask form
 */
function closeEdit() {
    document.getElementById('editPopUp').classList.add('d-none');
    document.getElementById('taskEdit').innerHTML = '';

}
