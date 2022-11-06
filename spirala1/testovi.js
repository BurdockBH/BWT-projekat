class Prisustvo {
  static trenutnaSedmica;

  constructor() {
    Prisustvo.trenutnaSedmica = 1;
    this.prisustvo = 0;
    this.finalnoStanje = false;
  }

  izracunajPrisustvo(sedmica, listaPrisustva) {
    if (sedmica < 1 || sedmica > 15)
      return {
        greska: "Parametar sedmica nema vrijednost u rasponu od 1 do 15!",
      };
    if (sedmica > Prisustvo.trenutnaSedmica)
      return {
        greska:
          "Parametar sedmica mora imati vrijednost koja je manja od trenutne sedmice!",
      };

    for (let x of listaPrisustva) {
      if (
        Object.keys(x).length != 4 ||
        Object.getOwnPropertyNames(x)[0] != "prSedmica" ||
        Object.getOwnPropertyNames(x)[1] != "prisutan" ||
        Object.getOwnPropertyNames(x)[2] != "odsutan" ||
        Object.getOwnPropertyNames(x)[3] != "nijeUneseno"
      )
        return { greska: "Parametar listaPrisustva nema ispravne properties!" };
    }
    const unikatni = [];
    const unazad = listaPrisustva.slice(0);
    unazad.reverse();

    const novaLista = unazad.filter((element) => {
      const isDuplicate = unikatni.includes(element.prSedmica);

      if (!isDuplicate) {
        unikatni.push(element.prSedmica);
        return true;
      }

      return false;
    });
    novaLista.reverse();

    let greskeAtributi = "";
    let imaGreska = false;
    let sedmicaSaGreskom;

    for (let x of novaLista) {
      if (x.prisutan < 0 || x.prisutan > 8) {
        greskeAtributi += "prisutan,";
        imaGreska = true;
      }
      if (x.odsutan < 0 || x.odsutan > 8) {
        greskeAtributi += "odsutan,";
        imaGreska = true;
      }
      if (x.nijeUneseno < 0 || x.nijeUneseno > 8) {
        greskeAtributi += "nijeUneseno,";
        imaGreska = true;
      }
      if (imaGreska) {
        sedmicaSaGreskom = x.prSedmica;
        break;
      }
    }
    greskeAtributi = greskeAtributi.slice(0, -1);

    if (imaGreska) {
      return {
        greska:
          "Parametar listaPrisustva nema ispravne vrijednosti za sedmicu " +
          sedmicaSaGreskom +
          " za properties [" +
          greskeAtributi +
          "]!",
      };
    }

    let ukupno_prisutan = 0;
    let ukupno_odsutan = 0;

    this.finalnoStanje = true;
    for (let x of novaLista) {
      ukupno_prisutan += x.prisutan;
      ukupno_odsutan += x.odsutan;
      if (x.odsutan + x.prisutan + x.nijeUneseno > 8)
        return {
          greska: "Parametar listaPrisustva nema ispravnu zbirnu vrijednost!",
        };
      if (x.nijeUneseno != 0) this.finalnoStanje = false;
    }
    this.prisustvo = ukupno_prisutan / (ukupno_prisutan + ukupno_odsutan);

    for (let x of novaLista) {
      if (sedmica == x.prSedmica) {
        return {
          prisustvoZaSedmicu: sedmica,
          prisutan: x.prisutan,
          odsutan: x.odsutan,
          nijeUneseno: x.nijeUneseno,
        };
      } else
        return {
          prisustvoZaSedmicu: sedmica,
          prisutan: -1,
          odsutan: -1,
          nijeUneseno: -1,
        };
    }
  }
}

let pr = new Prisustvo();
Prisustvo.trenutnaSedmica = 7;

const lista = [
  { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
  { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
];
// pogresan parametar sedmica
console.log(pr.izracunajPrisustvo(16, lista)); // treba vratiti {greska: "Parametar sedmica nema vrijednost u rasponu od 1 do 15!"}
console.log(pr.izracunajPrisustvo(10, lista)); // treba vratiti {greska: "Parametar sedmica mora imati vrijednost koja je manja od trenutne sedmice!"}

// pogresan parametar listaPrisustva
const lista1 = [
  { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
  { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
  { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
];
console.log(pr.izracunajPrisustvo(2, lista1)); // treba vratiti {greska: "Parametar listaPrisustva nema ispravne vrijednosti za sedmicu 1 za properties [prisutan,odsutan]!"}

const lista2 = [
  { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
  { prSedmica: 4, prisutan: -2, odsutan: -2, nijeUneseno: -1 },
  { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
];
console.log(pr.izracunajPrisustvo(2, lista2)); // treba vratiti {greska: "Parametar listaPrisustva nema ispravne vrijednosti za sedmicu 4 za properties [prSedmica,prisutan,odsutan,nijeUneseno]!"}

// ispravna lista
const lista3 = [
  { prSedmica: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0 },
  { prSedmica: 1, prisutan: -1, odsutan: -1, nijeUneseno: 1 },
  { prSedmica: 1, prisutan: 2, odsutan: 2, nijeUneseno: 1 },
];

// pr.izracunajPrisustvo(2, lista3);
// pr.izracunajPrisustvo(5, lista3);

console.log(pr.izracunajPrisustvo(2, lista3)); // lista je ispravna i treba vratiti {prisustvoZaSedmicu: 2, prisutan: 5, odsutan: 2, nijeUneseno: 0}
console.log(pr.izracunajPrisustvo(5, lista3)); // lista je ispravna ali sedmica ne postoji u listi tako da treba vratiti {prisustvoZaSedmicu: 5, prisutan: -1, odsutan: -1, nijeUneseno: -1}
