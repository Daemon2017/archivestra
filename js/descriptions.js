function getArchives() {
    var xhr = new XMLHttpRequest();
     xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var records = this.response;
            var archives = document.getElementById('archiveID');
            archives.innerHTML = "";
            archives.disabled = false;
            var opt = document.createElement('option');
            opt.innerHTML = "--Выберите архив--";
            archives.appendChild(opt);
            var funds = document.getElementById('fundID');
            funds.innerHTML = "";
            funds.disabled = true;
            var inventories = document.getElementById('inventoryID');
            inventories.innerHTML = "";
            inventories.disabled = true;
            var values = document.getElementById('valueID');
            values.innerHTML = "";
            values.disabled = true;
            var description = document.getElementById('descriptionID');
            description.value = "";
            for (const record of records) {
                var opt = document.createElement('option');
                opt.innerHTML = record;
                archives.appendChild(opt);
            }
        }
    }
    xhr.responseType = "json";
    xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_archive");
    xhr.send();
}

function getFunds() {
    if (document.getElementById("archiveID").selectedIndex != 0) {
        var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                var funds = document.getElementById('fundID');
                funds.innerHTML = "";
                funds.disabled = false;
                var opt = document.createElement('option');
                opt.innerHTML = "--Выберите фонд--";
                funds.appendChild(opt);
                var inventories = document.getElementById('inventoryID');
                inventories.innerHTML = "";
                inventories.disabled = true;
                var values = document.getElementById('valueID');
                values.innerHTML = "";
                values.disabled = true;
                var description = document.getElementById('descriptionID');
                description.value = "";
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    funds.appendChild(opt);
                }
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_fund");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById("archiveID").value;
        var json = JSON.stringify(object);
        xhr.send(json);
    } else {
       var funds = document.getElementById('fundID');
       funds.innerHTML = "";
       funds.disabled = true;
       var opt = document.createElement('option');
       opt.innerHTML = "";
       funds.appendChild(opt);
       var inventories = document.getElementById('inventoryID');
       inventories.innerHTML = "";
       inventories.disabled = true;
       var values = document.getElementById('valueID');
       values.innerHTML = "";
       values.disabled = true;
       var description = document.getElementById('descriptionID');
       description.value = "";
    }
}

function getInventories() {
    if (document.getElementById("fundID").selectedIndex != 0) {
        var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                var inventories = document.getElementById('inventoryID');
                inventories.innerHTML = "";
                inventories.disabled = false;
                var opt = document.createElement('option');
                opt.innerHTML = "--Выберите опись--";
                inventories.appendChild(opt);
                var values = document.getElementById('valueID');
                values.innerHTML = "";
                values.disabled = true;
                var description = document.getElementById('descriptionID');
                description.value = "";
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    inventories.appendChild(opt);
                }
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
    } else {
       var inventories = document.getElementById('inventoryID');
       inventories.innerHTML = "";
       inventories.disabled = true;
       var opt = document.createElement('option');
       opt.innerHTML = "";
       inventories.appendChild(opt);
       var values = document.getElementById('valueID');
       values.innerHTML = "";
       values.disabled = true;
       var description = document.getElementById('descriptionID');
       description.value = "";
    }
}

function getValues() {
    if (document.getElementById("inventoryID").selectedIndex != 0) {
        var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var records = this.response;
                var values = document.getElementById('valueID');
                values.innerHTML = "";
                values.disabled = false;
                var opt = document.createElement('option');
                opt.innerHTML = "--Выберите дело--";
                values.appendChild(opt);
                var description = document.getElementById('descriptionID');
                description.value = "";
                for (const record of records) {
                    var opt = document.createElement('option');
                    opt.innerHTML = record;
                    values.appendChild(opt);
                }
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
    } else {
       var values = document.getElementById('valueID');
       values.innerHTML = "";
       values.disabled = true;
       var opt = document.createElement('option');
       opt.innerHTML = "";
       values.appendChild(opt);
       var description = document.getElementById('descriptionID');
       description.value = "";
    }
}

function getDescription() {
    if (document.getElementById("valueID").selectedIndex != 0) {
        var xhr = new XMLHttpRequest();
         xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var record = this.response;
                var description = document.getElementById('descriptionID');
                description.value = record;
            }
        }
        xhr.responseType = "json";
        xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions_description");
        xhr.setRequestHeader("Content-Type", "application/json");
        var object = new Object();
        object.archive = document.getElementById("archiveID").value;
        object.fund = document.getElementById("fundID").value;
        object.inventory = document.getElementById("inventoryID").value;
        object.value = document.getElementById("valueID").value;
        var json = JSON.stringify(object);
        xhr.send(json);
    } else {
       var description = document.getElementById('descriptionID');
       description.value = "";
    }
}

function searchDescriptions() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = new TextDecoder().decode(this.response)
            var table = document.getElementById("resultsID");
            table.innerHTML = "";
            for (let row of CSV.parse(result)) {
                let tr = table.insertRow();
                for (let col of row) {
                    let td = tr.insertCell();
                    td.innerHTML = col;
                }
            }
        }
    }
    xhr.responseType = "arraybuffer";
    xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions");
    xhr.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.description = document.getElementById("requestID").value;
    var json = JSON.stringify(object);
    xhr.send(json);
}