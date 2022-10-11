const listMessages = document.getElementById('listMessages');
const listUsers = document.getElementById('listUsers');
const textUid = document.getElementById('textUid');
const textMessage = document.getElementById('textMessage');
const buttonLogout = document.getElementById('buttonLogout');
const headerUserProfile = document.getElementById('headerUserProfile');

let user = null;

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
    const socket = io({
        'extraHeaders': { 'x-token': localStorage.getItem('token')}
    });

    socket.on('connect', () => {
        console.log('Sockets online');
    });

    socket.on('disconnect', () => {
        console.log('Sockets offline');
    });

    socket.on('recived-messages', () => {
    });

    socket.on('active-users', () => {
    });

    socket.on('private-message-user', () => {
    });
}

buttonLogout.addEventListener('click', () => {
    if (localStorage.getItem('isGoogleLogin')) {
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
    } else {
        localStorage.clear();
        location.reload();
    }
});

const main = async () => {
    await validJWT();
    await connectSocket();
}

main();

