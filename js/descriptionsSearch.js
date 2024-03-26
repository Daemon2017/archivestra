let selectedPage = 0

function searchDescriptions() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(new TextDecoder().decode(this.response));
            var table = document.getElementById("resultsID");
            table.innerHTML = "";
            for (let row of CSV.parse(result.body)) {
                let tr = table.insertRow();
                for (let col of row) {
                    let td = tr.insertCell();
                    td.innerHTML = col;
                }
            }
            var pages = document.getElementById("pagesID");
            pages.innerHTML = "";
            for (let i = 1; i <= result.pages; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = i;
                pages.appendChild(opt);
            }
            selectedPage = 1;
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

function setPage() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            var result = JSON.parse(new TextDecoder().decode(this.response));
            var table = document.getElementById("resultsID");
            table.innerHTML = "";
            for (let row of CSV.parse(result.body)) {
                let tr = table.insertRow();
                for (let col of row) {
                    let td = tr.insertCell();
                    td.innerHTML = col;
                }
            }
            var pages = document.getElementById("pagesID");
            pages.innerHTML = "";
            for (let i = 1; i <= result.pages; i++) {
                var opt = document.createElement('option');
                opt.innerHTML = i;
                if (i == selectedPage) {
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
    object.description = document.getElementById("requestID").value;
    object.page = document.getElementById("pagesID").value;
    selectedPage = document.getElementById("pagesID").value;
    var json = JSON.stringify(object);
    xhr.send(json);
}