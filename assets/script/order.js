// variables
const orderSection = document.querySelector(".order");
const shoppingCart = document.querySelector("#shoppingCart");
const cartCloseButton = document.querySelector("#orderCloseButton");
const orderContent = document.querySelector(".orderContent");
const badge = document.querySelector(".badge");



let badgeCount;


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

// window.addEventListener('load', function(e) {
//     const checkStorage = JSON.parse(localStorage.getItem("orderArr"));
//     if (!checkStorage) {
//         // this.console.log("No storage allocated")
//     } else {
//         badgeCount = checkStorage.length;
//         increaseBadge()
//         checkStorage.forEach((data) => {
//             cartBody.innerHTML += `
//                 <tr>
//                     <th scope="row"></th>
//                     <td>${data.name}</td>
//                     <td>${data.price}</td>
//                     <td><input type="button" value="x"></td>
//                 </tr>`
//         })
//     }
//     e.preventDefault()
// })

// Badge section

function increaseBadge() {
    badge.innerHTML = badgeCount++
}

const orderButton = document.querySelectorAll('.orderBtn');
for (let i = 0; i < orderButton.length; i++) {
    const button = orderButton[i];
    button.addEventListener('click', addClickedItem)
}

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
            alert("This item is already added to the cart");
            return
        }
    }
    // showToast()
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
    updateCart()
}


function updateCart() {
    const removeCartItemButtons = document.getElementsByClassName("removeOrder");
    for(let i = 0; i < removeCartItemButtons.length; i++) {
        const button = removeCartItemButtons[i];
        button.addEventListener('click', (e) => {
            const buttonClicked = e.target
            buttonClicked.parentElement.parentElement.remove();
            updateCartTotal();
            console.log('Remove Button clicked')
        })
    }

    const quantityInputs = document.getElementsByClassName("cartQuantityInput");
    for(let i = 0; i < quantityInputs.length; i++) {
        const input = quantityInputs[i];
        input.addEventListener('change', quantityChanged)
    }
}




// function storeInLocalStorage (name, price) {
//     const oldItems = JSON.parse(localStorage.getItem("orderArr")) || [];
//     const order = { 
//         name,
//         price
//     }
//     oldItems.push(order);
//     localStorage.setItem("orderArr", JSON.stringify(oldItems));
// }



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





