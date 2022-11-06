let assert = chai.assert;
const lista = [
  { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
  { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
];
let pr = new Prisustvo();
Prisustvo.trenutnaSedmica = 7;
describe("Prisustvo", function () {
  describe("#izracunajPrisustvo", function () {
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
    it('treba vratiti { greska: "Parametar listaPrisustva nema ispravne properties!" } jer ne postoji parametar prisutan', function () {
      assert.equal(
        pr.izracunajPrisustvo(2, [
          { prSedmica: 2, odsutan: 2, nijeUneseno: 0 },
          { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
          { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
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

    it("treba vratiti 0.64 za prisustvno", function () {
      pr.izracunajPrisustvo(2, [
        { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
        { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
        { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
      ]);
      let prisustvo = pr.prisustvo;
      assert.equal(prisustvo.toFixed(2), 0.64);
    });
  });
});
