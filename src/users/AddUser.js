import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddUser() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    imePrezime: "",
    odsjek: "",
    pozicija: "",
    radnoVrijeme: "",
    akademskoZvanje: "",
    proljetniKoeficijent: "",
    opterećenje: 0,
    brojPredmeta: 0,
    brojStudenataNaOdsjeku: 0,
    osnovniKoeficijent: 0,
    umanjenjeKoeficijentaZaRukovodioceIspodOptimuma: 0,
    povećanjeKoeficijentaZaRukovodiocePreko: 0,
    povećanjeKoeficijentaPoBrojuStudenata: 0,
    povećanjeKoeficijentaPoBrojuPredmeta: 0,
    koeficijentZaDekanaPoBrojuStudenataNaFakultetu: 0,
    koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku: 0,
    koeficijentZaDodatniStudijskiProgram: 1.0,
    dodatniKoeficijentZaPreko350StudenataNaOdsjeku: 0,
    dodatniKoeficijentZaAsistentaVisegAsistenta: 1.5,
    profilnaSlika: null,
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: name === "imePrezime" || name === "odsjek" || name === "pozicija" || name === "radnoVrijeme" || name === "akademskoZvanje" || name === "proljetniKoeficijent"
        ? value
        : parseFloat(value),
    });
  };

  const onFileChange = (e) => {
    setUser({ ...user, profilnaSlika: e.target.files[0] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    for (const key in user) {
      if (key === "profilnaSlika" && user[key]) {
        formData.append("profilnaSlika", user[key]);
      } else {
        formData.append(key, user[key]);
      }
    }

    try {
      await axios.post("http://localhost:8080/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
    } catch (error) {
      console.error("Greška pri slanju podataka:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-10 offset-md-1 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Dodaj zaposlenika</h2>
          <form onSubmit={onSubmit}>
            {[
              { label: "Ime i Prezime", name: "imePrezime", type: "text" },
              { label: "Odsjek", name: "odsjek", type: "text" },
              { label: "Pozicija", name: "pozicija", type: "text" },
              { label: "Radno Vrijeme", name: "radnoVrijeme", type: "text" },
              { label: "Akademsko Zvanje", name: "akademskoZvanje", type: "text" },
              { label: "Proljetni Koeficijent", name: "proljetniKoeficijent", type: "number" },
              { label: "Opterećenje", name: "opterećenje" },
              { label: "Broj Predmeta", name: "brojPredmeta" },
              { label: "Broj Studenata Na Odsjeku", name: "brojStudenataNaOdsjeku" },
              { label: "Osnovni Koeficijent", name: "osnovniKoeficijent" },
              { label: "Umanjenje Koeficijenta Za Rukovodioce Ispod Optimuma", name: "umanjenjeKoeficijentaZaRukovodioceIspodOptimuma" },
              { label: "Povećanje Koeficijenta Za Rukovodioce Preko", name: "povećanjeKoeficijentaZaRukovodiocePreko" },
              { label: "Povećanje Koeficijenta Po Broju Studenata", name: "povećanjeKoeficijentaPoBrojuStudenata" },
              { label: "Povećanje Koeficijenta Po Broju Predmeta", name: "povećanjeKoeficijentaPoBrojuPredmeta" },
              { label: "Koeficijent Za Dekana Po Broju Studenata Na Fakultetu", name: "koeficijentZaDekanaPoBrojuStudenataNaFakultetu" },
              { label: "Koeficijent Za Šefa Odsjeka Po Broju Studenata Na Odsjeku", name: "koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku" },
              { label: "Koeficijent Za Dodatni Studijski Program", name: "koeficijentZaDodatniStudijskiProgram" },
              { label: "Dodatni Koeficijent Za Preko 350 Studenata Na Odsjeku", name: "dodatniKoeficijentZaPreko350StudenataNaOdsjeku" },
              { label: "Dodatni Koeficijent Za Asistenta/Višeg Asistenta", name: "dodatniKoeficijentZaAsistentaVisegAsistenta" },
            ].map((field) => (
              <div className="mb-3" key={field.name}>
                <label className="form-label">{field.label}</label>
                <input
                  type={field.type || "number"}
                  className="form-control"
                  name={field.name}
                  step="0.01"
                  value={user[field.name]}
                  onChange={onInputChange}
                />
              </div>
            ))}

            <div className="mb-3">
              <label className="form-label">Profilna slika</label>
              <input
                type="file"
                className="form-control"
                name="profilnaSlika"
                accept="image/*"
                onChange={onFileChange}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Sačuvaj
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
