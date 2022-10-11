const labelAlertError = document.getElementById('labelAlertError');
const labelAlertGoogleError = document.getElementById('labelAlertGoogleError');
const myForm = document.querySelector('form');


labelAlertError.style.display = 'none';
labelAlertGoogleError.style.display = 'none';

function handleCredentialResponse(response) {

    const body = {id_token: response.credential};

    fetch('http://localhost:8080/api/auth/google', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body)
    })
     .then(resp => resp.json())
     .then(resp => {
        localStorage.setItem('token', resp.token);
        localStorage.setItem('email', resp.user.email);
        labelAlertGoogleError.style.display = 'none';
        location.reload();
        window.location = 'chat.html';
        localStorage.setItem('isGoogleLogin', true);
        return resp;
     })
     .then(console.log)
     .catch(error => {
        console.warn(error);
        labelAlertGoogleError.style.display = error;
     });
 }

myForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = {}

    for (let elem of myForm.elements) {
        if (elem.name.length > 0) {
            formData[elem.name] = elem.value;
        }
    }

    fetch('http://localhost:8080/api/auth/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
    })
    .then(resp => resp.json())
    .then(resp => {

        if (resp.errors) {
            labelAlertError.style.display = '';
            labelAlertError.innerText = resp.errors[0].msg;
            return console.error(resp.errors);
        }

        if (resp.msg && resp.token === undefined) {
            labelAlertError.style.display = '';
            labelAlertError.innerText = resp.msg;
            return console.error(resp.msg);
        }

        localStorage.setItem('token', resp.token);
        labelAlertError.style.display = 'none';
        window.location = 'chat.html';
        localStorage.setItem('isGoogleLogin', false);
    })
    .catch(console.warn);
});