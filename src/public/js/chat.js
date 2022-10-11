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
    console.log(user)
    document.title = user.username;
}

const connectSocket = async () => {
    const socket = io({
        'extraHeaders': { 'x-token': localStorage.getItem('token')}
    });
}

const main = async () => {
    await validJWT();
    await connectSocket();
}

main();

