import { getProductFromApi } from "../service.js";
import { loggedInUser, checkIfUserLoggedIn } from '../domain.js';

checkIfUserLoggedIn();

//username 
let userNameEle = document.getElementById("user-name");
userNameEle.textContent = loggedInUser;

//fullscreen api
let fullScreenIcon = document.getElementById("full-screen-icon");
fullScreenIcon.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.classList.toggle("fa-maximize");
    e.target.classList.toggle("fa-minimize");
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
})

// Get product ID from the URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
    alert("No product ID found in the URL.");
    window.location.href = "./products.html";
}

// Fields
const productNameEle = document.getElementById("product-name");
const productIdEle = document.getElementById("product-id");
const productCategoryEle = document.getElementById("product-category");
const productQuantityEle = document.getElementById("product-quantity");
const productSellingPriceEle = document.getElementById("product-sp");
const productPurchasePriceEle = document.getElementById("product-cp");
const productExpiryEle = document.getElementById("product-expiry");
const productSupplierEle = document.getElementById("product-supplier");
const productEditBtn = document.getElementById("edit-btn");

// Fetching from backend
const product = await getProductFromApi(productId);

if (!product) {
    alert("Product not found.");
    window.location.href = "./products.html";
}

// Format expiry date
const formattedExpiry = product.expiryDate?.split("T")[0] || "N/A";

//display the values
productNameEle.textContent = product.name;
productIdEle.textContent = product.id;
productCategoryEle.textContent = product.category;
productQuantityEle.textContent = `${product.quantity} ${product.unit}`;
productSellingPriceEle.textContent = product.sellingPrice.toFixed(2);
productPurchasePriceEle.textContent = product.purchasePrice.toFixed(2);
productExpiryEle.textContent = formattedExpiry;
productSupplierEle.textContent = product.supplier;
productEditBtn.setAttribute("href", `./edit-product.html?id=${product.id}`)

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})