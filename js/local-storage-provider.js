function getStorageItem(key) {
    let item = JSON.parse(localStorage.getItem(key)) || [];
    return item;
}

function setStorageItem(key, valueObject) {
    localStorage.setItem(key, JSON.stringify(valueObject));
}