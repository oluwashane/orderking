// variables
const orderSection = document.querySelector(".order");
const shoppingCart = document.querySelector("#shoppingCart");
const cartCloseButton = document.querySelector("#orderCloseButton");
const orderContent = document.querySelector(".orderContent");

// Shopping cart icon
shoppingCart.addEventListener("click", (e) => {
    console.log("clicked on shopping cart")
    orderSection.style.display = "block";
    e.preventDefault()
})

cartCloseButton.addEventListener("click", (e) => {
    console.log("closed!")
    orderSection.style.display = "none";
    e.preventDefault();
})

window.onload = (e) => {
    loadData();
    
}

// Load items in local storage
async function loadData() {
    const checkStorage = JSON.parse(localStorage.getItem("orderArr"));
    let cartBody = document.getElementsByClassName("cartContainer")[0];
    await loadMenu()
    if (!checkStorage) {
        return console.log("Nothing in Local Storage");
    }
    checkStorage.forEach((data) => {
        let item = `
            <tr class="cartRow">
                <th scope="row">
                    <input type="text" name="quantity" class="cartQuantityInput" value = 1>
                </th>
                <td class="cart-item-name itemName">${data.title}</td>
                <td class="cartPrice">${data.price}</td>
                <td><input type="button" value="x" class="removeOrder"></td>
            </tr>
        `
        cartBody.innerHTML += item;
    })
    
    updateCart();
    updateBadge();
    updateCartTotal()
}

async function loadMenu() {
    // orderking.herokuapp.com/menu
    const url = 'http://localhost:5000/menu';
    const menuRawData = await fetch(url);
    if (!menuRawData.ok) {
        return alert(menuRawData.status);
    }
    const items = await menuRawData.json();
    items.forEach((item) => {
        const menuParent = document.querySelector(".menu");
        menuParent.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 menuItem" id="menuItem">
                <img src=${item.image} class="menuPicture" alt="#">
                <div class="menuContent">
                    <p class="lead menuItemName">${item.name}</p>
                    <p class="lead menuItemPrice"><span>&#8358;</span>${item.price}</p>
                </div>
                <button class="orderBtn">order</button>
            </div>
        `
    })
    
    console.log('Menu loaded')
    const orderButton = document.querySelectorAll('.orderBtn');
    for (let i = 0; i < orderButton.length; i++) {
        const button = orderButton[i];
        button.addEventListener('click', addClickedItem)
    }
}

// Search Section
const searchBar = document.forms['searchBox'].querySelector('input');
searchBar.addEventListener("keyup", (e) => {
    const term = e.target.value.toLowerCase();
    const menu= document.getElementsByClassName("menu")[0];
    const menuItem = menu.getElementsByClassName("menuItem");
    Array.from(menuItem).forEach((item) => {
        const itemName = item.getElementsByClassName("menuItemName")[0].innerText.toLowerCase();
        if (itemName.toLowerCase().indexOf(term) != -1) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    })
})

function addClickedItem (e) {
    const button = e.target;
    const menuItem = button.previousElementSibling;
    const title = menuItem.getElementsByClassName("menuItemName")[0].innerText;
    const price = menuItem.getElementsByClassName("menuItemPrice")[0].innerText;
    addItemToCart(title, price);
    updateCartTotal();
    e.preventDefault();
}

function addItemToCart (itemName, itemPrice) {
    const cartStructure = document.createElement('tr');
    cartStructure.className ='cartRow';
    let cartBody = document.getElementsByClassName("cartContainer")[0];
    const cartItemName = cartBody.getElementsByClassName("cart-item-name");
    for (let i = 0; i < cartItemName.length; i++) {
        if (cartItemName[i].innerText == itemName) {
            // alert("This item is already added to the cart");
            showToast("This item is already added to the cart", "#FFCC00")
            return  
        }
    }
    showToast('Item Added Successfully', 'rgb(7, 160, 7)');
    const cartContent = `
                <th scope="row">
                    <input type="text" name="quantity" class="cartQuantityInput" value = 1>
                </th>
                <td class="cart-item-name itemName">${itemName}</td>
                <td class="cartPrice">${itemPrice}</td>
                <td><input type="button" value="x" class="removeOrder"></td>
        `
    cartStructure.innerHTML = cartContent;
    cartBody.append(cartStructure);
    updateCart();
    updateBadge();
    storeInLocalStorage(itemName, itemPrice);
}

function updateCart() {
    const removeCartItemButtons = document.getElementsByClassName("removeOrder");
    for(let i = 0; i < removeCartItemButtons.length; i++) {
        const button = removeCartItemButtons[i];
        button.addEventListener('click', (e) => {
            const buttonClicked = e.target
            buttonClicked.parentElement.parentElement.remove();
            removeItemInStorage();
            updateCartTotal();
            updateBadge();
        }) 
    }

    const quantityInputs = document.getElementsByClassName("cartQuantityInput");
    for(let i = 0; i < quantityInputs.length; i++) {
        const input = quantityInputs[i];
        input.addEventListener('change', quantityChanged)
    }
}

function updateBadge() {
    const cartItemContainer = document.getElementsByClassName("cartContainer")[0];
    const cartRows = cartItemContainer.getElementsByClassName("cartRow");
    document.getElementsByClassName("badge")[0].innerText = cartRows.length;
}

function showToast(message, color) {
    const toastMessage = document.getElementById("message");
    toastMessage.innerHTML = `<p>${message}</p>`;
    toastMessage.style.display = "block";
    toastMessage.style.backgroundColor = color;
    console.log(message)
    setTimeout(removeToast, 2000)
}

function removeToast() {
    const toastMessage = document.getElementById("message");
    toastMessage.style.display = "none";
}



function storeInLocalStorage (title, price) {
    const oldItems = JSON.parse(localStorage.getItem("orderArr")) || [];
    const order = { 
        title,
        price
    }
    oldItems.push(order);
    localStorage.setItem("orderArr", JSON.stringify(oldItems));
}

function removeItemInStorage() {
    localStorage.clear("orderArr");
    const cartContainer = document.getElementsByClassName("cartContainer")[0];
    const cartRow =  cartContainer.getElementsByClassName("cartRow")
    for(let i = 0; i < cartRow.length; i++) {
        const cartRowIn = cartRow[i];
        const cartItemName = cartRowIn.getElementsByClassName('cart-item-name')[0].innerHTML;
        const cartItemPrice= cartRowIn.getElementsByClassName('cartPrice')[0].innerHTML;
        storeInLocalStorage(cartItemName, cartItemPrice);
    }
}

function quantityChanged(e) {
    const input = e.target;
    // Check if input is a number or not
    if (isNaN(input.value) || input.value <= 0) {
        input.value = 1;
    }
    updateCartTotal()
}

function updateCartTotal() {
    const cartItemContainer = document.getElementsByClassName("cartContainer")[0];
    const cartRows = cartItemContainer.getElementsByClassName("cartRow");
    let total = 0;
    for (let i = 0; i < cartRows.length; i++) {
        const cartRow = cartRows[i];
        const priceElement = cartRow.getElementsByClassName("cartPrice")[0];
        const quantityElement = cartRow.getElementsByClassName("cartQuantityInput")[0];
        const price = parseFloat(priceElement.innerText.replace('₦', ''))
        const quantity = quantityElement.value;
        total = total + (price * quantity);
    }
    //Round total to two decimal place
    total = Math.round(total * 100)/100
    document.getElementsByClassName("cartTotalPrice")[0].innerText = `₦${total}`;
}


// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

const pusher = new Pusher('4681ba5213914b854547', {
    cluster: 'mt1'
});

const channel = pusher.subscribe('orderKing-menu');
channel.bind('order-item', function(data) {
    const menu = data.data;
    const menuParent = document.querySelector(".menu");
    menuParent.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 menuItem" id="menuItem">
                <img src=${menu.image} class="menuPicture" alt="#">
                <div class="menuContent">
                    <p class="lead menuItemName">${menu.name}</p>
                    <p class="lead menuItemPrice"><span>&#8358;</span>${menu.price}</p>
                </div>
                <button class="orderBtn">order</button>
            </div>
        `
});
