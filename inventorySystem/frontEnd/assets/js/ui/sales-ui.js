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
const getProductIdByName = (products, productName) => {
    const matched = products.filter(p => p.name === productName);
    return matched.length > 0 ? matched[0].id : "Invalid";
};


let sales = await getDataFromApi("sales");

let saleRowContainer = document.getElementById('sale-row-container');

let searchBox = document.getElementById("search");
searchBox.addEventListener("input", (e) => searchSales(e));

let searchSales = (e) => {
    let searchVal = e.target.value.trim().toLowerCase();
    if (searchVal == "") {
        generatesalesUI(sales);
    } else {
        let filteredSales = sales.filter(sale => {
            const productName = getProductNameById(products, sale.productId).toLowerCase();
            return (
                sale.id.toLowerCase().includes(searchVal) ||
                productName.includes(searchVal) ||
                sale.sellDate.toLowerCase().includes(searchVal) ||
                sale.buyer.toLowerCase().includes(searchVal)
            );
        });
        generatesalesUI(filteredSales);
    }
}


let generatesalesUI = (sales) => {
    saleRowContainer.replaceChildren("");
    sales.forEach(element => {
        saleRowContainer.appendChild(generatesale(element));
    });
}
let generatesale = (sale) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("sale-item", "d-flex");

    const idDiv = document.createElement("div");
    idDiv.classList.add("id","w-20");
    const idP = document.createElement("p");
    idP.textContent = sale.id;
    idDiv.appendChild(idP);
    itemContainer.appendChild(idDiv);

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title","w-20");
    const titleP = document.createElement("p");
    titleP.textContent = getProductNameById(products, sale.productId);
    titleDiv.appendChild(titleP);
    itemContainer.appendChild(titleDiv);

    const quantityDiv = document.createElement("div");
    quantityDiv.classList.add("stock","w-20");
    const quantityP = document.createElement("p");
    quantityP.textContent = sale.quantitySold;
    quantityDiv.appendChild(quantityP);
    itemContainer.appendChild(quantityDiv);


    const soldDateDiv = document.createElement("div");
    soldDateDiv.classList.add("price","w-20");
    const soldDateP = document.createElement("p");
    soldDateP.textContent = sale.sellDate.split("T")[0] ;
    soldDateDiv.appendChild(soldDateP);
    itemContainer.appendChild(soldDateDiv);

    const buyerDiv = document.createElement("div");
    buyerDiv.classList.add("buyer","w-20");
    const buyerP = document.createElement("p");
    buyerP.textContent = sale.buyer;
    buyerDiv.appendChild(buyerP);
    itemContainer.appendChild(buyerDiv);

    return itemContainer;
}

function starterUI() {
    generatesalesUI(sales);
}
starterUI();

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})