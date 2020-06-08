const login = document.querySelector("#login");
login.addEventListener("submit", loginUser);

function loginUser(e) {
    const userEmail = document.querySelector("#userEmail").value;
    const userPassword = document.querySelector("#userPassword").value;
    const userCredentials = {
        email: userEmail,
        password: userPassword
    }
    const url = "https://orderking.herokuapp.com/login";
    validateUser(url, userCredentials);
    e.preventDefault()
}

async function validateUser(url, userData) {
    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        })

        if (!res.ok) {
            throw Error(res.statusText)
        }
        const data = await res.json();
        storeToken(data)

        window.location.replace('../pages/admindash.html')
    } catch (e) {
        console.log(e)
        console.log("sorry, we couldn't find your account. check email or password and try again")
    }   
}

function storeToken(data) {
    JSON.stringify(sessionStorage.setItem('userToken',`${data.token}`));
}
