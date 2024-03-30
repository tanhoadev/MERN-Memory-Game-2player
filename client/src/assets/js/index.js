document.getElementById('cart-plus').addEventListener('click', cartToggle);
// document.getElementById('m-cart-plus').addEventListener('click', cartToggle);
// document.getElementById('account-toggle').addEventListener('click', AccountTogle)

// function AccountTogle() {
// console.log('click')
// document.getElementById('account-page').classList.toggle('account-page')
// document.getElementById('food-items').classList.toggle('account-page');
// document.getElementById('category-list').classList.toggle('account-page');
// document.getElementById('category-header').classList.toggle('account-page');
// document.getElementById('m-cart-plus').classList.toggle('account-page')
// document.getElementById('cart-page').classList.toggle('account-page');
// document.getElementById('checkout').classList.toggle('account-page');
// }

// var flag = false;

function cartToggle() {
    // if (cartData.length > 0) {
    document.getElementById('food-items').classList.toggle('food-items');
    document.getElementById('category-list').classList.toggle('food-items');
    document.getElementById('category-header').classList.toggle('toggle-category');
    document.getElementById('m-cart-plus').classList.toggle('m-cart-toggle')
    document.getElementById('cart-page').classList.toggle('cart-toggle');
    document.getElementById('checkout').classList.toggle('cart-toggle');

    // document.getElementById('account-page').classList.toggle('account-page')
    // document.getElementById('m-cart-plus').classList.toggle('account-page')
    // document.getElementById('cart-page').classList.toggle('account-page');
    // document.getElementById('checkout').classList.toggle('account-page');
    // flag = true;
    // console.log(flag)
    // } else {
    // alert("Currently no item in cart!");
    // }
}

document.getElementById('add-address').addEventListener('click', addAddress);

document.getElementById('m-add-address').addEventListener('click', addAddress);

function addAddress() {
    var address = prompt('Enter your address', '');
    if (address) {
        document.getElementById('add-address').innerText = ' ' + address;
    } else {
        alert("Address not added")
    }
}