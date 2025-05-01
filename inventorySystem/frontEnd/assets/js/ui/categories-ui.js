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

//categories

let categories = await getDataFromApi("categories");

let categoryRowContainer = document.getElementById('category-row-container');

let searchBox = document.getElementById("search");
searchBox.addEventListener("input", (e) => searchCats(e));

let searchCats = (e) => {
    let searchVal = e.target.value.trim().toLowerCase();
    if (searchVal == "") {
        generateCategoriesUI(categories);
    } else {
        let filteredCats = categories.filter(cat => {
            return (
                cat.name.toLowerCase().includes(searchVal) ||
                cat.id.toLowerCase().includes(searchVal) ||
                cat.description.toLowerCase().includes(searchVal)
            );
        });
        generateCategoriesUI(filteredCats);
    }
}

let generateCategoriesUI = (categories) => {
    categoryRowContainer.replaceChildren("");
    categories.forEach(element => {
        categoryRowContainer.appendChild(generateCategory(element));
    });
}
let generateCategory = (category) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("category-item", "d-flex");

    const idDiv = document.createElement("div");
    idDiv.classList.add("id","w-20");
    const idP = document.createElement("p");
    idP.textContent = category.id;
    idDiv.appendChild(idP);
    itemContainer.appendChild(idDiv);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title","w-20");
    const titleP = document.createElement("p");
    titleP.textContent = category.name;
    titleDiv.appendChild(titleP);
    itemContainer.appendChild(titleDiv);


    const descDiv = document.createElement("div");
    descDiv.classList.add("description","w-60");
    const priceP = document.createElement("p");
    priceP.textContent = category.description;
    descDiv.appendChild(priceP);
    itemContainer.appendChild(descDiv);


    return itemContainer;
}

function starterUI(){
    generateCategoriesUI(categories);
}
starterUI();

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})