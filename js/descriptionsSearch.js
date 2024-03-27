const searchResultsID = "searchResultsID"
const searchPagesID = "searchPagesID"
const searchRequestID = "searchRequestID"

let selectedSearchPage = 0

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
    xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions");
    xhr.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.description = document.getElementById(searchRequestID).value;
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
    xhr.open("POST", "https://bba2usld8315kgujg51n.containers.yandexcloud.net/descriptions");
    xhr.setRequestHeader("Content-Type", "application/json");
    var object = new Object();
    object.description = document.getElementById(searchRequestID).value;
    object.page = document.getElementById(searchPagesID).value;
    selectedSearchPage = document.getElementById(searchPagesID).value;
    var json = JSON.stringify(object);
    xhr.send(json);
}