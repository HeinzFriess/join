const urlParameter = new URLSearchParams(window.location.search);
let newPassword = urlParameter.get('newPassword');
let mailIsSend = urlParameter.get('mailSend');

async function init() {
    // await downloadFromServer();
    // await loadTasks();
    // await loadContacts();
    //await loadDBEntries();
    showMailIsSendInfo();
    showPasswordResetInfo();
}

async function logIn() {
    let email = document.getElementById('inputEmail').value;
    let password = document.getElementById('inputPassword').value;
    
    const bData = {
        "username": email,
        "password": password
    }

    const response = await fetch(url + 'login/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        body: JSON.stringify(bData)
    })
        .then(response => {
            if(response.ok) return response.json()
            throw new Error('Wrong Credentials')
        })
        .then(response => {
            //console.log(response)
            token = response.token;
            userId = response.user_id;
            localStorage.setItem('userJoin', userId);
            localStorage.setItem('token', token);
            window.location.href = `summary.html`;
        })
        .catch((error) => {
            console.log(error)
            wrongCredentials()
        });

    //const data = await response.json();

}

function animateStart() {
    const logo = document.getElementById('startView');
    const head = document.getElementById('headMenu');
    const main = document.getElementById('mainView');
    document.getElementById('startView').classList.add('startView');
    document.body.style.backgroundColor = "white";
    setTimeout(function () {
        logo.classList.remove('d-none');
        head.classList.remove('d-none');
        main.classList.remove('d-none');
    }, 850);

}

function wrongCredentials() {
    document.getElementById('card').innerHTML = `
    <div id="cardHead" style="text-align: center;">
        <h2 style="color: var(--primary)">wrong Credentials</h2>
        
        <h4 style="color: var(--primary-light);">please sign Up first</h4>
    </div>
    
    
    `;
    setTimeout(function () {
        window.location.href = 'index.html';
    }, 2500);
}

function showMailIsSendInfo() {
    if (mailIsSend) {
        document.getElementById('passwordResetText').innerHTML = 'An E-mail has been sent to you';
        document.getElementById('passwordResetInfo').classList.remove('d-none');
    }
    setTimeout(function () {
        document.getElementById('passwordResetInfo').classList.add('d-none');
    }, 2500);
}

function showPasswordResetInfo() {

    if (newPassword) {
        document.getElementById('passwordResetText').innerHTML = 'You reset your Password';
        document.getElementById('passwordResetInfo').classList.remove('d-none');
    }
    setTimeout(function () {
        document.getElementById('passwordResetInfo').classList.add('d-none');
    }, 2500);
}

async function guestLogin() {
    // localStorage.setItem('userJoin', 'guest');
    //location.href = 'summary.html';

    const bData = {
        "username": "heinz",
        "password": "sseirF#11dj"

    }

    const response = await fetch(url = 'http://127.0.0.1:8000/login/', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*"
        },
        body: JSON.stringify(bData)

    });

    const data = await response.json();

    loadTasks();

    console.log(data);
}

init();
