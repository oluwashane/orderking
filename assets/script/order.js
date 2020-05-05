// variables
const orderSection = document.querySelector(".order");
const shoppingCart = document.querySelector("#shoppingCart");
const orderCloseButton = document.querySelector("#orderCloseButton");
const orderContent = document.querySelector(".orderContent");
const badge = document.querySelector(".badge");
let cartBody = document.querySelector("#tbody");

window.addEventListener('load', function(e) {
    console.log('All assets are loaded')
    const checkStorage = JSON.parse(localStorage.getItem("orderArr"));
    if (!checkStorage) {
        this.console.log("No storage allocated")
    } else {
        badge.innerHTML = checkStorage.length
        checkStorage.forEach((data) => {
            cartBody.innerHTML += `
                <tr>
                    <th scope="row"></th>
                    <td>${data.name}</td>
                    <td>${data.price}</td>
                    <td><input type="button" value="x"></td>
                </tr>`
        })
    }
    e.preventDefault()
})

// Badge section
let badgeCount = 1;
function increaseBadge() {
    badge.innerHTML = badgeCount++
}

// menu section
const orderBtn = document.querySelector(".menu");
orderBtn.addEventListener("click", addOrder)

function addOrder (e) {
    const menuItemName = e.target.previousElementSibling.children[1].innerText;
    const menuItemPrice = e.target.previousElementSibling.children[3].innerText;
    if (e.target.classList.value === "orderBtn") {
        increaseBadge();
        storeInLocalStorage(menuItemName, menuItemPrice); 
        cartBody.innerHTML += `
                <tr>
                    <th scope="row"></th>
                    <td>${menuItemName}</td>
                    <td>${menuItemPrice}</td>
                    <td><input type="button" value="x"></td>
                </tr>` 
    }
    e.preventDefault()
}

function storeInLocalStorage (name, price) {
    const oldItems = JSON.parse(localStorage.getItem("orderArr")) || [];
    const order = { 
        name,
        price
    }
    oldItems.push(order);
    localStorage.setItem("orderArr", JSON.stringify(oldItems));
}


// Shopping cart icon
shoppingCart.addEventListener("click", (e) => {
    console.log("clicked on shopping cart")
    orderSection.style.display = "block";
    e.preventDefault()
})

orderCloseButton.addEventListener("click", (e) => {
    console.log("closed!")
    orderSection.style.display = "none";
    e.preventDefault();
})


