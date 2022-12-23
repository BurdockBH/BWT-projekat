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
        callback(err.response.data.status, null);
    })
}

function posaljiPrisustvo(predmetPrisustvo, callback) {
    axios.post("/prisustvo", predmetPrisustvo).then((res) => {
        callback(null, res.data.status);
    }).catch((err) => {
        callback(err.response.data.status, null);
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
        callback(null, res.data.status);
    }).catch((err) => {
        callback(err.response.data.status, null);
    })
}

function ispisi(error, data) {
    if (error == null) data.innerHTML = data;
    else if (data == null) error.innerHTML = error;
}

function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    const value = Object.fromEntries(data.entries());

    posaljiPredmet(value, ispisi);
}

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);