
const urlParameter = new URLSearchParams(window.location.search);
userID = urlParameter.get('userID');

async function init(){
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
}

init();
