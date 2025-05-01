import { getDataFromApi, sendCustomerToApi } from "../service.js";
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

const customers = await getDataFromApi("customers");
const addCustomerForm = document.getElementById("add-customer");

const customerName = document.getElementById("customer-name");
const customerAddress = document.getElementById("customer-address");
const customerPhone = document.getElementById("customer-phone");
const customerEmail = document.getElementById("customer-email");
const customerJoinDate = document.getElementById("customer-join-date");

const formFields = [
    customerName,
    customerAddress,
    customerPhone,
    customerEmail,
    customerJoinDate
];

// Remove red borders on input
formFields.forEach(field => {
    field.addEventListener("input", () => {
        field.classList.remove("border", "border-danger");
    });
});



addCustomerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let invalidFields = formFields.filter(field => !field.value.trim());

    if (invalidFields.length > 0) {
        invalidFields.forEach(field => field.classList.add("border", "border-danger"));
        return;
    }
    let idOriginal = customers[customers.length - 1].id;
    let lastDigits = parseInt(idOriginal.slice(-3)) + 1 ;
    lastDigits = String(lastDigits).padStart(3, "0");
    const firstPart = idOriginal.slice(0, -2);
    let idNew = firstPart + lastDigits;
    const newCustomer = {
        Id: idNew,
        Name: customerName.value.trim(),
        Phone: customerPhone.value.trim(),
        Email: customerEmail.value.trim(),
        Address: customerAddress.value.trim(),
        JoinDate: customerJoinDate.value
    };

    const response = await sendCustomerToApi(newCustomer);
    if (response.ok) {
        alert("Customer added successfully!");
        addCustomerForm.reset();
    } else {
        const errorText = await response.text();
        alert("Failed to add customer.\n" + errorText);
    }
});

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})