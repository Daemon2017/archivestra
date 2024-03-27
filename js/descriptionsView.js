const viewArchiveID = "viewArchiveID"
const viewFundID = "viewFundID"
const viewInventoryID = "viewInventoryID"
const viewValueID = "viewValueID"
const viewDescriptionID = "viewDescriptionID"

let isViewArchivesLoaded = false
let isViewFundsLoaded = false
let isViewInventoriesLoaded = false
let isViewValuesLoaded = false

function getViewArchives() {
    if (!isViewArchivesLoaded) {
        var archives = document.getElementById(viewArchiveID);
        var opt = document.createElement('option');
        opt.innerHTML = "Загрузка...";
        archives.appendChild(opt);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                archives.innerHTML = "";
                var opt = document.createElement('option');
                opt.innerHTML = "";
                archives.appendChild(opt);
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    archives.appendChild(opt);
                }
                isViewArchivesLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_archive");
        xhr.send();
    }
}

function setViewArchive() {
    var funds = document.getElementById(viewFundID);
    funds.innerHTML = "";
    if (document.getElementById(viewArchiveID).selectedIndex != 0) {
        funds.disabled = false;
    } else {
        funds.disabled = true;
    }
    var inventories = document.getElementById(viewInventoryID);
    inventories.innerHTML = "";
    inventories.disabled = true;
    var values = document.getElementById(viewValueID);
    values.innerHTML = "";
    values.disabled = true;
    var description = document.getElementById(viewDescriptionID);
    description.value = "";
    isViewFundsLoaded = false;
    isViewInventoriesLoaded = false;
    isViewValuesLoaded = false;
}

function getViewFunds() {
    if (!isViewFundsLoaded) {
        var funds = document.getElementById(viewFundID);
        var opt = document.createElement('option');
        opt.innerHTML = "Загрузка..."
        funds.appendChild(opt);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                funds.innerHTML = "";
                var opt = document.createElement('option');
                opt.innerHTML = "";
                funds.appendChild(opt);
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    funds.appendChild(opt);
                }
                isViewFundsLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_fund");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById(viewArchiveID).value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function setViewFund() {
    var inventories = document.getElementById(viewInventoryID);
    inventories.innerHTML = "";
    if (document.getElementById(viewFundID).selectedIndex != 0) {
        inventories.disabled = false;
    } else {
        inventories.disabled = true
    }
    var values = document.getElementById(viewValueID);
    values.innerHTML = "";
    values.disabled = true;
    var description = document.getElementById(viewDescriptionID);
    description.value = "";
    isViewInventoriesLoaded = false;
    isViewValuesLoaded = false;
}

function getViewInventories() {
    if (!isViewInventoriesLoaded) {
        var inventories = document.getElementById(viewInventoryID);
        var opt = document.createElement('option');
        opt.innerHTML = "Загрузка..."
        inventories.appendChild(opt);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                inventories.innerHTML = "";
                var opt = document.createElement('option');
                opt.innerHTML = "";
                inventories.appendChild(opt);
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    inventories.appendChild(opt);
                }
                isViewInventoriesLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_inventory");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById(viewArchiveID).value;
        object.fund = document.getElementById(viewFundID).value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function setViewInventory() {
    var values = document.getElementById(viewValueID);
    values.innerHTML = "";
    if (document.getElementById(viewInventoryID).selectedIndex != 0) {
        values.disabled = false;
    } else {
        values.disabled = true;
    }
    var description = document.getElementById(viewDescriptionID);
    description.value = "";
    isViewValuesLoaded = false;
}

function getViewValues() {
    if (!isViewValuesLoaded) {
        var values = document.getElementById(viewValueID);
        var opt = document.createElement('option');
        opt.innerHTML = "Загрузка..."
        values.appendChild(opt);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                values.innerHTML = "";
                var opt = document.createElement('option');
                opt.innerHTML = "";
                values.appendChild(opt);
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    values.appendChild(opt);
                }
                isViewValuesLoaded = true;
                var description = document.getElementById(viewDescriptionID);
                description.value = "";
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_value");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById(viewArchiveID).value;
        object.fund = document.getElementById(viewFundID).value;
        object.inventory = document.getElementById(viewInventoryID).value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function setViewValue() {
    var description = document.getElementById(viewDescriptionID);
    description.value = "Загрузка...";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var record = this.response;
            description.value = record;
        }
    }
    xhr.responseType = "json";
    xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_description");
    xhr.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.archive = document.getElementById(viewArchiveID).value;
    object.fund = document.getElementById(viewFundID).value;
    object.inventory = document.getElementById(viewInventoryID).value;
    object.value = document.getElementById(viewValueID).value;
    var json = JSON.stringify(object);
    xhr.send(json);
}