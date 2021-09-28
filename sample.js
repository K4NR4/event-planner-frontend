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