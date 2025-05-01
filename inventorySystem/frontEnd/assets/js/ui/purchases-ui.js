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

let products = await getDataFromApi("products");

let getProductNameById = (products, productId) => {
    const matched = products.filter(p => p.id === productId);
    return matched.length > 0 ? matched[0].name : "Invalid";
}

let purchases = await getDataFromApi("purchases");

let purchaseRowContainer = document.getElementById('purchase-row-container');

let searchBox = document.getElementById("search");
searchBox.addEventListener("input", (e) => searchPurchases(e));

let searchPurchases = (e) => {
    let searchVal = e.target.value.trim().toLowerCase();
    if (searchVal == "") {
        generatepurchasesUI(purchases);
    } else {
        let filteredPurchases = purchases.filter(purchase => {
            const productName = getProductNameById(products, purchase.productId).toLowerCase();
            return (
                purchase.id.toLowerCase().includes(searchVal) ||
                productName.includes(searchVal) ||
                purchase.purchaseDate.toLowerCase().includes(searchVal) ||
                purchase.supplier.toLowerCase().includes(searchVal)
            );
        });
        generatepurchasesUI(filteredPurchases);
    }
}
let generatepurchasesUI = (purchases) => {
    purchaseRowContainer.replaceChildren("");
    purchases.forEach(element => {
        purchaseRowContainer.appendChild(generatepurchase(element));
    });
}
let generatepurchase = (purchase) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("purchase-item", "d-flex");

    const idDiv = document.createElement("div");
    idDiv.classList.add("id","w-20");
    const idP = document.createElement("p");
    idP.textContent = purchase.id;
    idDiv.appendChild(idP);
    itemContainer.appendChild(idDiv);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title","w-20");
    const titleP = document.createElement("p");
    titleP.textContent = getProductNameById(products, purchase.productId);
    titleDiv.appendChild(titleP);
    itemContainer.appendChild(titleDiv);

    const quantityDiv = document.createElement("div");
    quantityDiv.classList.add("stock","w-20");
    const quantityP = document.createElement("p");
    quantityP.textContent = purchase.quantityPurchased;
    quantityDiv.appendChild(quantityP);
    itemContainer.appendChild(quantityDiv);


    const soldDateDiv = document.createElement("div");
    soldDateDiv.classList.add("price","w-20");
    const soldDateP = document.createElement("p");
    soldDateP.textContent = purchase.purchaseDate.split("T")[0] ;
    soldDateDiv.appendChild(soldDateP);
    itemContainer.appendChild(soldDateDiv);

    const buyerDiv = document.createElement("div");
    buyerDiv.classList.add("buyer","w-20");
    const buyerP = document.createElement("p");
    buyerP.textContent = purchase.supplier;
    buyerDiv.appendChild(buyerP);
    itemContainer.appendChild(buyerDiv);

    return itemContainer;
}

function starterUI() {
    generatepurchasesUI(purchases);
}
starterUI();

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})