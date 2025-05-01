import { sendCategoryToApi, getDataFromApi } from "../service.js";
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


let categories = await getDataFromApi("categories");

let addCatForm = document.getElementById("add-category");

let catTitle = document.getElementById("cat-name");
let catDesc = document.getElementById("cat-desc");

let formFields = [
    catTitle,
    catDesc
];

formFields.forEach((item) => {
    item.addEventListener("input", (e) => {
        e.target.classList.remove("border", "border-danger");
    })
})
addCatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    let invalidFields = [];
    if (!catTitle.value) {
        invalidFields.push(productTitle);
    }
    if (!catDesc.value) {
        invalidFields.push(productCat);
    }

    if (invalidFields.length > 0) {
        invalidFields.forEach((item) => {
            item.classList.add("border", "border-danger");
        })
        invalidFields = [];
    } else {
        // success
        let idOriginal = categories[categories.length - 1].id;
        let lastTwo = parseInt(idOriginal.slice(-2)) + 1 ;
        const firstPart = idOriginal.slice(0, -2);
        let idNew = firstPart + lastTwo;
        const newProduct = {
            Id: idNew,
            Name: catTitle.value.trim(),
            Description: catDesc.value.trim()
        };

        const response = await sendCategoryToApi(newProduct);

        if (response.ok) {
            alert("Category added successfully!");
            addCatForm.reset();
        } else {
            alert("Failed to add Category.");
        }
    }
})
//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})