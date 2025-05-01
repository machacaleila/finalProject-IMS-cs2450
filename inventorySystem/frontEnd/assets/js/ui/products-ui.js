import { getDataFromApi, deleteProductFromApi } from '../service.js';
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

let isFilterInUse = false;

let products = await getDataFromApi("products");

let productRowContainer = document.getElementById('product-row-container');

let categories = await getDataFromApi("categories");
let suppliers = await getDataFromApi("suppliers");
// Category field
let productCat = document.getElementById("product-category");
productCat.length = 1;
categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    productCat.appendChild(option);
});

//supplier field
let productSupplier = document.getElementById("product-supplier");
productSupplier.length = 1;
suppliers.forEach(category => {
    const option = document.createElement("option");
    option.value = category.name;
    option.textContent = category.name;
    productSupplier.appendChild(option);
});

let filterBtn = document.getElementById("filter-btn");
let filterOptions = document.getElementById("filter-options");
filterBtn.addEventListener("click", (e) => {
    filterOptions.classList.toggle("d-none");
})

let applyFilterForm = document.getElementById("filter-form");
let resetFilterBtn = document.getElementById("reset-filter-btn");

resetFilterBtn.addEventListener("click", () => {
    isFilterInUse = false;
    productCat.value = "";
    productSupplier.value = "";
    filterAndSearchProducts();
});

applyFilterForm.addEventListener("click", (e) => {
    e.preventDefault();
    isFilterInUse = true;
    filterAndSearchProducts();
});

let searchBox = document.getElementById("search");
searchBox.addEventListener("input", (e) => filterAndSearchProducts());

let filterAndSearchProducts = () => {
    let searchVal = searchBox.value.trim().toLowerCase();
    let selectedCategory = productCat.value;
    let selectedSupplier = productSupplier.value;

    let filteredProducts = products.filter(product => {
        const name = product.name.toLowerCase();
        const category = product.category.toLowerCase();
        const supplier = product.supplier.toLowerCase();

        const hasSearchMatch =
            !searchVal ||
            name.includes(searchVal) ||
            category.includes(searchVal) ||
            supplier.includes(searchVal);

        const hasCategoryMatch =
            !selectedCategory || product.category === selectedCategory;

        const hasSupplierMatch =
            !selectedSupplier || product.supplier === selectedSupplier;

        return hasSearchMatch && hasCategoryMatch && hasSupplierMatch;
    });


    generateProductsUI(filteredProducts);
}

let generateProductsUI = (products) => {
    productRowContainer.replaceChildren("");
    products.forEach(element => {
        productRowContainer.appendChild(generateProduct(element));
    });
}

let generateProduct = (product) => {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("product-item", "d-flex");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title");
    const titleP = document.createElement("p");
    titleP.textContent = product.name;
    titleDiv.appendChild(titleP);
    itemContainer.appendChild(titleDiv);

    const idDiv = document.createElement("div");
    idDiv.classList.add("id");
    const idP = document.createElement("p");
    idP.textContent = product.id;
    idDiv.appendChild(idP);
    itemContainer.appendChild(idDiv);

    const priceDiv = document.createElement("div");
    priceDiv.classList.add("price");
    const priceP = document.createElement("p");
    priceP.textContent = product.sellingPrice;
    priceDiv.appendChild(priceP);
    itemContainer.appendChild(priceDiv);

    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category");
    const categoryP = document.createElement("p");
    categoryP.textContent = product.category;
    categoryDiv.appendChild(categoryP);
    itemContainer.appendChild(categoryDiv);

    const stockDiv = document.createElement("div");
    stockDiv.classList.add("stock");
    const stockP = document.createElement("p");
    stockP.textContent = product.quantity + product.unit;
    stockDiv.appendChild(stockP);
    itemContainer.appendChild(stockDiv);

    const actionDiv = document.createElement("div");
    actionDiv.classList.add("action");

    const viewLink = document.createElement("a");
    viewLink.href = `./view-product.html?id=${product.id}`;
    const viewIcon = document.createElement("i");
    viewIcon.classList.add("fa-solid", "fa-eye");
    viewLink.appendChild(viewIcon);
    actionDiv.appendChild(viewLink);

    const editLink = document.createElement("a");
    editLink.href = `./edit-product.html?id=${product.id}`;
    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pencil");
    editLink.appendChild(editIcon);
    actionDiv.appendChild(editLink);

    const deleteLink = document.createElement("a");
    deleteLink.href = "#";
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash");
    deleteLink.appendChild(deleteIcon);
    actionDiv.appendChild(deleteLink);
    deleteLink.addEventListener("click", async (e) => {
        e.preventDefault();
        let promptVal = prompt(`Confirm Deleting ${product.name}? Y/N`);
        if (promptVal === "Y"  || promptVal === "y") {
            const response = await deleteProductFromApi(product.id);
            if (response.ok) {
                alert("Product deleted successfully!");
                products = await getDataFromApi("products");
                generateProductsUI(products);
            } else {
                alert("Failed to delete product.");
            }
        }
    })

    itemContainer.appendChild(actionDiv);

    return itemContainer;
}

function starterUI() {
    generateProductsUI(products);
}
starterUI();

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})