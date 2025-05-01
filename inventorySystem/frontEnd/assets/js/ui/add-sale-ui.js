import { getDataFromApi, sendSaleToApi } from "../service.js";
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
let customers = await getDataFromApi("customers"); // buyers

let addSaleForm = document.getElementById("add-sales");

let productSelect = document.getElementById("product-name");
let productQuantity = document.getElementById("product-quantity");
let saleDate = document.getElementById("product-sale-date");
let buyerSelect = document.getElementById("product-buyer");

// Populate product dropdown
productSelect.length = 1;
products.forEach(product => {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.name;
    productSelect.appendChild(option);
});

// Populate buyer dropdown
buyerSelect.length = 1;
customers.forEach(customer => {
    const option = document.createElement("option");
    option.value = customer.name;
    option.textContent = customer.name;
    buyerSelect.appendChild(option);
});

let formFields = [productSelect, productQuantity, saleDate, buyerSelect];

// Remove red border on input
formFields.forEach((item) => {
    item.addEventListener("input", (e) => {
        e.target.classList.remove("border", "border-danger");
    });
});

// Submit handler
addSaleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let invalidFields = [];
    if (!productSelect.value) invalidFields.push(productSelect);
    if (!productQuantity.value || parseInt(productQuantity.value) <= 0) invalidFields.push(productQuantity);
    if (!saleDate.value) invalidFields.push(saleDate);
    if (!buyerSelect.value) invalidFields.push(buyerSelect);

    if (invalidFields.length > 0) {
        invalidFields.forEach(field => field.classList.add("border", "border-danger"));
        return;
    }

    let sales = await getDataFromApi("sales");
    let newId = "S" + (parseInt(sales[sales.length - 1]?.Id?.replace("S", "") || 0) + 1);

    const newSale = {
        Id: newId,
        ProductId: productSelect.value,
        QuantitySold: parseInt(productQuantity.value),
        SellDate: saleDate.value,
        Buyer: buyerSelect.value.trim()
    };

    const response = await sendSaleToApi(newSale);
    if (response.ok) {
        alert("Sale added successfully!");
        addSaleForm.reset();
    } else {
        alert("Failed to add sale.");
    }
});

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})