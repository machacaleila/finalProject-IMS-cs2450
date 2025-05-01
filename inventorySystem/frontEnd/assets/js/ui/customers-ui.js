import { getDataFromApi } from '../service.js';
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

let customers = await getDataFromApi("customers");

let customerRowContainer = document.getElementById('customer-row-container');

let searchBox = document.getElementById("search");
searchBox.addEventListener("input", (e) => searchCustomers(e));

let searchCustomers = (e) => {
    let searchVal = e.target.value.trim().toLowerCase();
    if (searchVal == "") {
        generatecustomersUI(customers);
    } else {
        let filteredCustomers = customers.filter(customer => {
            return (
                customer.id.toLowerCase().includes(searchVal) ||
                customer.name.includes(searchVal) ||
                customer.phone.toLowerCase().includes(searchVal) ||
                customer.email.toLowerCase().includes(searchVal) ||
                customer.address.toLowerCase().includes(searchVal)
            );
        });
        generatecustomersUI(filteredCustomers);
    }
}


let generatecustomersUI = (customers) => {
    customerRowContainer.replaceChildren("");
    customers.forEach(element => {
        customerRowContainer.appendChild(generatecustomer(element));
    });
}
let generatecustomer = (customer) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("customer-item", "d-flex");

    const idDiv = document.createElement("div");
    idDiv.classList.add("customer-id", "w-20");
    const idP = document.createElement("p");
    idP.textContent = customer.id;
    idDiv.appendChild(idP);
    itemContainer.appendChild(idDiv);

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("customer-name", "w-20");
    const nameP = document.createElement("p");
    nameP.textContent = customer.name;
    nameDiv.appendChild(nameP);
    itemContainer.appendChild(nameDiv);

    const phoneDiv = document.createElement("div");
    phoneDiv.classList.add("phone", "w-20");
    const phoneP = document.createElement("p");
    phoneP.textContent = customer.phone;
    phoneDiv.appendChild(phoneP);
    itemContainer.appendChild(phoneDiv);

    const emailDiv = document.createElement("div");
    emailDiv.classList.add("email", "w-40");
    const emailP = document.createElement("p");
    emailP.textContent = customer.email;
    emailDiv.appendChild(emailP);
    itemContainer.appendChild(emailDiv);

    return itemContainer;
}

function starterUI() {
    generatecustomersUI(customers);
}
starterUI();

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})