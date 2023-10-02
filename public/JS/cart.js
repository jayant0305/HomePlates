let cart=[]
let totalPrice=0
function addItemInCart(itemName,itemPrice){
    cart.push({name:itemName,price:itemPrice})
    totalPrice+=itemName
    console.log(itemName,itemPrice)
    cartUpdate()
}

function cartUpdate(){
    // const cartItemsElement=document.getElementById("item")
    let cartItemsPrice=document.getElementById("totalPrice")
    console.log(cartItemsPrice)
    // cart.forEach(function (item) {
    //     let li = document.createElement("li");
    //     // li.className("item-cart")
    //     li.innerHTML = `
    //         <div class="item-name">${item.name}</div>
    //         <div class="item-price">$${item.price}</div>
    //     `;
    //     cartItemsElement.appendChild(li);
    //     console.log("DONE")
    // });
    cartItemsPrice.innerHTML=totalPrice;
}
