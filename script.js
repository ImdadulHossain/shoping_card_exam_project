fetch('products.json')
    .then(response => response.json())
    .then(products => {
        displayProducts(products);
    });

const cart = [];
let discount = 0;

function displayProducts(products) {
    const productList = document.getElementById('product-list');
    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('col-md-4', 'product-card');
        productDiv.innerHTML = `
            <div class="card">
                <img src="${product.image}" class="card-img-top fixed-img aligh" alt="${product.name}">
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
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discountAmount = subtotal * (discount / 100);
    const totalPrice = subtotal - discountAmount;

    document.getElementById('subtotal-price').innerText = `Tk ${subtotal.toFixed(2)}`;
    document.getElementById('discount-amount').innerText = `-TK ${discountAmount.toFixed(2)}`;
    document.getElementById('total-price').innerText = `TK ${totalPrice.toFixed(2)}`;
}

document.getElementById('clear-cart').addEventListener('click', () => {
    cart.length = 0;
    updateCart();
    hideCheckout();
});

document.getElementById('checkout-button').addEventListener('click', () => {
    alert('Proceeding to checkout...');
});

document.getElementById('apply-promo-code').addEventListener('click', () => {
    const promoCode = document.getElementById('promo-code').value;
    const promoMessage = document.getElementById('promo-message');

    if (promoCode === 'ostad10') {
        discount = 10;
        promoMessage.textContent = 'Promo code applied: 10% discount';
        promoMessage.classList.add('text-success');
        promoMessage.classList.remove('text-danger');
    } else if (promoCode === 'ostad5') {
        discount = 5;
        promoMessage.textContent = 'Promo code applied: 5% discount';
        promoMessage.classList.add('text-success');
        promoMessage.classList.remove('text-danger');
    } else {
        discount = 0;
        promoMessage.textContent = 'Invalid promo code';
        promoMessage.classList.add('text-danger');
        promoMessage.classList.remove('text-success');
    }
    calculateTotal();
});

function showCheckout() {
    document.querySelector('.checkout').classList.add('show');
}

function hideCheckout() {
    document.querySelector('.checkout').classList.remove('show');
}
