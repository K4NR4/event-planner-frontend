const loginDiv = document.querySelector('#login');
const logoutDiv = document.querySelector('#logOut');
const createAccountFormDiv = document.querySelector('#createAccountForm');
const userEmail = document.querySelector('#userEmail');
const userPassword = document.querySelector('#userPassword');
const newUserEmail = document.querySelector('#newUserEmail');
const newUserPassword = document.querySelector('#newUserPassword');
const newUsername = document.querySelector('#newUsername');
const loginButton = document.querySelector('#loginButton');
const createAccount = document.querySelector('#createAccount');
const logoutButton = document.querySelector('#logoutButton');
const publicArticle = document.querySelector('#publicArticle');
const privateArticle = document.querySelector('#privateArticle');

// (CHANGE TO YOUR RESPECTIVE PORT FOR THE API!!!!!!!!!!!)
const APIAddress = 'http://127.0.0.1:8176' // Connecting to the api server 
// (CHANGE TO YOUR RESPECTIVE PORT FOR THE API!!!!!!!!!!!)

loginButton.addEventListener('click', (e) => { // Login request is made
    if (userEmail.value && userPassword.value) {
    const payload = {
        useremail: userEmail.value,
        userpassword: userPassword.value
    }

    const fetchOptions = { // Sending a POST request as a JSON to the server with Login payload
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    fetch(APIAddress + '/api/accounts/login', fetchOptions) // Fetching Login response and adding authentication token to header
    .then(response => {
        const token = response.headers.get('x-authenticate-token');
        window.localStorage.setItem('x-authenticate-token', token);
        // console.log(token); 
        let MyStatus = response.status;
        if(MyStatus == 200){

            window.location.href = `dashboard.html`
        }
        
        return response.json()

    })

    .then(data => { 
        console.log(data);
        window.localStorage.setItem('accountInfo', JSON.stringify(data));
        console.log(window.localStorage.getItem('accountInfo'));
        
        loginDiv.classList.toggle('hidden');
        logoutDiv.classList.toggle('hidden');
        createAccountFormDiv.classList.toggle('hidden');

    })
    .catch(error => {
        alert('Invalid username or password.')
    })

    } else {
        alert('Please enter an email and password into the fields.')
    }
});

createAccount.addEventListener('click', (e) => { // Create account request is made
    if (newUserEmail.value && newUserPassword.value && newUsername.value) {
    const payload = {
        useremail: newUserEmail.value,
        userpassword: newUserPassword.value,
        username: newUsername.value
    }

    const fetchOptions = { // Sending a POST request as a JSON to the server with createAccount payload
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    fetch(APIAddress + '/api/accounts', fetchOptions) // Fetching response and adding authentication token to header
                                                      // Then automatically logging the user on after account creation.
    .then(response => {
        const token = response.headers.get('x-authenticate-token');
        if(token){        
            window.localStorage.setItem('x-authenticate-token', token);
            console.log(token);

            return response.json()
        } else {
            reject({statusCode: 409, errorMessage: 'Conflict: user email is already in use.'})
        };

        
    })

    .then(data => {
        console.log(data);
        window.localStorage.setItem('accountInfo', JSON.stringify(data));
        console.log(window.localStorage.getItem('accountInfo'));
        
        loginDiv.classList.toggle('hidden');
        logoutDiv.classList.toggle('hidden');
        createAccountFormDiv.classList.toggle('hidden');
        
    })

    .catch(error => {
        alert('user email is already in use.')
    })

    } else {
        alert('Please fill in account information.')
    }
});

logoutButton.addEventListener('click', (e) => { // Logout button
    window.localStorage.removeItem('x-authenticate-token'); // Removes Token from header
    window.localStorage.removeItem('accountInfo'); // Removes account information 
    console.log('Account logged out'); 

    loginDiv.classList.toggle('hidden');
    logoutDiv.classList.toggle('hidden');
    createAccountFormDiv.classList.toggle('hidden');

});

window.addEventListener('load', (e) => { // Loading the different dummy endpoints depending on state
    const token = window.localStorage.getItem('x-authenticate-token');
    
    const fetchOptions = {
        headers: {
            'Content-Type': 'application/json',
        }
    }
    if (token) fetchOptions.headers['x-authenticate-token'] = token;
    console.log(fetchOptions.headers);
    
    // render public article
    fetchOptions.method = 'GET';
    fetch(APIAddress + '/api/dummies/public', fetchOptions)
    .then(response => {
        return response.json()
    })
    .then(data => {
        publicArticle.innerHTML = data.message
    })
    .catch(error => console.log(error));

    // render private article when logged in
    if(token){
    fetchOptions.method = 'GET';
    fetch(APIAddress + '/api/dummies/private', fetchOptions)
        .then(response => {
            return response.json()
        })
        .then(data => {
            privateArticle.innerHTML = data.message;
        })
        .catch(error => console.log(error));

    }

    // render login/logout divs on the respective conditions
    if (token) {
        loginDiv.classList.add('hidden');
        createAccountFormDiv.classList.toggle('hidden');
    } else {
        logoutDiv.classList.add('hidden');
    }
})