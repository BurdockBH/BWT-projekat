function posaljiStudent(studentObjekat, callback) {
    axios.post("/student", studentObjekat).then((res) => {
        callback(null, res.data.status);
    }).catch((err) => {
        callback(err.response.data.status, null);
    })
}

function posaljiPredmet(predmetObjekat, callback) {
    axios.post("/predmet", predmetObjekat).then((res) => {
        callback(null, res.data.status);
    }).catch((err) => {
        callback(err, null);
    })
}

function posaljiPrisustvo(predmetPrisustvo, callback) {
    axios.post("/prisustvo", predmetPrisustvo).then((res) => {
        callback(null, res.data.status);
    }).catch((err) => {
        callback(err, null);
    })
}

function dajPrisustvo(kodPredmeta, indexStudenta, sedmica, callback) {
    axios.get(`/prisustvo`, {
        params: {
            kodPredmeta: kodPredmeta,
            indexStudenta: indexStudenta,
            sedmica: sedmica
        }
    }).then((res) => {
        callback(null, res.data);
    }).catch((err) => {
        callback(err, null);
    })
}


function handlePredmet(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    posaljiPredmet(value, (error, data) => {
        if (error) {
            document.getElementById("kod").style.borderColor = 'red';
            document.getElementById('poruka').innerHTML = error.response.data.status;
            return;
        }

        document.getElementById("kod").style.borderColor = 'green';
        document.getElementById('poruka').innerHTML = data;
    });
}

function handlePrisustvo(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    dajPrisustvo(value.kodPredmeta, value.indexStudenta, value.sedmica, (error, data) => {

        if (error) {
            document.getElementById("kodPredmeta").style.borderColor = 'red';
            document.getElementById("indexStudenta").style.borderColor = 'red';
            document.getElementById("sedmica").style.borderColor = 'red';
            document.getElementById('poruka').innerHTML = error.response.data.status;
            return;
        }

        document.getElementById("kodPredmeta").style.borderColor = 'black';
        document.getElementById("indexStudenta").style.borderColor = 'black';
        document.getElementById("sedmica").style.borderColor = 'black';
        document.getElementById('poruka').innerHTML = " ";

        let tabela =
            `<table><tr><td>Prisustvo za sedmicu: </td><td>${data.prisustvoZaSedmicu}</td></tr>` +
            `<tr><td>Prisutan</td><td>${data.prisutan}</td></tr>` +
            `<tr><td>Odsutan</td><td>${data.odsutan}</td></tr>` +
            `<tr><td>nijeUneseno</td><td>${data.nijeUneseno}</td></tr>` +
            `</table>`;

        document.getElementById('prisustvo-tabela').innerHTML = tabela;
    });
}



