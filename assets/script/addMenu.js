const addMenuBtn = document.getElementById("addMenu");

addMenuBtn.addEventListener("submit", addNewItem);

function addNewItem(e) {
    const itemName = document.querySelector("#itemName");
    const itemPrice = document.querySelector("#itemPrice");
    const itemImage = document.querySelector("#itemImage");

    data = {
        name: itemName.value,
        price: itemPrice.value,
        image: itemImage.value
    }

    fetch("https://orderking.herokuapp.com/menu", {
        method: "post",
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': sessionStorage.getItem('userToken')
        })
    })
    .then(res => res.json())
    .then(data => {
        clearInput(itemName, itemPrice, itemImage);
    })
    .catch((err) => {
        console.log(err)
    })
    e.preventDefault()
}

function clearInput(name, price, image) {
    name.value = '';
    price.value = '';
    image.value = '';
}
