let assert = chai.assert;
const lista = [
  { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
  { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
];
let pr = new Prisustvo();
Prisustvo.trenutnaSedmica = 7;
describe("Prisustvo", function () {
  describe("#greske", function () {
    it('treba vratiti {greska: "Parametar sedmica nema vrijednost u rasponu od 1 do 15!"} kada je sedmica manja od 0 ili veca od 15', function () {
      assert.equal(
        pr.izracunajPrisustvo(16, lista).greska,
        "Parametar sedmica nema vrijednost u rasponu od 1 do 15!"
      );
    });

    it('treba vratiti {greska: "Parametar sedmica mora imati vrijednost koja je manja od trenutne sedmice!"} kada je parametar sedmice veci od trenutne sedmice', function () {
      assert.equal(
        pr.izracunajPrisustvo(10, lista).greska,
        "Parametar sedmica mora imati vrijednost koja je manja od trenutne sedmice!"
      );
    });

    it('treba vratiti {greska: "Parametar listaPrisustva nema ispravne vrijednosti za sedmicu 1 za properties [prisutan,odsutan]!"} jer prisutan i odsutan nisu ispravni', function () {
      assert.equal(
        pr.izracunajPrisustvo(2, [
          { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
          { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
          { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
        ]).greska,
        "Parametar listaPrisustva nema ispravne vrijednosti za sedmicu 1 za properties [prisutan,odsutan]!"
      );
    });

    it('treba vratiti {greska: "Parametar listaPrisustva nema ispravne properties!"} jer ne postoji parametar prisutan', function () {
      assert.equal(
        pr.izracunajPrisustvo(2, [
          { prSedmica: 2, odsutan: 2, nijeUneseno: 0 },
          { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
          { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
        ]).greska,
        "Parametar listaPrisustva nema ispravne properties!"
      );
    });

    it('treba vratiti {greska: "Parametar listaPrisustva nema ispravne properties!"} jer postoji visak parametar', function () {
      assert.equal(
        pr.izracunajPrisustvo(2, [
          {
            prSedmica: 2,
            prisutan: 2,
            odsutan: 2,
            nijeUneseno: 0,
            viskaParametar: 5,
          },
          { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
          { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
        ]).greska,
        "Parametar listaPrisustva nema ispravne properties!"
      );
    });

    it('treba vratiti {greska: "Parametar listaPrisustva nema ispravne properties!"} jer je unesen parametar prSedmica kao string', function () {
      assert.equal(
        pr.izracunajPrisustvo(2, [
          { prSedmica: "string", prisutan: 2, odsutan: 2, nijeUneseno: 0 },
          { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
          { prSedmica: 1, prisutan: 1, odsutan: 6, nijeUneseno: 1 },
        ]).greska,
        "Parametar listaPrisustva nema ispravne properties!"
      );
    });

    it('treba vratiti {greska: "Parametar listaPrisustva nema ispravne properties!"} jer je unesen tip double prisutan, za prSedmica 1', function () {
      assert.equal(
        pr.izracunajPrisustvo(2, [
          { prSedmica: 2, prisutan: 2, odsutan: 2, nijeUneseno: 0 },
          { prSedmica: 1, prisutan: 2.5, odsutan: 2, nijeUneseno: 1 },
          { prSedmica: 1, prisutan: 1, odsutan: 6, nijeUneseno: 1 },
        ]).greska,
        "Parametar listaPrisustva nema ispravne properties!"
      );
    });

    it('treba vratiti {greska: "Parametar listaPrisustva nema ispravnu zbirnu vrijednost!"} jer zbir prisutan, odsutan i nijeUneseno prvog objekta je veci od 8', function () {
      assert.equal(
        pr.izracunajPrisustvo(2, [
          { prSedmica: 2, prisutan: 7, odsutan: 2, nijeUneseno: 0 },
          { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
          { prSedmica: 1, prisutan: 2, odsutan: 1, nijeUneseno: 1 },
        ]).greska,
        "Parametar listaPrisustva nema ispravnu zbirnu vrijednost!"
      );
    });

    it('treba vratiti {greska: "Parametar sedmica nema vrijednost u rasponu od 1 do 15!"} iako listaPrisustva nije tacna, greske sedmice imaju prioritet ', function () {
      assert.equal(
        pr.izracunajPrisustvo(18, [
          { prSedmica: 2, prisutan: 3, odsutan: 2, nijeUneseno: 0 },
          { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
          { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
        ]).greska,
        "Parametar sedmica nema vrijednost u rasponu od 1 do 15!"
      );
    });
  });
  describe("#ispravniParametri", function () {
    it("treba vratiti {prisustvoZaSedmicu: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0} jer su svi parametri tacni i ispunjavaju uslov", function () {
      assert.deepEqual(
        pr.izracunajPrisustvo(2, [
          { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
          { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
          { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
        ]),
        { prisustvoZaSedmicu: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 }
      );
    });

    const ispravnaLista = [
      { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
      { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
      { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
    ];

    it("treba vratiti 0.64 za prisustvno", function () {
      pr.izracunajPrisustvo(2, ispravnaLista);
      let prisustvo = pr.prisustvo;
      let pris = (5 + 2) / (5 + 2 + 2 + 2); // ispravni parametri iz liste listaPrisustvo
      assert.equal(prisustvo.toFixed(2), pris.toFixed(2));
    });

    it("treba vratiti 0.46 za prisustvno", function () {
      const lista = [
        { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
        { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
        { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
        { prSedmica: 5, prisutan: 5, odsutan: 1, nijeUneseno: 0 },
        { prSedmica: 4, prisutan: 2, odsutan: 3, nijeUneseno: 0 },
        { prSedmica: 6, prisutan: 1, odsutan: 1, nijeUneseno: 0 },
        { prSedmica: 7, prisutan: 1, odsutan: 6, nijeUneseno: 1 },
        { prSedmica: 3, prisutan: 2, odsutan: 6, nijeUneseno: 0 },
      ];

      pr.izracunajPrisustvo(5, lista);
      let prisustvo = pr.prisustvo;
      let pris =
        (5 + 2 + 5 + 2 + 1 + 1 + 2) /
        (5 + 2 + 5 + 2 + 1 + 1 + 2 + 2 + 2 + 1 + 3 + 1 + 6 + 6); // ispravni parametri iz liste listaPrisustvo
      assert.equal(prisustvo.toFixed(2), pris.toFixed(2));
    });

    it("treba vratiti false za finalnoStanje", function () {
      pr.izracunajPrisustvo(2, ispravnaLista);
      assert.equal(pr.finalnoStanje, false);
    });

    it("treba vratiti true za finalnoStanje", function () {
      pr.izracunajPrisustvo(2, [
        { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
        { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 0 },
        { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 0 },
      ]);
      assert.equal(pr.finalnoStanje, true);
    });
  });
});
