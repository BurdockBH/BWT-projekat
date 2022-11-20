const http = require("http");
const fs = require("fs");
const url = require("url");
const Predmet = require("./scripts/Predmet");

function DodajStudenta(data) {
  let noviStudent = `index:${data.index},ime:${data.ime},prezime:${data.prezime}\n`;
  fs.appendFile("studenti.csv", noviStudent, function (err) {
    if (err) throw err;
  });
}

function DodajPredmet(data) {
  let noviPredmet = `kod:${data.kod},naziv:${data.naziv}\n`;
  fs.appendFile("predmeti.csv", noviPredmet, function (err) {
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
            DodajStudenta(body);
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
              DodajPredmet(body);
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ status: `Kreiran student!` }));
              return;
            }

            for (let predmet of predmeti) {
              let textKod = predmet.slice(
                predmet.indexOf(":") + 1,
                predmet.indexOf(",")
              );
              // console.log(textKod);
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
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ status: `Neispravan kod predmeta!` }));
          }
        });
      });
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Route not found" }));
    }
  })
  .listen(8080);
