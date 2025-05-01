import { sendSupplierToApi, getDataFromApi } from "../service.js";
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

let suppliers =  await getDataFromApi("suppliers");

let addSupplierForm = document.getElementById("add-supplier");

let supplierName = document.getElementById("supplier-name");
let supplierContactPerson = document.getElementById("contact-person");
let supplierPhone = document.getElementById("supplier-phone");
let supplierEmail = document.getElementById("supplier-email");
let supplierAddress = document.getElementById("supplier-address");

let formFields = [
    supplierName,
    supplierContactPerson,
    supplierPhone,
    supplierEmail,
    supplierAddress
];

formFields.forEach((item) => {
    item.addEventListener("input", (e) => {
        e.target.classList.remove("border", "border-danger");
    })
})
addSupplierForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let invalidFields = [];
    if (!supplierName.value) {
        invalidFields.push(productTitle);
    }
    if (!supplierContactPerson.value) {
        invalidFields.push(productCat);
    }
    if (!supplierPhone.value) {
        invalidFields.push(productCat);
    }
    if (!supplierEmail.value) {
        invalidFields.push(productCat);
    }
    if (!supplierAddress.value) {
        invalidFields.push(productCat);
    }

    if (invalidFields.length > 0) {
        invalidFields.forEach((item) => {
            item.classList.add("border", "border-danger");
        })
        invalidFields = [];
    } else {
        // success
        let idOriginal = suppliers[suppliers.length - 1].id;
        let lastTwo = parseInt(idOriginal.slice(-3)) + 1 ;
        const firstPart = idOriginal.slice(0, -2);
        let idNew = firstPart + lastTwo;
        const newSupplier = {
            Id: idNew,
            Name: supplierName.value.trim(),
            ContactPerson: supplierContactPerson.value.trim(),
            Phone: supplierPhone.value.trim(),
            Email: supplierEmail.value.trim(),
            Address: supplierAddress.value.trim(),
            ProductsSupplied: []
        };

        const response = await sendSupplierToApi(newSupplier);
        if (response.ok) {
            alert("Supplier added successfully!");
            addSupplierForm.reset();
        } else {
            alert("Failed to add Supplier.");
        }


    }
})

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})