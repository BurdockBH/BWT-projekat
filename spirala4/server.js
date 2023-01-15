const fs = require("fs");
const Predmeti = require("./scripts/Predmet");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
let path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('./'));

const sequelize = require("./baza/baza.js");

app.post("/student", (req, res) => {
    let body;
    req.on("data", function (data) {
        body = JSON.parse(data);
        sequelize.Student.findOne({where: {index: body.index}}).then(result => {
            if (!result) {
                sequelize.Student.create({
                    ime: body.ime,
                    prezime: body.prezime,
                    index: body.index
                });
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify({status: `Kreiran student!`}));
            } else {
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(
                    JSON.stringify({
                        status: `Student sa indexom ${body.index} vec postoji!`,
                    })
                );
            }
        })
    });
});
app.post("/predmet", (req, res) => {
    let p = new Predmeti();
    let body;
    req.on("data", function (data) {
        body = JSON.parse(data);
        if (!p.provjeriKodPredmeta(body.kod)) {
            res.writeHead(400, {"Content-Type": "application/json"});
            res.end(JSON.stringify({status: `Neispravan kod predmeta!`}));
        } else {
            sequelize.Predmet.findOne({where: {kod: body.kod}}).then(result => {
                if (!result) {
                    sequelize.Predmet.create({naziv: body.naziv, kod: body.kod});
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({status: `Kreiran Predmet!`}));
                } else {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    res.end(
                        JSON.stringify({
                            status: `Predmet sa kodom ${body.kod} vec postoji!`,
                        })
                    );
                }
            })
        }
    });
});
app.post("/prisustvo", (req, res) => {
    req.on("data", function (data) {
        let body = JSON.parse(data);
        if (
            body.statusPrisustva != "prisutan" &&
            body.statusPrisustva != "odsutan" &&
            body.statusPrisustva != "nijeUneseno"
        ) {
            res.writeHead(400, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    status: `Status prisustva nije ispravan!`,
                })
            );
            return;
        }
        sequelize.Predmet.findOne({where: {kod: body.kodPredmeta}}).then(predmet => {
            if (!predmet) {
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({status: "Kod predmeta ne postoji!"}));
            } else {
                sequelize.Student.findOne({where: {index: body.indexStudenta}}).then(student => {
                    if (!student) {
                        res.writeHead(400, {"Content-Type": "application/json"});
                        res.end(JSON.stringify({status: "Student ne postoji!"}));
                    } else {
                        sequelize.Prisustvo.findOne({
                            include: [{
                                model: sequelize.Cas,
                                where: {
                                    tip: body.tipCasa,
                                    sedmica: body.sedmica,
                                    redniBroj: body.redniBrojCasa

                                },
                                include: [{
                                    model: sequelize.Predmet,
                                    where: {
                                        kod: body.kodPredmeta
                                    }
                                }]
                            },
                                {
                                    model: sequelize.Student,
                                    where: {
                                        index: body.indexStudenta
                                    }
                                }
                            ]
                        }).then(prisustvo => {
                            console.log(predmet.dataValues.id);
                            if (!prisustvo) {
                                sequelize.Cas.create({
                                    redniBroj: body.redniBrojCasa,
                                    tip: body.tipCasa,
                                    sedmica: body.sedmica,
                                    predmetId: predmet.dataValues.id
                                }).then(cas => {
                                    sequelize.Prisustvo.create({
                                        status: body.statusPrisustva,
                                        casId: cas.dataValues.id,
                                        studentId: student.dataValues.id
                                    })
                                });
                                sequelize.student_predmet.create({
                                    studentId: student.dataValues.id,
                                    predmetId: predmet.dataValues.id

                                })
                                res.writeHead(200, {"Content-Type": "application/json"});
                                res.end(JSON.stringify({status: `Kreirano prisustvo!`}));
                            } else {
                                sequelize.Prisustvo.update({status: body.statusPrisustva}, {
                                    where: {
                                        id: prisustvo.dataValues.id
                                    }
                                })
                                res.writeHead(200, {"Content-Type": "application/json"});
                                res.end(JSON.stringify({status: `Azurirano prisustvo!`}));
                            }
                        })

                    }
                })
            }
        });
    });
});
app.get("/prisustvo", (req, res) => {

    sequelize.Prisustvo.findAll({
        include: [{
            model: sequelize.Cas,
            where: {sedmica: req.query.sedmica},
            include: [{
                model: sequelize.Predmet,
                where: {
                    kod: req.query.kodPredmeta
                }
            }]
        },
            {
                model: sequelize.Student,
                where: {
                    index: req.query.indexStudenta
                }
            }
        ]
    }).then(result => {
        if (result.length == 0) {
            res.writeHead(400, {"Content-Type": "application/json"});
            res.end(JSON.stringify({status: "Prisustvo ne postoji!"}));
        } else {
            let pr = 0, od = 0, nU = 0;
            for (let el of result) {
                if (el.dataValues.status == "prisutan") pr++;
                else if (el.dataValues.status == "odsutan") od++;
                else if (el.dataValues.status == "nijeUneseno") nU++;
            }
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(
                JSON.stringify({
                    prisustvoZaSedmicu: parseInt(req.query.sedmica),
                    prisutan: pr,
                    odsutan: od,
                    nijeUneseno: nU,
                })
            );
        }
    })
});

app.get("/unosPredmeta.html", (req, res) => {
    res.sendFile(__dirname + "/Forme/unosPredmeta.html");
});

app.get("/prisustvo.html", (req, res) => {
    res.sendFile(__dirname + "/Forme/prisustvo.html");
});

app.get("/unosPrisustva.html", (req, res) => {
    res.sendFile(__dirname + "/Forme/unosPrisustva.html");
});

app.get("/unosStudenta.html", (req, res) => {
    res.sendFile(__dirname + "/Forme/unosStudenta.html");
});


app.listen(8080, () => {
    console.log(`Server is running on port 8080.`);
});

module.exports = app;
