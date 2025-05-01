import { getDataFromApi, sendProductToApi } from "../service.js";
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

// Get product ID from query string
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
    alert("Invalid product ID in URL.");
    window.location.href = "./products.html";
}

// From the backend
let products = await getDataFromApi("products");
let categories = await getDataFromApi("categories");
let suppliers = await getDataFromApi("suppliers");

// Form Elements
const addProductForm = document.getElementById("add-product");
const productTitle = document.getElementById("product-title");
const productCat = document.getElementById("product-category");
const productSP = document.getElementById("product-selling-price");
const productCP = document.getElementById("product-purchase-price");
const productQuantity = document.getElementById("product-quantity");
const quantityUnit = document.getElementById("quantity-unit");
const productExpiry = document.getElementById("product-expiry");
const productSupplier = document.getElementById("product-supplier");

// Category field
productCat.length = 1;
categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    productCat.appendChild(option);
});

//supplier field
productSupplier.length = 1;
suppliers.forEach(category => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    productSupplier.appendChild(option);
});


// Get product by ID
const product = products.find(p => p.id === productId);
if (!product) {
    alert("Product not found.");
    window.location.href = "./products.html";
}

// Pre-fill form
productTitle.value = product.name;
productCat.value = product.category;
productSP.value = product.sellingPrice;
productCP.value = product.purchasePrice;
productQuantity.value = product.quantity;
quantityUnit.value = product.unit;
productExpiry.value = product.expiryDate.split("T")[0]; //to work with the data format
productSupplier.value = product.supplier;

// Remove red borders on input
const formFields = [productTitle, productCat, productSP, productCP, productQuantity, quantityUnit, productExpiry, productSupplier];
formFields.forEach(field => {
    field.addEventListener("input", () => {
        field.classList.remove("border", "border-danger");
    });
});

// Form submit
addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let invalidFields = formFields.filter(field => !field.value.trim());
    if (invalidFields.length > 0) {
        invalidFields.forEach(field => field.classList.add("border", "border-danger"));
        return;
    }

    const updatedProduct = {
        Id: productId,
        Name: productTitle.value.trim(),
        Category: productCat.value.trim(),
        Quantity: productQuantity.value,
        Unit: quantityUnit.value.trim(),
        SellingPrice: productSP.value,
        PurchasePrice: productCP.value,
        ExpiryDate: productExpiry.value,
        Supplier: productSupplier.value.trim()
    };

    const response = await sendProductToApi(updatedProduct);
    if (response.ok) {
        alert("Product updated successfully!");
    } else {
        alert("Failed to update product.");
    }
});

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})