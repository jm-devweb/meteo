/**  Display Last Measure                       **/
document.getElementById('last').addEventListener('click', function () {
    clear("data");

    const last = document.createElement('div');
    data.appendChild(last);
    last.setAttribute("id", "lastmeasure");
    getData("http://192.168.1.197:8080/last-measure", printBox, "Dernière mesures du : ", "lastmeasure");
});

/**  Display Top Measure                        **/
document.getElementById('top').addEventListener('click', function () {
    clear("data");

    const allTop = [{humidity: "Top humidité le : "}, {pressure: "Top pression le : "}, {temperature: "Top température le : "}];
    const top = document.createElement('div');
    data.appendChild(top);
    top.setAttribute("id", "top");
    top.classList.add("top");

    for (var i = 0; i < allTop.length; i++) {
        var currentTop = allTop[i];
        const newTop = document.createElement('div');
        for (var key in currentTop) {
            let measure = key;
            let libelle = currentTop[key];
            newTop.setAttribute("id", measure);
            top.appendChild(newTop);
            getData("http://192.168.1.197:8080/top-measure/" + measure, printBox, libelle, measure);
        }
    }
});

/**  Display Table Measure                      **/
document.getElementById('table').addEventListener('click', function () {
    clear("data");

    const all = document.createElement('div');
    data.appendChild(all);
    all.setAttribute("id", "all");

    const dateMeasure = document.createElement('div');
    dateMeasure.classList.add("top");
    all.appendChild(dateMeasure);

    const start = document.createElement('label');
    start.innerText = "Start date:";
    dateMeasure.appendChild(start);
    var dstart = document.createElement("input");
    dstart.setAttribute("id", "dstart");
    dstart.type = "date";
    dateMeasure.appendChild(dstart);

    const end = document.createElement('label');
    end.innerText = "End date:";
    dateMeasure.appendChild(end);
    var dend = document.createElement("input");
    dend.type = "date";
    dend.setAttribute("id", "dend");
    dateMeasure.appendChild(dend);

    const btUpdate = document.createElement('button');
    btUpdate.innerText = "Mettre à jour";
    dateMeasure.appendChild(btUpdate);

    const result = document.createElement('div');
    result.classList.add("box");
    all.appendChild(result);

    const table = document.createElement('table');
    const header = document.createElement('thead');
    result.appendChild(table);
    table.classList.add("table");
    table.appendChild(header);

    const date = document.createElement('th');
    date.innerText = "Date";
    header.appendChild(date);
    const temperature = document.createElement('th');
    temperature.innerText = "Température (°C)";
    header.appendChild(temperature);
    const humidity = document.createElement('th');
    humidity.innerText = "Humidité (%hum)";
    header.appendChild(humidity);
    const pressure = document.createElement('th');
    pressure.innerText = "Pression (hPa)";
    header.appendChild(pressure);

    const tbody = document.createElement('tbody');
    tbody.setAttribute("id", "tbody");
    table.appendChild(tbody);

    btUpdate.addEventListener('click', function () {
        clear("tbody");

        const startDate = document.getElementById("dstart");
        const endDate = document.getElementById("dend");

        var start = startDate.value ;
        var end = endDate.value ;

        if (start == "" ) {
            start = new Date().toISOString().slice(0, 10) ;
        }

        if (end == "" ) {
            end = new Date().toISOString().slice(0, 10) ;
        }

        const rTable = new XMLHttpRequest();

 // Open a new connection, using the GET request on the URL endpoint
        rTable.open('GET', `http://192.168.1.197:8080/measure/date?startDate=`+start+`&endDate=`+end, true);

        rTable.onload = function () {
            if (rTable.status >= 200 && rTable.status < 400) {
                var measure = JSON.parse(this.response);
                for (var i = 0; i < measure.length; i++) {
                    var obj = measure[i];
                    const newRow = document.createElement('tr');
                    tbody.appendChild(newRow);
                    printRow(obj, newRow)
                }
            } else {
                console.log('Erreur ...')
            }
        };
        rTable.send();
    });
});

/**  Display Graph                              **/
document.getElementById('graph').addEventListener('click', function () {
    clear("data");
});

/**  clear div                              **/
function clear(div) {
    const obj = document.getElementById(div);
    if (obj.children.length > 0) {
        while (obj.firstChild) {
            obj.firstChild.remove();
        }
    }
}

/**  get data from server                       **/
function getData(url, doIt, libelle, box) {
    const request = new XMLHttpRequest();

// Open a new connection, using the GET request on the URL endpoint
    request.open('GET', url, true);

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            doIt(JSON.parse(this.response), libelle, box);
        } else {
            console.log('Erreur ...')
        }
    };
    // Send request
    request.send();
}

/**  Print data (use  by Last and ands Measure) **/
function printBox(measure, libelle, box) {
    const theBox = document.getElementById(box);
    theBox.classList.add("box");
    for (var key in measure) {
        if (key != "id") {
            const newMeasure = document.createElement('div');
            switch (key) {
                case "measureDate" :
                    let date = new Date(measure[key]);
                    newMeasure.innerText = libelle + date.toLocaleDateString("fr-FR");
                    break;
                case "temperature" :
                    newMeasure.innerText = "Températures : " + measure[key] + "° C";
                    break;
                case "humidity" :
                    newMeasure.innerText = "Humidité : " + measure[key] + "% hum";
                    break;
                case "pressure" :
                    newMeasure.innerText = "Pression : " + measure[key] + " hPa";
                    break;
            }
            theBox.appendChild(newMeasure);
        }
    }
}

/**  Print row  **/
function printRow(measure, tr) {
    for (var key in measure) {
        if (key != "id") {
            const newMeasure = document.createElement('td');
            switch (key) {
                case "measureDate" :
                    let date = new Date(measure[key]);
                    newMeasure.innerText = date.toLocaleString("fr-FR");
                    break;
                default :
                    newMeasure.innerText = measure[key];
                    break;
            }
            tr.appendChild(newMeasure);
        }
    }
}