import { sendProductToApi, getDataFromApi } from "../service.js";
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

let products = await getDataFromApi("products");
let categories = await getDataFromApi("categories");
let suppliers = await getDataFromApi("suppliers");

let addProductForm = document.getElementById("add-product");

let productTitle = document.getElementById("product-title");
let productCat = document.getElementById("product-category");
let productSP = document.getElementById("product-selling-price");
let productCP = document.getElementById("product-purchase-price");
let productQuantity = document.getElementById("product-quantity");
let quantityUnit = document.getElementById("quantity-unit");
let productExpiry = document.getElementById("product-expiry");
let productSupplier = document.getElementById("product-supplier");




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

let formFields = [
    productTitle,
    productCat,
    productSP,
    productCP,
    productQuantity,
    quantityUnit,
    productExpiry,
    productSupplier
];
formFields.forEach((item) => {
    item.addEventListener("input", (e) => {
        e.target.classList.remove("border", "border-danger");
    })
})
addProductForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let invalidFields = [];
    if (productTitle.value.length < 3) {
        invalidFields.push(productTitle);
    }
    if (!productCat.value) {
        invalidFields.push(productCat);
    }
    if (!productSP.value) {
        invalidFields.push(productSP);
    }
    if (!productCP.value) {
        invalidFields.push(productCP);
    }
    if (!productQuantity.value) {
        invalidFields.push(productQuantity);
    }
    if (quantityUnit.value.length === 0) {
        invalidFields.push(quantityUnit);
    }
    if (!productExpiry.value) {
        invalidFields.push(productExpiry);
    }
    if (!productSupplier.value) {
        invalidFields.push(productSupplier);
    }
    if (invalidFields.length > 0) {
        invalidFields.forEach((item) => {
            item.classList.add("border", "border-danger");
        })
        invalidFields = [];
    } else {
        // success
        let id = parseInt(products[products.length - 1].id) + 1;
        const newProduct = {
            Id: id + "",
            Name: productTitle.value.trim(),
            Category: productCat.value.trim(),
            Quantity: parseInt(productQuantity.value),
            Unit: quantityUnit.value.trim(),
            SellingPrice: parseFloat(productSP.value),
            PurchasePrice: parseFloat(productCP.value),
            ExpiryDate: productExpiry.value,
            Supplier: productSupplier.value.trim()
        };

        const response = await sendProductToApi(newProduct);

        if (response.ok) {
            alert("Product added successfully!");
            addProductForm.reset();
        } else {
            alert("Failed to add product.");
        }


    }
})

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})