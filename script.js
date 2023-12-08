let resources = 0;
let autoGatherRate = 0;
let clickValue = 1;
let autoGatherCost = 50;
let clickUpgradeCost = 25;
let db;

// Initialize IndexedDB
let dbRequest = indexedDB.open('moonClickerDB', 1);

dbRequest.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore('gameState', { keyPath: 'id' });
};

dbRequest.onsuccess = function(event) {
    db = event.target.result;
    loadGame();
};

dbRequest.onerror = function(event) {
    console.log('Error opening database.', event);
};

// Load Game State from IndexedDB
function loadGame() {
    let transaction = db.transaction(['gameState']);
    let objectStore = transaction.objectStore('gameState');
    let request = objectStore.get(1);

    request.onsuccess = function(event) {
        if (request.result) {
            resources = request.result.resources;
            autoGatherRate = request.result.autoGatherRate;
            clickValue = request.result.clickValue;
            autoGatherCost = request.result.autoGatherCost;
            clickUpgradeCost = request.result.clickUpgradeCost;
            updateDisplay();
        }
    };
}

// Save Game State to IndexedDB
function saveGameState() {
    let transaction = db.transaction(['gameState'], 'readwrite');
    let objectStore = transaction.objectStore('gameState');
    let gameState = { id: 1, resources, autoGatherRate, clickValue, autoGatherCost, clickUpgradeCost };
    objectStore.put(gameState);
}

function updateDisplay() {
    document.getElementById('resource-counter').innerText = `Resources: ${resources}`;
    document.getElementById('auto-gather-cost').innerText = `Cost: ${autoGatherCost}`;
    document.getElementById('click-upgrade-cost').innerText = `Cost: ${clickUpgradeCost}`;
}

document.getElementById('moon-clicker').addEventListener('click', function() {
    resources += clickValue;
    updateDisplay();
    saveGameState();
});

document.getElementById('buy-auto-gather').addEventListener('click', function() {
    if (resources >= autoGatherCost) {
        resources -= autoGatherCost;
        autoGatherRate++;
        autoGatherCost *= 2;
        updateDisplay();
        saveGameState();
    }
});

document.getElementById('buy-click-upgrade').addEventListener('click', function() {
    if (resources >= clickUpgradeCost) {
        resources -= clickUpgradeCost;
        clickValue++;
        clickUpgradeCost *= 2;
        updateDisplay();
        saveGameState();
    }
});

setInterval(function() {
    resources += autoGatherRate;
    updateDisplay();
    saveGameState();
}, 100);

// Initial display update
updateDisplay();
