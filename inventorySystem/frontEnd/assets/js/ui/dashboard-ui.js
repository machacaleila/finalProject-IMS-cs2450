import { getDataFromApi } from '../service.js';
import { loggedInUser, checkIfUserLoggedIn, initializeCards, moveCard } from '../domain.js';

checkIfUserLoggedIn();

let products = await getDataFromApi("products");
let sales = await getDataFromApi("sales");
let purchases = await getDataFromApi("purchases");

let totalProducts = document.getElementById("totalProducts");
totalProducts.textContent = products.length;

let totalSales = document.getElementById("totalSales");
totalSales.textContent = sales.length;

let totalPurchases = document.getElementById("totalPurchases");
totalPurchases.textContent = purchases.length;

//drag and drop for cards
const rearrangeCheckbox = document.getElementById("rearrange-cards");
const cardListSection = document.querySelector("aside.card-list");
const renderListSection = document.querySelector(".render-list");

// data for the cards
let allCards = [
    { id: "card-product", title: "Add new Product", link: "./add-product.html" },
    { id: "card-purchase", title: "Add new Purchase", link: "./add-purchase.html" },
    { id: "card-sale", title: "Add new Sale", link: "./add-sale.html" },
    { id: "card-category", title: "Add new Category", link: "./add-category.html" },
    { id: "card-customer", title: "Add new Customer", link: "./add-customer.html" }
];

let isDraggableEnabled = false;
// checkbox toggling the drag-and-drop
rearrangeCheckbox.addEventListener("change", (e) => {
    cardListSection.classList.toggle("d-none");
    cardListSection.classList.toggle("drag-and-drop-on");
    renderListSection.classList.toggle("drag-and-drop-on");
    if (e.target.checked) {
        isDraggableEnabled = true;
    } else {
        isDraggableEnabled = false;
    }
    let updatedCards = initializeCards(allCards);
    renderCards(updatedCards.availableCards, updatedCards.renderedCards);
});

const generateCard = (cardData, isDraggableEnabled) => {
    const cardItem = document.createElement("div");
    cardItem.className = "card-item";
    cardItem.setAttribute("id", cardData.id);

    if (isDraggableEnabled) {
        cardItem.setAttribute("draggable", "true")
    }

    const link = document.createElement("a");
    link.setAttribute("href", cardData.link);

    const cardInner = document.createElement("div");
    cardInner.className = "card card-inner p-5";

    const icon = document.createElement("i");
    icon.className = "fa-solid fa-plus";

    const title = document.createElement("h6");
    title.textContent = cardData.title;

    cardInner.appendChild(icon);
    cardInner.appendChild(title);
    link.appendChild(cardInner);
    cardItem.appendChild(link);

    // Drag events
    if (isDraggableEnabled) {
        cardItem.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", cardData.id);
        });
    }

    return cardItem;
}

const renderCards = (availableCards, renderedCards) => {
    const cardList = document.querySelector("aside.card-list .d-flex");
    const renderList = document.querySelector(".render-list .d-flex");
    cardList.innerHTML = "";
    renderList.innerHTML = "";

    availableCards.forEach(card => cardList.appendChild(generateCard(card, isDraggableEnabled)));
    renderedCards.forEach(card => renderList.appendChild(generateCard(card, isDraggableEnabled)));
}

const setupDropZones = () => {
    [cardListSection, renderListSection].forEach(container => {
        container.addEventListener("dragover", (e) => {
            e.preventDefault();
            container.classList.add("red-border");
        });

        container.addEventListener("dragleave", (e) => {
            container.classList.remove("red-border");
        });

        container.addEventListener("drop", (e) => {
            e.preventDefault();
            container.classList.remove("red-border");
            const cardId = e.dataTransfer.getData("text/plain");

            const isCardListSection = container === cardListSection;
            const targetList = isCardListSection ? "available" : "rendered";

            moveCard(allCards, cardId, targetList);
            let updatedCards = initializeCards(allCards);
            renderCards(updatedCards.availableCards, updatedCards.renderedCards); // Always re-render after move
        });
    });
}

// Cards for two sections
let cardsData = initializeCards(allCards);
let availableCards = cardsData.availableCards;
let renderedCards = cardsData.renderedCards;

//showing initial cards
renderCards(availableCards, renderedCards);
setupDropZones();

// For Low Stocks and Expiration
const lowStockLimit = 10;
const expirayDaysLimit = 14;

const today = new Date();

const lowStockProducts = products.filter(product => product.quantity <= lowStockLimit);

const expiringOrExpiredProducts = products.filter(product => {
    if (!product.expiryDate) return false; //not expirable
    const expiryDate = new Date(product.expiryDate.split("T")[0]);
    const timeDifference = expiryDate - today;
    const daysUntilExpiry = timeDifference / (1000 * 60 * 60 * 24);

    return daysUntilExpiry <= expirayDaysLimit;
}).sort((a, b) => {
    const dateA = new Date(a.expiryDate.split("T")[0]);
    const dateB = new Date(b.expiryDate.split("T")[0]);
    return dateA - dateB; // earlier expiry comes first
});

const lowStockSection = document.getElementById("low-stock-section");
const lowStockList = document.getElementById("low-stock-list");

let generateLowStockCard = (product) => {
    const item = document.createElement("div");
    item.className = "col-md-4";

    const card = document.createElement("div");
    card.className = "low-stock-card";
    card.setAttribute("data-aos", "zoom-in");

    const link = document.createElement("a");
    link.setAttribute("href", `./view-product.html?id=${product.id}`);

    const title = document.createElement("h5");
    title.textContent = product.name;
    link.appendChild(title);

    const category = document.createElement("p");
    category.textContent = `Category: ${product.category}`;
    link.appendChild(category);

    const quantity = document.createElement("p");
    quantity.textContent = "Stock Left: ";

    const quantityBadge = document.createElement("span");
    quantityBadge.className = "badge";
    quantityBadge.textContent = `${product.quantity} ${product.unit}`;

    quantity.appendChild(quantityBadge);
    link.appendChild(quantity);

    const supplier = document.createElement("p");
    supplier.textContent = `Supplier: ${product.supplier}`;
    link.appendChild(supplier);

    card.appendChild(link);
    item.appendChild(card);

    return item;
};

// low stock items showing
if (lowStockProducts.length > 0) {
    lowStockList.replaceChildren();
    lowStockProducts.forEach(p => {
        const card = generateLowStockCard(p);
        lowStockList.appendChild(card);
    });
    lowStockSection.classList.remove("d-none");
}

// expiring/ed section
const expirySection = document.getElementById("expiring-soon-section");
const expiryList = document.getElementById("expiring-soon-list");

let generateExpiringCard = (product) => {
    const col = document.createElement("div");
    col.className = "col-md-4";

    const card = document.createElement("div");
    card.className = "expiring-card";
    card.setAttribute("data-aos", "zoom-in");

    const link = document.createElement("a");
    link.setAttribute("href", `./view-product.html?id=${product.id}`);

    const title = document.createElement("h5");
    title.textContent = product.name;
    link.appendChild(title);

    const category = document.createElement("p");
    category.textContent = `Category: ${product.category}`;
    link.appendChild(category);

    const expiry = document.createElement("p");
    expiry.textContent = "Expires/ed on: ";

    const formattedDate = product.expiryDate?.split("T")[0] || "N/A";
    const expiryBadge = document.createElement("span");
    expiryBadge.className = "badge";
    expiryBadge.textContent = formattedDate;

    expiry.appendChild(expiryBadge);
    link.appendChild(expiry);

    const supplier = document.createElement("p");
    supplier.textContent = `Supplier: ${product.supplier}`;
    link.appendChild(supplier);

    card.appendChild(link);
    col.appendChild(card);

    return col;
};


// generating the UI
if (expiringOrExpiredProducts.length > 0) {
    expiryList.replaceChildren();
    expiringOrExpiredProducts.forEach(p => {
        const card = generateExpiringCard(p);
        expiryList.appendChild(card);
    });
    expirySection.classList.remove("d-none");
}

//logout
let logOutBtn = document.querySelector('.log-out');
logOutBtn.addEventListener("click", e => {
    localStorage.removeItem("loggedInUser");
    window.location.href = "/login.html";
})

//username 
let userNameEle = document.getElementById("user-name");
userNameEle.textContent = loggedInUser;
let userGreetingNameEle = document.getElementById("user-greeting-name");
userGreetingNameEle.textContent = loggedInUser;

// For the AOS
AOS.init();


// For Full Screen Toggle
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
