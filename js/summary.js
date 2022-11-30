userID = localStorage.getItem('userJoin');
const heuteInSec = Date.now();
const secTillUrgent = 604800000; // 7Days

async function init() {
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
    renderHeadline(); 
    renderUrgent();
    renderStatistics();
}

function renderHeadline() {
    let element = document.getElementById('headline');
    const contact = contacts.find(c => c.id == userID);
    let firstName = '';
    let lastName = '';
        if (contact) {
        if(contact.firstname) firstName = contact.firstname;
        if(contact.lastname) lastName = contact.lastname;
        element.innerHTML = `
    <p>Good Morning, ${firstName} ${lastName}</p>`;
    }
    else element.innerHTML = `<p style="font-weight: bold;">Good morning</p>`;

}

function renderUrgent() {
    let content1 = document.getElementById('tasksUrgent');
    let content2 = document.getElementById('deadlineDate');
    const taskUrgentAmount = calcTasksUrgent().length;
    let deadline = '';
    if (taskUrgentAmount < 1) deadline = 'No';
    else deadline = getMostUrgendTask().dueDate;

    content1.innerHTML = `${taskUrgentAmount}`;
    content2.innerHTML = `${convertDateString(deadline)}`;
}

function calcTasksUrgent() {
    let tasksExcludeDone = tasks.filter(t => t.status != 'Done');
    let urgentTasks = [];
    tasksExcludeDone.forEach(task => {
        let timespan = (getSecFromDate(task.dueDate) - heuteInSec);
        if ( timespan < secTillUrgent) urgentTasks.push(task.id);
    });
    return urgentTasks;
}

function getMostUrgendTask(){
    let time = secTillUrgent;
    calcTasksUrgent().forEach(taskID => {
        task = tasks.find(t => t.id == taskID);
        timeTemp = (getSecFromDate(task.dueDate) - heuteInSec);
        if (timeTemp < time) {
            time = timeTemp;
            getMostUrgendTask = task;
        }
    })
    return task;
}

function getSecFromDate(dateString) { //dateString DD.MM.YYY
    if(dateString){
    let myDate = dateString.split("-");
    let timeStamp = new Date(myDate[0], myDate[1]-1, myDate[2]).getTime();
    return timeStamp;
    }
    else return 'No';
}

function countTasks(status) {
    let value = 0;
    tasks.forEach(element => {
        if (element.status == status) value++;
    });
    return value;
}

function renderStatistics(){
    document.getElementById('tasksTodo').innerHTML = countTasks('To do');
    document.getElementById('tasksBoard').innerHTML = tasks.length;
    document.getElementById('tasksProgress').innerHTML = countTasks('In progress');
    document.getElementById('tasksAwaiting').innerHTML = countTasks('Awaiting feedback');
    document.getElementById('tasksdone').innerHTML = countTasks('Done');
}

init();
