fetch('products.json')
    .then(response => response.json())
    .then(products => {
        displayProducts(products);
    });

const cart = [];

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('col-md-4', 'product-card');
        productDiv.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top fixed-img align-center" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                    <p class="card-text">Price: Tk ${product.price}</p>
                    <button class="btn btn-primary" onclick="addToCart(${product.id}, ${product.price})">Add to Cart</button>
                </div>
            </div>`
        ;
        productList.appendChild(productDiv);
    });
}

function addToCart(id, price) {
    const product = cart.find(item => item.id === id);
    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ id, price, quantity: 1 });
    }
    updateCart();
    showCheckout();
}

function removeFromCart(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
    }
    updateCart();
    if (cart.length === 0) {
        hideCheckout();
    }
}

function updateCart() {
    const cartOptionsDiv = document.getElementById('cart-options');
    cartOptionsDiv.innerHTML = '';
    if (cart.length === 0) {
        cartOptionsDiv.innerHTML = '<p class="text-center">Your cart is empty.</p>';
    } else {
        cart.forEach(item => {
            const cartOptionDiv = document.createElement('div');
            cartOptionDiv.classList.add('cart-item', 'card', 'mb-2');
            cartOptionDiv.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">Product ${item.id}</h5>
                <p class="card-text">Price: TK ${item.price}</p>
                <div class="quantity-buttons mb-2">
                    <button class="btn btn-secondary" onclick="decreaseQuantity(${item.id})">-</button>
                    <p class=""m-0>${item.quantity}</p>
                    <button class="btn btn-secondary" onclick="increaseQuantity(${item.id})">+</button>
                </div>
                <button class="btn btn-danger button-remove" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
                `;
            cartOptionsDiv.appendChild(cartOptionDiv);
        });
    }
    calculateTotal();
}

function increaseQuantity(id) {
    const product = cart.find(item => item.id === id);
    if (product) {
        product.quantity += 1;
    }
    updateCart();
}

function decreaseQuantity(id) {
    const product = cart.find(item => item.id === id);
    if (product) {
        if (product.quantity > 1) {
            product.quantity -= 1;
        } else {
            removeFromCart(id);
        }
    }
    updateCart();
}

function calculateTotal() {
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    document.getElementById('total-price').innerText = `Tk ${totalPrice}`;
}

document.getElementById('clear-cart').addEventListener('click', () => {
    cart.length = 0;
    updateCart();
    hideCheckout();
});

function showCheckout() {
    document.querySelector('.checkout').classList.add('show');
}

function hideCheckout() {
    document.querySelector('.checkout').classList.remove('show');
}
