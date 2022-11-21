let should = require("chai").should();
let expect = require("chai").expect();
let assert = require("chai").assert;
let chai = require("chai");
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
let server = require("./server");

describe("testiranje POST na /student", function () {
  before(function (done) {
    fs = require("fs");
    fs.writeFile(
      "./studenti.csv",
      "index:176-ST,ime:edo,prezime:cicak",
      function () {}
    );
    done();
  });

  after(function (done) {
    delete require.cache[require.resolve("fs")];
    done();
  });

  it("POST /student ce izbaciti gresku", function (done) {
    let student = { ime: "edo", prezime: "cicak", index: "176-ST" };
    chai
      .request(server)
      .post("/student")
      .set("Content-Type", "application/json")
      .send(student)
      .end((err, res) => {
        res.should.have.status(400);
        should.not.exist(err);
        assert.deepEqual(res.body, {
          status: `Student sa indexom ${student.index} vec postoji!`,
        });
        done();
      });
  });

  it("POST /student ce postaviti studenta", function (done) {
    let student = { ime: "ermin", prezime: "hadzic", index: "158-ST" };
    chai
      .request(server)
      .post("/student")
      .set("Content-Type", "application/json")
      .send(student)
      .end((err, res) => {
        res.should.have.status(200);
        should.not.exist(err);
        assert.deepEqual(res.body, {
          status: `Kreiran student!`,
        });
        done();
      });
  });
});

describe("testiranje POST na /predmet", function () {
  before(function (done) {
    fs = require("fs");
    fs.writeFile(
      "./predmeti.csv",
      "kod:RI-RS-2-1,naziv:Fizika",
      function () {}
    );
    done();
  });

  after(function (done) {
    delete require.cache[require.resolve("fs")];
    done();
  });

  it("POST /predmet kada predmet vec postoju u datoteci predmeti.csv", function (done) {
    let predmet = { naziv: "Fizika", kod: "RI-RS-2-1" };
    chai
      .request(server)
      .post("/predmet")
      .set("Content-Type", "application/json")
      .send(predmet)
      .end((err, res) => {
        res.should.have.status(400);
        should.not.exist(err);
        assert.deepEqual(res.body, {
          status: `Predmet sa kodom ${predmet.kod} vec postoji!`,
        });
        done();
      });
  });

  it("POST /predmet kada predmet nema ispravan kod", function (done) {
    let predmet = { naziv: "Fizika", kod: "RI-BoE-RS-2-1" };
    chai
      .request(server)
      .post("/predmet")
      .set("Content-Type", "application/json")
      .send(predmet)
      .end((err, res) => {
        res.should.have.status(400);
        should.not.exist(err);
        assert.deepEqual(res.body, { status: `Neispravan kod predmeta!` });
        done();
      });
  });

  it("POST /predmet kada je predmet uspijesno kreiran", function (done) {
    let predmet = { naziv: "BackEnd-Web-Tehnologije", kod: "RI-RS-2-2" };
    chai
      .request(server)
      .post("/predmet")
      .set("Content-Type", "application/json")
      .send(predmet)
      .end((err, res) => {
        res.should.have.status(200);
        should.not.exist(err);
        assert.deepEqual(res.body, { status: `Kreiran Predmet!` });
        done();
      });
  });
});
