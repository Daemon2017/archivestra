const searchArchiveID = "searchArchiveID"
const searchFundID = "searchFundID"
const searchInventoryID = "searchInventoryID"
const searchValueID = "searchValueID"

let isSearchArchivesLoaded = false
let isSearchFundsLoaded = false
let isSearchInventoriesLoaded = false
let isSearchValuesLoaded = false

const searchRequestID = "searchRequestID"
const searchResultsID = "searchResultsID"
const searchPagesID = "searchPagesID"

let selectedSearchPage = 0

function getSearchArchives() {
    if (!isSearchArchivesLoaded) {
        var archives = document.getElementById(searchArchiveID);
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
                isSearchArchivesLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_archive");
        xhr.send();
    }
}

function setSearchArchive() {
    var funds = document.getElementById(searchFundID);
    funds.innerHTML = "";
    if (document.getElementById(searchArchiveID).selectedIndex != 0) {
        funds.disabled = false;
    } else {
        funds.disabled = true;
    }
    var inventories = document.getElementById(searchInventoryID);
    inventories.innerHTML = "";
    inventories.disabled = true;
    var values = document.getElementById(searchValueID);
    values.innerHTML = "";
    values.disabled = true;
    isSearchFundsLoaded = false;
    isSearchInventoriesLoaded = false;
    isSearchValuesLoaded = false;
}

function getSearchFunds() {
    if (!isSearchFundsLoaded) {
        var funds = document.getElementById(searchFundID);
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
                isSearchFundsLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_fund");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById(searchArchiveID).value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function setSearchFund() {
    var inventories = document.getElementById(searchInventoryID);
    inventories.innerHTML = "";
    if (document.getElementById(searchFundID).selectedIndex != 0) {
        inventories.disabled = false;
    } else {
        inventories.disabled = true
    }
    var values = document.getElementById(searchValueID);
    values.innerHTML = "";
    values.disabled = true;
    isSearchInventoriesLoaded = false;
    isSearchValuesLoaded = false;
}

function getSearchInventories() {
    if (!isSearchInventoriesLoaded) {
        var inventories = document.getElementById(searchInventoryID);
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
                isSearchInventoriesLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_inventory");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById(searchArchiveID).value;
        object.fund = document.getElementById(searchFundID).value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function setSearchInventories() {
    var values = document.getElementById(searchValueID);
    values.innerHTML = "";
    if (document.getElementById(searchInventoryID).selectedIndex != 0) {
        values.disabled = false;
    } else {
        values.disabled = true
    }
    isSearchValuesLoaded = false;
}

function getSearchValues() {
    if (!isSearchValuesLoaded) {
        var values = document.getElementById(searchValueID);
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
                isSearchValuesLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents_value");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById(searchArchiveID).value;
        object.fund = document.getElementById(searchFundID).value;
        object.inventory = document.getElementById(searchInventoryID).value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function getSearchContents() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(new TextDecoder().decode(this.response));
            var table = document.getElementById(searchResultsID);
            table.innerHTML = "";
            for (let row of CSV.parse(result.body)) {
                let tr = table.insertRow();
                for (let col of row) {
                    let td = tr.insertCell();
                    td.innerHTML = col;
                }
            }
            var pages = document.getElementById(searchPagesID);
            pages.innerHTML = "";
            for (let i = 1; i <= result.pages; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = i;
                pages.appendChild(opt);
            }
            selectedSearchPage = 1;
        }
    }
    xhr.responseType = "arraybuffer";
    xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents");
    xhr.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.short = document.getElementById(searchRequestID).value;
    object.archive = document.getElementById(searchArchiveID).value;
    object.fund = document.getElementById(searchFundID).value;
    object.inventory = document.getElementById(searchInventoryID).value;
    object.value = document.getElementById(searchValueID).value;
    var json = JSON.stringify(object);
    xhr.send(json);
}

function setSearchPage() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(new TextDecoder().decode(this.response));
            var table = document.getElementById(searchResultsID);
            table.innerHTML = "";
            for (let row of CSV.parse(result.body)) {
                let tr = table.insertRow();
                for (let col of row) {
                    let td = tr.insertCell();
                    td.innerHTML = col;
                }
            }
            var pages = document.getElementById(searchPagesID);
            pages.innerHTML = "";
            for (let i = 1; i <= result.pages; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = i;
                if (i == selectedSearchPage) {
                    opt.selected = true;
                }
                pages.appendChild(opt);
            }
        }
    }
    xhr.responseType = "arraybuffer";
    xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/contents");
    xhr.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.short = document.getElementById(searchRequestID).value;
    object.archive = document.getElementById(searchArchiveID).value;
    object.fund = document.getElementById(searchFundID).value;
    object.inventory = document.getElementById(searchInventoryID).value;
    object.value = document.getElementById(searchValueID).value;
    object.page = document.getElementById(searchPagesID).value;
    selectedSearchPage = document.getElementById(searchPagesID).value;
    var json = JSON.stringify(object);
    xhr.send(json);
}