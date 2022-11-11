

async function init(){
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
}

async function logIn() {
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('inputPassword').value;
    // users = await loadUsers();
    let contact = contacts.find( c => c.email == email && c.password == password);
    if (contact) {
        window.location.href = `summary.html?userID=${contact.id}`;
    }
    else{
        console.log('user not in contacts')
    }
    
}

function animateStart(){
    const LOGO = document.getElementById('startView'); 
    const HEAD = document.getElementById('headMenu'); 
    const MAIN = document.getElementById('mainView');
    document.getElementById('startView').classList.add('startView');
    document.body.style.backgroundColor = "white";
    setTimeout(function() {
        LOGO.classList.remove('d-none');
        HEAD.classList.remove('d-none');
        MAIN.classList.remove('d-none');
    },850);
    
}

init();
