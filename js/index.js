async function loadUsers(){
    users = await JSON.parse(localStorage.getItem('users')) || [];
    return users;
}

let users = JSON.parse(localStorage.getItem('users'));
async function logIn() {
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('inputPassword').value;
    users = await loadUsers();
    let user = users.find( u => u.email == email && u.password == password);
    window.location.href = 'summary.html';
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