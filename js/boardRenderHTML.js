/**
 * returns the HTML for the tasks, filtered by the global "serachSTring"
 * @param {string} status 
 * @param {domElement} content 
 */
function render(status, content) {
    content.innerHTML = '';
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];        
        if (task.status == status && task.maintask && (task.title.toLowerCase().includes(searchString) || task.description.toLowerCase().includes(searchString))) {
            content.innerHTML += categoryCardTemplate(task);
        };
    }
}

/**
 * returns the HTML fragment for task in the mainview
 * @param {JSON} task 
 * @returns HTML string
 */
function categoryCardTemplate(task) {
    return `
    <div draggable="true" class="categoryCard" ondragstart="startDragging('${task.id}')" onclick="showDetail('${task.id}')">
        <div class="categoryName" style="background: hsl(${getColorcodeForCategory(getTaskCategory(task))}, 100%, 40%)">${getTaskCategory(task)}</div>
        <span class="cardHeadline">${task.title}</span>
        <p class="cardContent">${task.description}</p>
        <div id="progressDiv">${progressTemplate(task)}</div>
        <div class="cardFooter">
            <div id="cardMembers">${memberTemplate(task)}</div>
            <img src="./assets/icons/${getTaskPriority(task).toLocaleLowerCase()}.svg" class="cardMemberPriorityIcon">
        </div>
    </div>
    `;
}

/**
 * returns the HTML fragment for subtask progress in the mainview
 * @param {JSON} task 
 * @returns HTML string
 */
function progressTemplate(task) {
    const subtasks = task.description.split("");
    let finishedSubtasks = 0;
    for (let i = 0; i < subtasks.length; i++) {
        const subtask = subtasks[i];
        if (subtask.done) finishedSubtasks++;
    }
    if (subtasks.length > 0) {
        return `
                <progress id="file" value="${finishedSubtasks}" max="${subtasks.length}"></progress> ${finishedSubtasks}/${subtasks.length} Done`;
    }
    else return '';
}

/**
 * returns the HTML fragment for task in the editview
 * @param {JSON} task 
 * @returns HTML string
 */
function taskTemplate(task) {
    return `
    <div class="popupCategoryNameDiv">
        <p class="popupCategoryName" style="background: hsl(${getColorcodeForCategory(getTaskCategory(task))}, 100%, 40%)">${getTaskCategory(task)}</p>
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
        <p class="popupPriorityIcon">${getTaskPriority(task)} <img src="./assets/icons/${getTaskPriority(task).toLowerCase()}.svg" alt=""></p>
    </div>
    `;
}

/**
 * returns the HTML fragment for members in the task preview
 * @param {JSON} task 
 * @returns HTML string
 */
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

/**
 * returns an HTML fragment for each member into the member section of the task preview
 * @param {*} members 
 * @param {*} indexLoop 
 * @returns HTML string
 */
function memberHtmlTemplate(members, indexLoop) {

    const member = members[indexLoop];
    const contact = contacts.find(({ id }) => id === member);
    firstLetter = '';
    secondLetter = '';
    if (contact) {
        try {
            firstLetter = contact.firstname.substring(0, 1);
            secondLetter = contact.lastname.substring(0, 1);
        } catch (error) {

        }
        let initials = firstLetter + secondLetter;
        let translate = indexLoop * -20;
        let zIndex = 100 + 10 * indexLoop;
        return `
        <p class="cardMember" style="z-index: ${zIndex};
        transform: translateX(${translate}px); background: hsl(${contact.color}, 100%, 40%)">${initials}</p>`;
    }
    else return '';
}

/**
 * HTML template for rendering the assignee.
 * @param {Object} contact Conact that should be rendered
 * @returns HTML assignee template
 */
function assigneeTemp(contact) {
    let lastName = '';
    if (contact.lastname) lastName = contact.lastname;
    return `
        <label for="${contact.id}">${contact.firstname} ${lastName}
            <input class="assigneeClass" type="checkbox" name="${contact.id}" id="${contact.id}" value="${contact.id}">
            <span class="checkmark"></span>
        </label>`;
}

/**
 * returns the editMenu HTML fragment
 * @param {string} taskID 
 * @returns HTML string
 */
function templateEditMenu(taskID) {
    return `
        <div class="editMenu">
            <div id="deleteButton">
                <Button type="button" class="btn-primary" onclick="deleteTask('${taskID}')">Delete <img style="rotate: 45deg" src="./assets/icons/add_white.svg" alt=""></Button>
            </div>
            <div id="saveButton">
                <Button type="button" class="btn-primary" onclick="saveChanges('${taskID}')">Ok <img src="./assets/icons/checkButton.svg" alt=""></Button>
            </div>
        </div>
    </form>
    `
}

/**
 * returns the Assigne HTML fragment
 * @returns HMTL string
 */
function templateAssignee() {
    return `
    <div name="assignee" id="assignee">
        <input type="checkbox" id="assignee-check">
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

/**
 * returns the date HTML fragment
 * @returns HMTL string
 */
function templateDueDate() {
    return `
    <div>
        <label for="date">Due date</label>
        <input required type="date" name="date" id="date">
    </div>
    `;
}

/**
 * returns the category HTML fragment
 * @returns HTML string
 */
function templateCategory() {
    return `
    <div>
        <label for="category">Category</label>
        <select required name="category" id="category">
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

/**
 * returns the priority HTML fragment
 * @returns HTML string
 */
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

/**
 * returns the description HTML fragment
 * @returns HTML string
 */
function templateDescription() {
    return `
    <div>
        <label for="description">Description</label>
        <textarea name="description" id="description" cols="1" rows="3"
            placeholder="Enter a description" style="resize: none;"></textarea>
    </div>
    `;
}

/**
 * returns the subtask HTML fragment
 * @returns HTML string
 */
function templateSubtasks(edit, taskID) {
    return `
    <div class="popupTopics">
        <label for="subtasks">Subtasks</label>
        <div class="headlineSubtask">
            <input type="text" name="subtask" id="subtasks" placeholder="Add new subtask" onkeyup="showIcon()">
            <div id="add">
                <img src="./assets/icons/add.svg" style="cursor: pointer;">
            </div>
            <div id="edit" class="d-none">
                <div class="editDiv">
                    <img src="./assets/icons/close_blue.svg" onclick="clearSubtask()" style="cursor: pointer;">
                    <span style="color:var(--primary); font-size: 24PX;">|</span>
                    <img src="./assets/icons/checkButton_blue.svg" onclick="addSubtask(${edit}, '${taskID}')" style="cursor: pointer;">
                </div>
            </div>
        </div>
        <div id="contentSubtasks">

        </div>
    </div>
    `;
}


