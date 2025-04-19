import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function ViewUser() {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      loadUser();
    }
  }, [id]);
  
  const loadUser = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/user/${id}`);
      console.log(result.data); // 👈 vidi da li sadrži slikaPath
      setUser(result.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  if (!user) {
    return <div className="container text-center mt-4">Učitavanje podataka...</div>;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Detalji zaposlenika: {user.imePrezime}</h2>

          <div className="text-center mb-3">
            <img
              src={
                user.slikaPath
                  ? `http://localhost:8080/uploads/${user.slikaPath}`
                  : "/default-profile.png" // Placeholder slika u public folder
              }
              alt="Profilna Slika"
              className="img-fluid rounded-circle"
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          </div>

          <div className="card">
            <div className="card-header">
              <ul className="list-group list-group-flush">
                {fieldOrder.map((key) =>
                  user[key] !== undefined ? (
                    <li key={key} className="list-group-item">
                      <b>{formatKey(key)}:</b> {user[key]}
                    </li>
                  ) : null
                )}
              </ul>
            </div>
          </div>

          <Link className="btn btn-primary my-2" to={"/"}>
            Nazad
          </Link>
        </div>
      </div>
    </div>
  );
}

// Lijepa imena za polja
const fieldLabels = {
  imePrezime: "Ime i prezime",
  odsjek: "Odsjek",
  pozicija: "Pozicija",
  radnoVrijeme: "Radno vrijeme",
  akademskoZvanje: "Akademsko zvanje",
  proljetniKoeficijent: "Proljetni koeficijent",
  opterećenje: "Opterećenje",
  brojPredmeta: "Broj predmeta",
  brojStudenataNaOdsjeku: "Broj studenata na odsjeku",
  osnovniKoeficijent: "Osnovni koeficijent",
  umanjenjeKoeficijentaZaRukovodioceIspodOptimuma: "Umanjenje koef. za rukovodioce ispod optimuma",
  povećanjeKoeficijentaZaRukovodiocePreko: "Povećanje koef. za rukovodioce preko",
  povećanjeKoeficijentaPoBrojuStudenata: "Povećanje koef. po broju studenata",
  povećanjeKoeficijentaPoBrojuPredmeta: "Povećanje koef. po broju predmeta",
  koeficijentZaDekanaPoBrojuStudenataNaFakultetu: "Koef. za dekana (stud. na fakultetu)",
  koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku: "Koef. za šefa odsjeka (stud. na odsjeku)",
  koeficijentZaDodatniStudijskiProgram: "Koef. za dodatni studijski program",
  dodatniKoeficijentZaPreko350StudenataNaOdsjeku: "Dodatni koef. za >350 studenata",
  dodatniKoeficijentZaAsistentaVisegAsistenta: "Dodatni koef. za asistente",
  ukupanKoeficijentZaJesenjiSemestar: "Ukupan koeficijent (jesenji)",
};

const formatKey = (key) => {
  return fieldLabels[key] || key;
};

// Redoslijed prikaza
const fieldOrder = [
  "imePrezime",
  "pozicija",
  "odsjek",
  "radnoVrijeme",
  "akademskoZvanje",
  "opterećenje",
  "brojPredmeta",
  "brojStudenataNaOdsjeku",
  "osnovniKoeficijent",
  "proljetniKoeficijent",
  "umanjenjeKoeficijentaZaRukovodioceIspodOptimuma",
  "povećanjeKoeficijentaZaRukovodiocePreko",
  "povećanjeKoeficijentaPoBrojuStudenata",
  "povećanjeKoeficijentaPoBrojuPredmeta",
  "koeficijentZaDekanaPoBrojuStudenataNaFakultetu",
  "koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku",
  "koeficijentZaDodatniStudijskiProgram",
  "dodatniKoeficijentZaPreko350StudenataNaOdsjeku",
  "dodatniKoeficijentZaAsistentaVisegAsistenta",
  "ukupanKoeficijentZaJesenjiSemestar",
];
