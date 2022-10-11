const listMessages = document.getElementById('listMessages');
const listUsers = document.getElementById('listUsers');
const textUid = document.getElementById('textUid');
const textMessage = document.getElementById('textMessage');
const buttonLogout = document.getElementById('buttonLogout');
const buttonGoogleLogout = document.getElementById('buttonGoogleLogout');
const headerUserProfile = document.getElementById('headerUserProfile');
const buttonSendMessage = document.getElementById('buttonSendMessage');

let user = null;

const socket = io({
    'extraHeaders': { 'x-token': localStorage.getItem('token')}
});

const isGoogleLogin = localStorage.getItem('isGoogleLogin') === 'true';
console.log(isGoogleLogin);

if (isGoogleLogin) {
    buttonLogout.style.display = 'none';
    buttonGoogleLogout.style.display = '';
} else {
    buttonLogout.style.display = '';
    buttonGoogleLogout.style.display = 'none';
}

const validJWT = async() => {
    const token = localStorage.getItem('token') || '';

    if (token.length <= 10) {
        window.location = 'index.html';
        throw new Error('There are no token in the server');
    }

    const resp = fetch('http://localhost:8080/api/auth/', {
        method: 'GET',
        headers: {'x-token': token}
    });

    const {user: userServer, token: tokenServer} = await (await resp).json();
    localStorage.setItem('token', tokenServer);
    user = userServer;
    console.log(user);
    headerUserProfile.innerText = user.username;
    imageProfile.src = user.image || './img/AccountIcon2.png';
    document.title = user.username;
}

const connectSocket = async () => {

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('received-messages', (messages) => {
        let messagesHTML = '';

        messages.forEach(message => {
            
            if (user._id !== message.uid) {
                messagesHTML += `
                    <div style="text-align: left;">
                        <p style="background-color: #99B2DD; border-radius: 5px; margin-right: 20px; margin-left: 5px;">
                            <span style="margin-left: 5px;" class="text-primary"><b>${message.name}:</b></span>
                            <span class="fs-6 text-muted">${message.message}</span>
                        </p>
                    </div>
                `;
            } else {
                messagesHTML += `
                    <div style="text-align: right;">
                        <p style="background-color: #bfbdbd; border-radius: 5px; margin-left: 20px; margin-right: 5px;">
                            <span style="color: black;"><b>${message.name}:</b></span>
                            <span style="color: black; margin-right: 5px;" class="fs-6">${message.message}</span>
                        </p>
                    </div>
                `;
            }
            
        });

        listMessages.innerHTML = messagesHTML;
    });

    socket.on('active-users', (users) => {
        let userHTML = '';

        users.forEach(user => {
            userHTML += `
                <li>
                    <p>
                        <h5 class="text-success">${user.username}</h5>
                        <span class="fs-6 text-muted">${user._id}</span>
                    </p>
                </li>
            `;
        });

        listUsers.innerHTML = userHTML;
    });

    socket.on('private-message-user', (payload) => {
        console.log('Private message: ', payload);
    });
}


buttonSendMessage.addEventListener('click', () => {
    const message = textMessage.value;
    const uid = textUid.value;

    socket.emit('send-message', {message, uid});

    textMessage.value = '';
    textUid.value = '';
});

buttonLogout.addEventListener('click', () => {
    localStorage.clear();
    location.reload();
    window.location = '';
});

buttonGoogleLogout.addEventListener('click', () => {
    google.accounts.id.disableAutoSelect();
    google.accounts.id.revoke(localStorage.getItem('email'), done => {
        if (done.error) {
            console.error(done.error);
            return;
        }

        localStorage.clear();
        // reload page
        location.reload();
    });
});

const main = async () => {
    await validJWT();
    await connectSocket();
}

main();

