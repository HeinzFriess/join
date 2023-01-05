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
    for (let i = 0; i < task.assigned.length; i++) {
        const contact = contacts.find(({ id }) => id === task.assigned[i])
        if (contact) {
            let lastName = '';
            let firstLetter = '';
            let secondLetter = '';
            if(contact.lastname) lastName = contact.lastname;
            try {
                firstLetter = contact.firstname.substring(0, 1);
                secondLetter = contact.lastname.substring(0, 1);
            } catch (error) {
                
            }
            let initials = firstLetter + secondLetter;
            html += `<div class="popupCardMemberDiv">
                        <p class="popupCardMember" style="background: hsl(${contact.color}, 100%, 40%)">${initials}</p>
                        <span>${contact.firstname} ${lastName}</span>
                     </div>`;
        }
        else return '';
    }
    return html;
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
    for (let i = 0; i < priorities.length; i++) {
        const priority = priorities[i].toLowerCase();
        document.getElementById(priority).id == task.priority.toLowerCase() ? document.getElementById(priority).checked = true : false;
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
    document.getElementById('category').value = task.category;
    document.getElementById('description').value = task.description;
    document.getElementById('date').value = task.dueDate;
}

/**
 * closes the EditTask form
 */
function closeEdit() {
    document.getElementById('editPopUp').classList.add('d-none');
    document.getElementById('taskEdit').innerHTML = '';

}
