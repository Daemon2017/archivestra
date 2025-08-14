const viewArchiveID = "viewArchiveID"
const viewFundID = "viewFundID"
const viewInventoryID = "viewInventoryID"
const viewValueID = "viewValueID"
const viewPageID = "viewPageID"
const viewShortID = "viewShortID"
const viewContentID = "viewContentID"

let isViewArchivesLoaded = false
let isViewFundsLoaded = false
let isViewInventoriesLoaded = false
let isViewValuesLoaded = false
let isViewPagesLoaded = false

function getViewArchives() {
    if (!isViewArchivesLoaded) {
        var archives = document.getElementById(viewArchiveID);
        archives.innerHTML = "";
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
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_archive");
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
    var pages = document.getElementById(viewPageID);
    pages.innerHTML = "";
    pages.disabled = true;
    var short = document.getElementById(viewShortID);
    short.value = "";
    var content = document.getElementById(viewContentID);
    content.innerHTML = "";
    isViewFundsLoaded = false;
    isViewInventoriesLoaded = false;
    isViewValuesLoaded = false;
    isViewPagesLoaded = false;
}

function getViewFunds() {
    if (!isViewFundsLoaded) {
        var funds = document.getElementById(viewFundID);
        funds.innerHTML = "";
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
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_fund");
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
    var pages = document.getElementById(viewPageID);
    pages.innerHTML = "";
    pages.disabled = true;
    var short = document.getElementById(viewShortID);
    short.value = "";
    var content = document.getElementById(viewContentID);
    content.innerHTML = "";
    isViewInventoriesLoaded = false;
    isViewValuesLoaded = false;
    isViewPagesLoaded = false;
}

function getViewInventories() {
    if (!isViewInventoriesLoaded) {
        var inventories = document.getElementById(viewInventoryID);
        inventories.innerHTML = "";
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
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_inventory");
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
    var pages = document.getElementById(viewPageID);
    pages.innerHTML = "";
    pages.disabled = true;
    var short = document.getElementById(viewShortID);
    short.value = "";
    var content = document.getElementById(viewContentID);
    content.innerHTML = "";
    isViewValuesLoaded = false;
    isViewPagesLoaded = false;
}

function getViewValues() {
    if (!isViewValuesLoaded) {
        var values = document.getElementById(viewValueID);
        values.innerHTML = "";
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
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_value");
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
    var pages = document.getElementById(viewPageID);
    pages.innerHTML = "";
    if (document.getElementById(viewValueID).selectedIndex != 0) {
        pages.disabled = false;
    } else {
        pages.disabled = true;
    }
    var short = document.getElementById(viewShortID);
    short.value = "";
    var content = document.getElementById(viewContentID);
    content.innerHTML = "";
    isViewPagesLoaded = false;
}

function getViewPages() {
    if (!isViewPagesLoaded) {
        var pages = document.getElementById(viewPageID);
        pages.innerHTML = "";
        var opt = document.createElement('option');
        opt.innerHTML = "Загрузка..."
        pages.appendChild(opt);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                pages.innerHTML = "";
                var opt = document.createElement('option');
                opt.innerHTML = "";
                pages.appendChild(opt);
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    pages.appendChild(opt);
                }
                isViewPagesLoaded = true;
                var short = document.getElementById(viewShortID);
                short.value = "";
                var content = document.getElementById(viewContentID);
                content.innerHTML = "";
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_page");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById(viewArchiveID).value;
        object.fund = document.getElementById(viewFundID).value;
        object.inventory = document.getElementById(viewInventoryID).value;
        object.value = document.getElementById(viewValueID).value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function setViewPage() {
    var short = document.getElementById(viewShortID);
    short.value = "Загрузка...";
    var xhrShort = new XMLHttpRequest();
    xhrShort.onreadystatechange = function() {
        if (xhrShort.readyState == 4 && xhrShort.status == 200) {
            var record = this.response;
            short.value = record;
        }
    }
    xhrShort.responseType = "json";
    xhrShort.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_short");
    xhrShort.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.archive = document.getElementById(viewArchiveID).value;
    object.fund = document.getElementById(viewFundID).value;
    object.inventory = document.getElementById(viewInventoryID).value;
    object.value = document.getElementById(viewValueID).value;
    object.page = document.getElementById(viewPageID).value;
    var json = JSON.stringify(object);
    xhrShort.send(json);
    var content = document.getElementById(viewContentID);
    var xhrContent = new XMLHttpRequest();
    xhrContent.onreadystatechange = function() {
        if (xhrContent.readyState == 4 && xhrContent.status == 200) {
            var record = this.response;
            content.innerHTML = record;
        }
    }
    xhrContent.responseType = "text";
    xhrContent.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_content");
    xhrContent.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.archive = document.getElementById(viewArchiveID).value;
    object.fund = document.getElementById(viewFundID).value;
    object.inventory = document.getElementById(viewInventoryID).value;
    object.value = document.getElementById(viewValueID).value;
    object.page = document.getElementById(viewPageID).value;
    var json = JSON.stringify(object);
    xhrContent.send(json);
}