export const loggedInUser = localStorage.getItem("loggedInUser");

export let checkIfUserLoggedIn = () => {
    if (loggedInUser) {
        return true;
    } else {
        window.location.href = "/login.html";
    }
}
export let isUserLoggedIn = () => {
    if (loggedInUser) {
        return true;
    } else {
        return false;
    }
}

let availableCards = [];
let renderedCards = [];

export let initializeCards = (allCards) => {
    const savedData = localStorage.getItem("cardArrangement");
    if (savedData) {
        const { available, rendered } = JSON.parse(savedData);
        availableCards = available.map(id => allCards.find(c => c.id === id)).filter(Boolean);
        renderedCards = rendered.map(id => allCards.find(c => c.id === id)).filter(Boolean);
    } else {
        availableCards = [...allCards];
        renderedCards = [];
    }
    return {
        availableCards, renderedCards
    };
}

export function saveArrangement() {
    const data = {
        available: availableCards.map(card => card.id),
        rendered: renderedCards.map(card => card.id)
    };
    localStorage.setItem("cardArrangement", JSON.stringify(data));
}

export function moveCard(allCards, cardId, targetList) {
    const cardData = allCards.find(c => c.id === cardId);
    if (!cardData) return;

    if (targetList === "available") {
        if (!availableCards.find(c => c.id === cardId)) {
            availableCards.push(cardData);
            renderedCards = renderedCards.filter(c => c.id !== cardId);
        }
    } else if (targetList === "rendered") {
        if (!renderedCards.find(c => c.id === cardId)) {
            renderedCards.push(cardData);
            availableCards = availableCards.filter(c => c.id !== cardId);
        }
    }
    saveArrangement();
}