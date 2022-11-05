let assert = chai.assert;
const lista = [
  { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
  { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
];
describe("Prisustvo", function () {
  describe("#izracunajPrisustvo", function () {
    it('treba vratiti {greska: "Parametar sedmica nema vrijednost u rasponu od 1 do 15!"} kada je sedmica manja od 0 ili veca od 15', function () {
      let pr = new Prisustvo();
      assert.equal(
        pr.izracunajPrisustvo(16, lista).greska,
        "Parametar sedmica nema vrijednost u rasponu od 1 do 15!"
      );
    });
    it('treba vratiti {greska: "Parametar sedmica mora imati vrijednost koja je manja od trenutne sedmice!"} kada je parametar sedmice veci od trenutne sedmice', function () {
      let pr = new Prisustvo();
      assert.equal(
        pr.izracunajPrisustvo(10, lista).greska,
        "Parametar sedmica mora imati vrijednost koja je manja od trenutne sedmice!"
      );
    });
    // it("treba vratiti 4PI kada je prečnik kruga 4", function () {
    //   const k1 = new Krug(1, 1, 4);
    //   assert.equal(k1.povrsina, 4 * Math.PI);
    // });
  });
});
