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

describe("testiranje POST na /prisustvo", function () {
  before(function (done) {
    fs = require("fs");
    fs.writeFile(
      "./prisustva.csv",
      "tipcasa:Vjezba,redniBrojCasa:3,sedmica:1,kodPredmeta:RI-RS-2-1,indexStudenta:176-ST,statusPrisustva:prisutan",
      function () {}
    );
    done();
  });

  after(function (done) {
    delete require.cache[require.resolve("fs")];
    done();
  });

  it("POST /prisustvo kada status prisustva nije ispravan", function (done) {
    let prisustvo = {
      tipCasa: "vjezba",
      redniBrojCasa: 5,
      sedmica: 1,
      kodPredmeta: "RI-RS-2-1",
      indexStudenta: "175-ST",
      statusPrisustva: "nema",
    };
    chai
      .request(server)
      .post("/prisustvo")
      .set("Content-Type", "application/json")
      .send(prisustvo)
      .end((err, res) => {
        res.should.have.status(400);
        should.not.exist(err);
        assert.deepEqual(res.body, {
          status: `Status prisustva nije ispravan!`,
        });
        done();
      });
  });

  it("POST /prisustvo kada kod predmeta ne postoji", function (done) {
    let prisustvo = {
      tipCasa: "vjezba",
      redniBrojCasa: 5,
      sedmica: 1,
      kodPredmeta: "RI-RS-1-1",
      indexStudenta: "175-ST",
      statusPrisustva: "prisutan",
    };
    chai
      .request(server)
      .post("/prisustvo")
      .set("Content-Type", "application/json")
      .send(prisustvo)
      .end((err, res) => {
        res.should.have.status(400);
        should.not.exist(err);
        assert.deepEqual(res.body, {
          status: `Kod predmeta ne postoji!`,
        });
        done();
      });
  });

  it("POST /prisustvo kada student ne postoji", function (done) {
    let prisustvo = {
      tipCasa: "vjezba",
      redniBrojCasa: 5,
      sedmica: 1,
      kodPredmeta: "RI-RS-2-1",
      indexStudenta: "188-ST",
      statusPrisustva: "prisutan",
    };
    chai
      .request(server)
      .post("/prisustvo")
      .set("Content-Type", "application/json")
      .send(prisustvo)
      .end((err, res) => {
        res.should.have.status(400);
        should.not.exist(err);
        assert.deepEqual(res.body, {
          status: "Student ne postoji!",
        });
        done();
      });
  });

  it("POST /prisustvo kada je uspijesno kreirano prisustvo", function (done) {
    let prisustvo = {
      tipCasa: "vjezba",
      redniBrojCasa: 2,
      sedmica: 6,
      kodPredmeta: "RI-RS-2-1",
      indexStudenta: "176-ST",
      statusPrisustva: "prisutan",
    };
    chai
      .request(server)
      .post("/prisustvo")
      .set("Content-Type", "application/json")
      .send(prisustvo)
      .end((err, res) => {
        res.should.have.status(200);
        should.not.exist(err);
        assert.deepEqual(res.body, {
          status: `Kreirano prisustvo!`,
        });
        done();
      });
  });

  it("POST /prisustvo kada je uspijesno azurirano prisustvo", function (done) {
    let prisustvo = {
      tipCasa: "Vjezba",
      redniBrojCasa: 3,
      sedmica: 1,
      kodPredmeta: "RI-RS-2-1",
      indexStudenta: "176-ST",
      statusPrisustva: "odsutan",
    };
    chai
      .request(server)
      .post("/prisustvo")
      .set("Content-Type", "application/json")
      .send(prisustvo)
      .end((err, res) => {
        res.should.have.status(200);
        should.not.exist(err);
        assert.deepEqual(res.body, {
          status: `Azurirano prisustvo!`,
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

describe("testiranje GET na /prisustvo", function () {
  before(function (done) {
    fs = require("fs");
    fs.writeFile(
      "./prisustva.csv",
      "tipcasa:Vjezba,redniBrojCasa:3,sedmica:2,kodPredmeta:RI-RS-2-1,indexStudenta:176-ST,statusPrisustva:prisutan",
      function () {}
    );
    done();
  });

  after(function (done) {
    delete require.cache[require.resolve("fs")];
    done();
  });

  it("GET /prisustvo kada prisustvo ne postoji", function (done) {
    chai
      .request(server)
      .get("/prisustvo?kodPredmeta=RI-RS-2-1&indexStudenta=175-st&sedmica=1")
      .set("Content-Type", "application/json")
      .end((err, res) => {
        res.should.have.status(400);
        should.not.exist(err);
        assert.deepEqual(res.body, {
          status: "Prisustvo ne postoji!",
        });
        done();
      });
  });

  it("GET /prisustvo kada prisustvo postoji", function (done) {
    let p = {
      prisustvoZaSedmicu: 2,
      prisutan: 1,
      odsutan: 0,
      nijeUneseno: 0,
    };
    chai
      .request(server)
      .get("/prisustvo?kodPredmeta=RI-RS-2-1&indexStudenta=176-ST&sedmica=2")
      .set("Content-Type", "application/json")
      .end((err, res) => {
        res.should.have.status(200);
        should.not.exist(err);
        assert.deepEqual(res.body, p);
        done();
      });
  });
});
