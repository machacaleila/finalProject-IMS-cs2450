import { getDataFromApi, sendPurchaseToApi } from "../service.js";
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
let suppliers = await getDataFromApi("suppliers");
let purchases = await getDataFromApi("purchases");

const addPurchaseForm = document.getElementById("add-purchase");
const productTitle = document.getElementById("product-title");
const purchaseQuantity = document.getElementById("purchase-quantity");
const purchaseDate = document.getElementById("purchase-date");
const purchaseSupplier = document.getElementById("product-supplier");

// supplier 
purchaseSupplier.length = 1;
suppliers.forEach(supplier => {
    const option = document.createElement("option");
    option.value = supplier.name;
    option.textContent = supplier.name;
    purchaseSupplier.appendChild(option);
});

// products
productTitle.length = 1;
products.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.id;
    option.textContent = cat.name;
    productTitle.appendChild(option);
});

// Fields to validate
let formFields = [
    productTitle,
    purchaseQuantity,
    purchaseDate,
    purchaseSupplier
];
console.log(formFields)
// Remove error style on input
formFields.forEach((field) => {
    field.addEventListener("input", () => {
        field.classList.remove("border", "border-danger");
    });
});

addPurchaseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate
    let invalidFields = [];
    if (!productTitle.value) invalidFields.push(productTitle);
    if (!purchaseQuantity.value) invalidFields.push(purchaseQuantity);
    if (!purchaseSupplier.value) invalidFields.push(purchaseSupplier);

    if (invalidFields.length > 0) {
        invalidFields.forEach(f => f.classList.add("border", "border-danger"));
        return;
    }

    // Create Purchase ID 

    let purchaseId = (parseInt(purchases[purchases.length - 1]?.id || 0) + 1).toString();

    const newPurchase = {
        Id: purchaseId,
        ProductId: productTitle.value.trim(),
        QuantityPurchased: parseInt(purchaseQuantity.value),
        PurchaseDate: new Date(purchaseDate.value).toISOString(),
        Supplier: purchaseSupplier.value.trim()
    };

    const response = await sendPurchaseToApi(newPurchase);
    console.log(response)
    if (response.ok) {
        alert("Purchase added successfully!");
        addPurchaseForm.reset();
    } else {
        alert("Failed to add purchase.");
    }
});

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})
