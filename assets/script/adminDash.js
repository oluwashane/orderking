const logoutBtn = document.querySelector(".logoutButton").addEventListener('click', logoutUser);

function logoutUser(e) {
    console.log("logout btn clicked!!")
    sessionStorage.removeItem('userToken');
    window.location.replace('../pages/login.html')
    e.preventDefault();
}
