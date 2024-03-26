let isArchivesLoaded = false
let isFundsLoaded = false
let isInventoriesLoaded = false
let isValuesLoaded = false

function getArchives() {
    if (!isArchivesLoaded) {
        var archives = document.getElementById('archiveID');
        var opt = document.createElement('option');
        opt.innerHTML = "Загрузка...";
        archives.appendChild(opt);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                archives.innerHTML = "";
                var opt = document.createElement('option');
                opt.innerHTML = "--Выберите архив--";
                archives.appendChild(opt);
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    archives.appendChild(opt);
                }
                isArchivesLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_archive");
        xhr.send();
    }
}

function setArchive() {
    var funds = document.getElementById('fundID');
    funds.innerHTML = "";
    if (document.getElementById("archiveID").selectedIndex != 0) {
        funds.disabled = false;
    } else {
        funds.disabled = true;
    }
    var inventories = document.getElementById('inventoryID');
    inventories.innerHTML = "";
    inventories.disabled = true;
    var values = document.getElementById('valueID');
    values.innerHTML = "";
    values.disabled = true;
    var description = document.getElementById('descriptionID');
    description.value = "";
    isFundsLoaded = false;
    isInventoriesLoaded = false;
    isValuesLoaded = false;
}

function getFunds() {
    if (!isFundsLoaded) {
        var funds = document.getElementById('fundID');
        var opt = document.createElement('option');
        opt.innerHTML = "Загрузка..."
        funds.appendChild(opt);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                funds.innerHTML = "";
                var opt = document.createElement('option');
                opt.innerHTML = "--Выберите фонд--";
                funds.appendChild(opt);
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    funds.appendChild(opt);
                }
                isFundsLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_fund");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById("archiveID").value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function setFund() {
    var inventories = document.getElementById('inventoryID');
    inventories.innerHTML = "";
    if (document.getElementById("fundID").selectedIndex != 0) {
        inventories.disabled = false;
    } else {
        inventories.disabled = true
    }
    var values = document.getElementById('valueID');
    values.innerHTML = "";
    values.disabled = true;
    var description = document.getElementById('descriptionID');
    description.value = "";
    isInventoriesLoaded = false;
    isValuesLoaded = false;
}

function getInventories() {
    if (!isInventoriesLoaded) {
        var inventories = document.getElementById('inventoryID');
        var opt = document.createElement('option');
        opt.innerHTML = "Загрузка..."
        inventories.appendChild(opt);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                inventories.innerHTML = "";
                var opt = document.createElement('option');
                opt.innerHTML = "--Выберите опись--";
                inventories.appendChild(opt);
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    inventories.appendChild(opt);
                }
                isInventoriesLoaded = true;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_inventory");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById("archiveID").value;
        object.fund = document.getElementById("fundID").value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function setInventory() {
    var values = document.getElementById('valueID');
    values.innerHTML = "";
    if (document.getElementById("inventoryID").selectedIndex != 0) {
        values.disabled = false;
    } else {
        values.disabled = true;
    }
    var description = document.getElementById('descriptionID');
    description.value = "";
    isValuesLoaded = false;
}

function getValues() {
    if (!isValuesLoaded) {
        var values = document.getElementById('valueID');
        var opt = document.createElement('option');
        opt.innerHTML = "Загрузка..."
        values.appendChild(opt);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                values.innerHTML = "";
                var opt = document.createElement('option');
                opt.innerHTML = "--Выберите дело--";
                values.appendChild(opt);
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    values.appendChild(opt);
                }
                isValuesLoaded = true;
                var description = document.getElementById('descriptionID');
                description.value = "";
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_value");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById("archiveID").value;
        object.fund = document.getElementById("fundID").value;
        object.inventory = document.getElementById("inventoryID").value;
        var json = JSON.stringify(object);
        xhr.send(json);
    }
}

function setValue() {
    var description = document.getElementById('descriptionID');
    description.value = "";
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var record = this.response;
            var description = document.getElementById('descriptionID');
            description.value = record;
        }
    }
    xhr.responseType = "json";
    xhr.open("POST", "http://localhost:8080/descriptions_description");
    xhr.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.archive = document.getElementById("archiveID").value;
    object.fund = document.getElementById("fundID").value;
    object.inventory = document.getElementById("inventoryID").value;
    object.value = document.getElementById("valueID").value;
    var json = JSON.stringify(object);
    xhr.send(json);
}