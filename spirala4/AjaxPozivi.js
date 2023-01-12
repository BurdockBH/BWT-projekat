function posaljiStudent(studentObjekat, callback) {
    axios.post("/student", studentObjekat).then((res) => {
        callback(null, res.data.status);
    }).catch((err) => {
        callback(err, null);
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

    if (value.kod != "") {

        posaljiPredmet(value, (error, data) => {
            if (error) {
                document.getElementById("kod").style.borderColor = 'red';
                document.getElementById('poruka').innerHTML = error.response.data.status;
                document.getElementById('poruka').style.color = 'red';
                return;
            }

            document.getElementById("kod").style.borderColor = 'green';
            document.getElementById('poruka').innerHTML = data;
            document.getElementById('poruka').style.color = 'green';

        });
    }
}

function handleStudent(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    if (value.index != "") {
        posaljiStudent(value, (error, data) => {
            if (error) {
                document.getElementById("index").style.borderColor = 'red';
                document.getElementById('poruka').innerHTML = error.response.data.status;
                document.getElementById('poruka').style.color = 'red';
                return;
            }

            document.getElementById("index").style.borderColor = 'green';
            document.getElementById('poruka').innerHTML = data;
            document.getElementById('poruka').style.color = 'green';

        });
    }
}

function handlePrisustvoPost(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    if (Object.values(value).every(x => x != '')) {
        posaljiPrisustvo(value, (error, data) => {
            if (error) {
                if (error.response.data.status == "Status prisustva nije ispravan!")
                    document.getElementById("statusPrisustva").style.borderColor = 'red';
                if (error.response.data.status == "Kod predmeta ne postoji!")
                    document.getElementById("kodPredmeta").style.borderColor = 'red';
                if (error.response.data.status == "Student ne postoji!")
                    document.getElementById("indexStudenta").style.borderColor = 'red';

                document.getElementById('poruka').innerHTML = error.response.data.status;
                document.getElementById('poruka').style.color = 'red';
                return;
            }

            document.getElementById("indexStudenta").style.borderColor = 'green';
            document.getElementById("statusPrisustva").style.borderColor = 'green';
            document.getElementById("kodPredmeta").style.borderColor = 'green';

            document.getElementById('poruka').innerHTML = data;
            document.getElementById('poruka').style.color = 'green';

        });
    }

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
            document.getElementById('poruka').style.color = 'red';
            return;
        }

        document.getElementById("kodPredmeta").style.borderColor = 'white';
        document.getElementById("indexStudenta").style.borderColor = 'white';
        document.getElementById("sedmica").style.borderColor = 'white';
        document.getElementById('poruka').innerHTML = " ";

        document.getElementById('prisustvo-tabela').innerHTML = `<table style="margin: auto"><tr><td>Prisustvo za sedmicu: </td><td>${data.prisustvoZaSedmicu}</td></tr>` +
            `<tr><td>Prisutan</td><td>${data.prisutan}</td></tr>` +
            `<tr><td>Odsutan</td><td>${data.odsutan}</td></tr>` +
            `<tr><td>nijeUneseno</td><td>${data.nijeUneseno}</td></tr>` +
            `</table>`;

    });
}



