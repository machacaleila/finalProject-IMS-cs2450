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

let suppliers = await getDataFromApi("suppliers");

let supplierRowContainer = document.getElementById('supplier-row-container');

let searchBox = document.getElementById("search");
searchBox.addEventListener("input", (e) => searchSuppliers(e));

let searchSuppliers = (e) => {
    let searchVal = e.target.value.trim().toLowerCase();
    if (searchVal == "") {
        generateSuppliersUI(suppliers);
    } else {
        let filteredSuppliers = suppliers.filter(supplier => {
            return (
                supplier.id.toLowerCase().includes(searchVal) ||
                supplier.name.includes(searchVal) ||
                supplier.phone.includes(searchVal) ||
                supplier.contactPerson.toLowerCase().includes(searchVal) ||
                supplier.email.toLowerCase().includes(searchVal) ||
                supplier.address.toLowerCase().includes(searchVal) ||
                supplier.productsSupplied.join(",").toLowerCase().includes(searchVal)
            );
        });
        generateSuppliersUI(filteredSuppliers);
    }
}


let generateSuppliersUI = (suppliers) => {
    supplierRowContainer.replaceChildren("");
    suppliers.forEach(element => {
        supplierRowContainer.appendChild(generateSupplier(element));
    });
}
let generateSupplier = (supplier) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("supplier-item", "d-flex");


    const nameDiv = document.createElement("div");
    nameDiv.classList.add("supplier-name", "w-20");
    const nameP = document.createElement("p");
    nameP.textContent = supplier.name;
    nameDiv.appendChild(nameP);
    itemContainer.appendChild(nameDiv);

    const contactPersonDiv = document.createElement("div");
    contactPersonDiv.classList.add("contact-person", "w-20");
    const contactPersonP = document.createElement("p");
    contactPersonP.textContent = supplier.contactPerson;
    contactPersonDiv.appendChild(contactPersonP);
    itemContainer.appendChild(contactPersonDiv);

    const phoneDiv = document.createElement("div");
    phoneDiv.classList.add("phone", "w-20");
    const phoneP = document.createElement("p");
    phoneP.textContent = supplier.phone;
    phoneDiv.appendChild(phoneP);
    itemContainer.appendChild(phoneDiv);

    const emailDiv = document.createElement("div");
    emailDiv.classList.add("email", "w-40");
    const emailP = document.createElement("p");
    emailP.textContent = supplier.email;
    emailDiv.appendChild(emailP);
    itemContainer.appendChild(emailDiv);

    return itemContainer;
}

function starterUI() {
    generateSuppliersUI(suppliers);
}
starterUI();

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})