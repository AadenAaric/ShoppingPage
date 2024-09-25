// Select DOM elements
let icon_cart = document.querySelector('.cart'); // Cart icon for opening/closing the cart
let body = document.querySelector(".shopping-cart"); // Shopping cart container
let closebtn = document.querySelector(".close"); // Close button for the cart
let product_list = document.querySelector(".product-lists"); // Container for product listings
let cart_list = document.querySelector(".list-cart"); // Container for items in the cart
let cart = document.querySelector(".container header .cart span"); // Span to show the number of items in the cart
let ttl = document.querySelector(".btm h3"); // Element to display the total price

let products = []; // Array to hold the products fetched from JSON
let cart_product = []; // Array to hold the products added to the cart

let total = 0; // Variable to hold the total price of the cart

// Events---------------------------------------------------------------------
// Event listener for opening/closing the cart
icon_cart.addEventListener("click", () => {
    body.classList.toggle("show"); // Toggle visibility of the cart
    console.log("hi"); // Debug log
});

// Event listener for closing the cart
closebtn.addEventListener("click", () => {
    body.classList.toggle("show"); // Toggle visibility of the cart
    console.log("hi"); // Debug log
});

// Event listener for adding products to the cart
product_list.addEventListener("click", (event) => {
    let targt = event.target; // Target element of the click event
    if (targt.classList.contains("addbtn")) { // Check if the clicked element is the "Add to cart" button
        let product_id = targt.parentElement.dataset.id; // Get product ID from the dataset
        let quantity = 1; // Default quantity to add
        let crt_idx = cart_product.findIndex(val => val.product_id == product_id); // Check if the product is already in the cart

        if (crt_idx < 0) {
            // If the product is not in the cart, add it
            cart_product.push({ product_id: product_id, quantity: quantity });
        } else {
            // If it is in the cart, increment the quantity
            cart_product[crt_idx].quantity += 1;
        }

        // Update the cart display and local storage
        addProductsToCart();
        updateCartNumber();
        SaveToLocalStorage();
        console.log(cart_product); // Debug log
    }
});

// Event listener for modifying items in the cart (deleting or adding quantity)
cart_list.addEventListener("click", (event) => {
    let targt = event.target; // Target element of the click event
    if (targt.classList.contains("delete")) {
        // If the delete button is clicked
        let product_id = (targt.parentElement).parentElement.dataset.id; // Get the product ID
        let crt_idx = cart_product.findIndex(val => val.product_id == product_id); // Find the index of the product

        if (crt_idx >= 0) {
            cart_product[crt_idx].quantity -= 1; // Decrement the quantity
            console.log(cart_product); // Debug log
            
            if (cart_product[crt_idx].quantity <= 0) {
                // If quantity is zero or less, remove the product from the cart
                cart_product.splice(crt_idx, 1);
                console.log(cart_product); // Debug log
            }
        }
    }

    // If the add button is clicked, increment quantity
    if (targt.classList.contains("add")) {
        let product_id = (targt.parentElement).parentElement.dataset.id; // Get the product ID
        let crt_idx = cart_product.findIndex(val => val.product_id == product_id); // Find the index of the product

        if (crt_idx >= 0) {
            cart_product[crt_idx].quantity += 1; // Increment the quantity
            console.log(cart_product); // Debug log
        }
    }
    
    // Update the cart display and local storage
    updateCartNumber();
    addProductsToCart(); 
    SaveToLocalStorage();
});

// Init--------------------------------------------------------------------------
// Function to initialize the application
const init = () => {
    fetch("products.json") // Fetch product data from JSON file
        .then(response => response.json())
        .then(data => {
            products = data; // Store products in the products array
            console.log(data); // Debug log
            addProductToPage(); // Call function to display products on the page    

            // Retrieve cart data from localStorage
            let storedCart = JSON.parse(localStorage.getItem("Cart"));
            
            // If there's data in localStorage, update cart_product and the cart UI
            if (storedCart) {
                cart_product = storedCart; // Restore cart from localStorage
                updateCartNumber(); // Update the cart number display
                addProductsToCart(); // Update the cart UI
            }
        });
};

// Functions----------------------------------------------------------------------
// Function to display products on the page
const addProductToPage = () => {
    if (products.length > 0) {
        products.forEach((product) => {
            let div = document.createElement("div"); // Create a new div for each product
            div.classList.add("product"); // Add class for styling
            div.dataset.id = product.id; // Set data-id attribute to product ID
            div.innerHTML = `
                <img src="${[product.image]}" > <!-- Product image -->
                <h2>${product.title}</h2> <!-- Product title -->
                <p class="desc">$${product.Description}</p> <!-- Product description -->
                <p>$${product.price}</p> <!-- Product price -->
                <button class="addbtn">Add to cart</button>`; // Add to cart button

            product_list.appendChild(div); // Append product div to the product list
        });
    }
};

// Function to update the cart number display
const updateCartNumber = () => {
    let length = cart_product.length; // Get the number of unique products in the cart
    cart.innerHTML = length; // Update the cart number display
};

// Function to add products to the cart display
const addProductsToCart = () => {
    ttl.innerHTML = ""; // Clear the total display
    cart_list.innerHTML = ""; // Clear the cart list
    if (cart_product.length > 0) {  
        console.log("added to cart"); // Debug log
        cart_product.forEach((item) => {
            let product = products[products.findIndex(prd => prd.id == item.product_id)]; // Get product details
            let div = document.createElement("div"); // Create a new div for the cart item
            div.dataset.id = item.product_id; // Set data-id attribute to product ID
            div.classList.add("item"); // Add class for styling
            
            // Calculate total using the CalculateTotal function
            total = CalculateTotal();
            ttl.innerHTML = `Total: <span style="color:Green; font-size:2rem">${total.toFixed(2)}<span>`; // Display total

            div.innerHTML = `
                <img src="${product.image}" > <!-- Product image -->
                <h2>${product.title}</h2> <!-- Product title -->
                <p>$${(product.price * item.quantity).toFixed(2)}</p> <!-- Subtotal for this item -->
                <div class="add-del">
                    <span class="delete"><</span> <!-- Button to decrease quantity -->
                    <span>${item.quantity}</span> <!-- Quantity display -->
                    <span class="add">></span> <!-- Button to increase quantity -->
                </div>
            `;
            cart_list.appendChild(div); // Append item div to the cart list
            console.log("total:", total); // Debug log
        });
    }
};

// Function to save cart data to localStorage
const SaveToLocalStorage = () => {
    localStorage.setItem("Cart", JSON.stringify(cart_product)); // Convert cart_product to JSON and save it
};

// Function to calculate the total price of the cart
const CalculateTotal = () => {
    let total = 0; // Reset total for calculation
    cart_product.forEach(item => {
        // Get the price of the product and calculate subtotal
        let Price = products[products.findIndex(val => val.id == item.product_id)].price; 
        total += Price * item.quantity; // Add to the total
    });
    return total; // Return the total price
};

// Initial function call to set up the application
init();
