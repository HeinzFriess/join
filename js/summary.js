
const urlParameter = new URLSearchParams(window.location.search);
userID = urlParameter.get('userID');

async function init() {
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
    renderGreeting();
}

function renderGreeting() {
    let element = document.getElementById('headline');
    const contact = contacts.find(c => c.id == userID);
    if (userID > 0) {
        element.innerHTML = `
    <p>Good Morning, ${contact.firstname} ${contact.lastname}</p>`;
    }
    else element.innerHTML = `<p style="font-weight: bold;">Good morning</p>`;

}

init();
