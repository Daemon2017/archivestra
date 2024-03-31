const searchArchiveID = "searchArchiveID"
const searchFundID = "searchFundID"
const searchInventoryID = "searchInventoryID"

let isSearchArchivesLoaded = false
let isSearchFundsLoaded = false
let isSearchInventoriesLoaded = false

const searchRequestID = "searchRequestID"
const searchButtonID = "searchButtonID"
const searchResultsID = "searchResultsID"
const searchCurrentPagesID = "searchCurrentPagesID"

let selectedSearchCurrentPage = 0

function main() {
    const input = document.getElementById(searchRequestID);

    input.addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById(searchButtonID).click();
      }
    });
};

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
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_archive");
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
    isSearchFundsLoaded = false;
    isSearchInventoriesLoaded = false;
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
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_fund");
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
    isSearchInventoriesLoaded = false;
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
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_inventory");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById(searchArchiveID).value;
        object.fund = document.getElementById(searchFundID).value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function getSearchDescriptions() {
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
            var pages = document.getElementById(searchCurrentPagesID);
            pages.innerHTML = "";
            for (let i = 1; i <= result.pages; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = i;
                pages.appendChild(opt);
            }
            selectedSearchCurrentPage = 1;
        }
    }
    xhr.responseType = "arraybuffer";
    xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions");
    xhr.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.description = document.getElementById(searchRequestID).value;
    object.archive = document.getElementById(searchArchiveID).value;
    object.fund = document.getElementById(searchFundID).value;
    object.inventory = document.getElementById(searchInventoryID).value;
    var json = JSON.stringify(object);
    xhr.send(json);
}

function setSearchCurrentPage() {
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
            var pages = document.getElementById(searchCurrentPagesID);
            pages.innerHTML = "";
            for (let i = 1; i <= result.pages; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = i;
                if (i == selectedSearchCurrentPage) {
                    opt.selected = true;
                }
                pages.appendChild(opt);
            }
        }
    }
    xhr.responseType = "arraybuffer";
    xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions");
    xhr.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.description = document.getElementById(searchRequestID).value;
    object.archive = document.getElementById(searchArchiveID).value;
    object.fund = document.getElementById(searchFundID).value;
    object.inventory = document.getElementById(searchInventoryID).value;
    object.currentPage = document.getElementById(searchCurrentPagesID).value;
    selectedSearchCurrentPage = document.getElementById(searchCurrentPagesID).value;
    var json = JSON.stringify(object);
    xhr.send(json);
}