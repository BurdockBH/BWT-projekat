const http = require("http");
const fs = require("fs");
const url = require("url");
const Predmet = require("./scripts/Predmet");
const Prisustvo = require("./scripts/Prisustvo");

function DodajStudenta(data) {
  let noviStudent = `\nindex:${data.index},ime:${data.ime},prezime:${data.prezime}`;
  fs.appendFile("studenti.csv", noviStudent, function (err) {
    if (err) throw err;
  });
}

function DodajPredmet(data) {
  let noviPredmet = `\nkod:${data.kod},naziv:${data.naziv}`;
  fs.appendFile("predmeti.csv", noviPredmet, function (err) {
    if (err) throw err;
  });
}

function DodajPrisustvo(data) {
  let novoPrisustvo = `\ntipcasa:${data.tipCasa},redniBrojCasa:${data.redniBrojCasa},sedmica:${data.sedmica},kodPredmeta:${data.kodPredmeta},indexStudenta:${data.indexStudenta},statusPrisustva:${data.statusPrisustva}`;
  fs.appendFile("prisustva.csv", novoPrisustvo, function (err) {
    if (err) throw err;
  });
}

http
  .createServer(function (req, res) {
    if (req.url === "/student" && req.method === "POST") {
      let body;
      req.on("data", function (data) {
        body = JSON.parse(data);
        fs.readFile("studenti.csv", "utf8", (err, text) => {
          let studenti = text.split("\n");
          if (text.length == 0) {
            let noviStudent = `index:${body.index},ime:${body.ime},prezime:${body.prezime}`;
            fs.appendFile("studenti.csv", noviStudent, function (err) {
              if (err) throw err;
            });
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: `Kreiran student!` }));
            return;
          }

          for (let student of studenti) {
            let textIndex = student.slice(
              student.indexOf(":") + 1,
              student.indexOf(",")
            );

            if (textIndex == body.index) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  status: `Student sa indexom ${body.index} vec postoji!`,
                })
              );
              return;
            }
          }
          DodajStudenta(body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ status: `Kreiran student!` }));
        });
      });
    } else if (req.url === "/predmet" && req.method === "POST") {
      let p = new Predmet();
      let body;
      req.on("data", function (data) {
        body = JSON.parse(data);
        fs.readFile("predmeti.csv", "utf8", (err, text) => {
          if (p.provjeriKodPredmeta(body.kod)) {
            let predmeti = text.split("\n");
            if (text.length == 0) {
              let noviPredmet = `kod:${body.kod},naziv:${body.naziv}`;
              fs.appendFile("predmeti.csv", noviPredmet, function (err) {
                if (err) throw err;
              });
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: `Kreiran student!` }));
              return;
            }

            for (let predmet of predmeti) {
              let textKod = predmet.slice(
                predmet.indexOf(":") + 1,
                predmet.indexOf(",")
              );

              if (textKod == body.kod) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    status: `Predmet sa kodom ${body.kod} vec postoji!`,
                  })
                );
                return;
              }
            }
            DodajPredmet(body);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: `Kreiran Predmet!` }));
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: `Neispravan kod predmeta!` }));
          }
        });
      });
    } else if (req.url === "/prisustvo" && req.method === "POST") {
      req.on("data", function (data) {
        let body = JSON.parse(data);
        if (
          body.statusPrisustva != "prisutan" &&
          body.statusPrisustva != "odsutan" &&
          body.statusPrisustva != "nijeUneseno"
        ) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              status: `Status prisustva nije ispravan!`,
            })
          );
          return;
        }

        fs.readFile("predmeti.csv", "utf8", (err, text2) => {
          let predmeti = text2.split("\n");
          let flag = false;
          for (let predmet of predmeti) {
            let textKod = predmet.slice(
              predmet.indexOf(":") + 1,
              predmet.indexOf(",")
            );
            if (textKod == body.kodPredmeta) {
              flag = true;
            }
          }

          if (!flag) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: "Kod predmeta ne postoji!" }));
            return;
          }
          fs.readFile("studenti.csv", "utf8", (err, text3) => {
            let studenti = text3.split("\n");
            let flag = false;
            for (let student of studenti) {
              let textIndex = student.slice(
                student.indexOf(":") + 1,
                student.indexOf(",")
              );
              if (textIndex == body.indexStudenta) {
                flag = true;
              }
            }
            if (!flag) {
              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: "Student ne postoji!" }));
              return;
            }
            fs.readFile("prisustva.csv", "utf8", (err, text1) => {
              if (text1.length == 0) {
                let novoPrisustvo = `tipcasa:${body.tipCasa},redniBrojCasa:${body.redniBrojCasa},sedmica:${body.sedmica},kodPredmeta:${body.kodPredmeta},indexStudenta:${body.indexStudenta},statusPrisustva:${body.statusPrisustva}`;
                fs.appendFile("prisustva.csv", novoPrisustvo, function (err) {
                  if (err) throw err;
                });
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ status: `Kreirano prisustvo!` }));
                return;
              }

              let objekat = {};
              let prisustva = text1.split("\n");
              for (let prisustvo of prisustva) {
                let parametri = prisustvo.split(",");
                objekat["tipCasa"] = parametri[0].slice(
                  parametri[0].indexOf(":") + 1
                );
                objekat["redniBrojCasa"] = parametri[1].slice(
                  parametri[1].indexOf(":") + 1
                );
                objekat["sedmica"] = parametri[2].slice(
                  parametri[2].indexOf(":") + 1
                );
                objekat["kodPredmeta"] = parametri[3].slice(
                  parametri[3].indexOf(":") + 1
                );
                objekat["indexStudenta"] = parametri[4].slice(
                  parametri[4].indexOf(":") + 1
                );
                objekat["statusPrisustva"] = parametri[5].slice(
                  parametri[5].indexOf(":") + 1
                );
                if (
                  objekat.tipCasa == body.tipCasa &&
                  objekat.redniBrojCasa == body.redniBrojCasa &&
                  objekat.sedmica == body.sedmica &&
                  objekat.kodPredmeta == body.kodPredmeta &&
                  objekat.indexStudenta == body.indexStudenta
                ) {
                  var linija = text1.replace(
                    prisustvo,
                    `tipcasa:${body.tipCasa},redniBrojCasa:${body.redniBrojCasa},sedmica:${body.sedmica},kodPredmeta:${body.kodPredmeta},indexStudenta:${body.indexStudenta},statusPrisustva:${body.statusPrisustva}`
                  );

                  fs.writeFile("prisustva.csv", linija, "utf8", function (err) {
                    if (err) throw err;
                  });
                  res.writeHead(200, { "Content-Type": "application/json" });
                  res.end(JSON.stringify({ status: `Azurirano prisustvo!` }));
                  return;
                }
              }
              DodajPrisustvo(body);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: `Kreirano prisustvo!` }));
              return;
            });
          });
        });
      });
    } else if (
      req.url.slice(0, req.url.indexOf("?")) == "/prisustvo" &&
      req.method === "GET"
    ) {
      let zahtijev = req.url.slice(req.url.indexOf("?") + 1);
      // console.log(parametri);
      let objekat = {};
      let parametri = zahtijev.split("&");
      objekat[parametri[0].slice(0, parametri[0].indexOf("="))] =
        parametri[0].slice(parametri[0].indexOf("=") + 1);
      objekat[parametri[1].slice(0, parametri[1].indexOf("="))] =
        parametri[1].slice(parametri[1].indexOf("=") + 1);
      objekat[parametri[2].slice(0, parametri[2].indexOf("="))] =
        parametri[2].slice(parametri[2].indexOf("=") + 1);

      fs.readFile("prisustva.csv", "utf8", (err, text) => {
        let objekatPrisustva = {};
        let prisustva = text.split("\n");
        let flag = false;
        let pr = 0;
        let od = 0;
        let nU = 0;
        for (let prisustvo of prisustva) {
          let parametri = prisustvo.split(",");
          objekatPrisustva["tipCasa"] = parametri[0].slice(
            parametri[0].indexOf(":") + 1
          );
          objekatPrisustva["redniBrojCasa"] = parametri[1].slice(
            parametri[1].indexOf(":") + 1
          );
          objekatPrisustva["sedmica"] = parametri[2].slice(
            parametri[2].indexOf(":") + 1
          );
          objekatPrisustva["kodPredmeta"] = parametri[3].slice(
            parametri[3].indexOf(":") + 1
          );
          objekatPrisustva["indexStudenta"] = parametri[4].slice(
            parametri[4].indexOf(":") + 1
          );
          objekatPrisustva["statusPrisustva"] = parametri[5].slice(
            parametri[5].indexOf(":") + 1
          );
          if (
            objekatPrisustva.kodPredmeta == objekat.kodPredmeta &&
            objekatPrisustva.indexStudenta == objekat.indexStudenta &&
            objekatPrisustva.sedmica == objekat.sedmica
          ) {
            flag = true;
            if (objekatPrisustva.statusPrisustva == "prisutan") pr++;
            else if (objekatPrisustva.statusPrisustva == "odsutan") od++;
            else nU++;
          }
        }
        if (!flag) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Prisustvo ne postoji!" }));
          return;
        } else {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              prisustvoZaSedmicu: objekat.sedmica,
              prisutan: pr,
              odsutan: od,
              nijeUneseno: nU,
            })
          );
          return;
        }
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Ruta nije nadjena!" }));
    }
  })
  .listen(8080);
