class Predmet {
  constructor() {
    this.kodPredmeta = "";
  }

  provjeriKodPredmeta(kod) {
    if (kod.length != 9 && kod.length != 10) {
      return false;
    } else {
      let niz = kod.split("-");
      if (niz.length != 4) return false;
      if (niz[0] != "RI" && niz[0] != "AE" && niz[0] != "EE" && niz[0] != "TK")
        return false;
      if (niz[1] != "BoE" && niz[1] != "MoE" && niz[1] != "RS") return false;
      if (
        niz[1] == "BoE" &&
        (niz[2] < 1 || niz[2] > 3 || niz[3] < 1 || niz[3] > 2)
      )
        return false;
      if (
        (niz[1] == "MoE" || niz[1] == "RS") &&
        (niz[2] < 1 || niz[2] > 2 || niz[3] < 1 || niz[3] > 2)
      )
        return false;
      this.kodPredmeta = kod;
      return true;
    }
  }
}

module.exports = Predmet;
