

async function init(){
    await downloadFromServer();
    await loadTasks();
    await loadContacts();
}

async function logIn() {
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('inputPassword').value;
    let contact = contacts.find( c => c.email == email && c.password == password);
    if (contact) {
        window.location.href = `summary.html`;
        localStorage.setItem('userJoin',contact.id);
    }
    else{
        console.log('user not in contacts')
        wrongCredentials();
    }
    
}

function animateStart(){
    const logo = document.getElementById('startView'); 
    const head = document.getElementById('headMenu'); 
    const main = document.getElementById('mainView');
    document.getElementById('startView').classList.add('startView');
    document.body.style.backgroundColor = "white";
    setTimeout(function() {
        logo.classList.remove('d-none');
        head.classList.remove('d-none');
        main.classList.remove('d-none');
    },850);
    
}

function wrongCredentials(){
    document.getElementById('card').innerHTML = `
    <div id="cardHead" style="text-align: center">
        <h2 style="color: var(--primary)">wrong Credentials</h2>
        
        <h4 style="color: var(--primary-light)">please sign Up first</h4>
    </div>
    
    
    `;
    setTimeout(function() {
        window.location.href = 'index.html';
    },2500);
}

init();
