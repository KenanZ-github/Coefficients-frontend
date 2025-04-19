import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

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

  const [file, setFile] = useState(null);

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    for (const key in user) {
      if (key !== "profilnaSlika") {
        formData.append(key, user[key]);
      }
    }

    if (file) {
      formData.append("profilnaSlika", file);
    }

    try {
      await axios.put(`http://localhost:8080/user/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const result = await axios.get(`http://localhost:8080/user/${id}`);
    setUser(result.data);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Uredi korisnika</h2>

          {user.profilnaSlika && (
            <div className="text-center mb-3">
              <img
                src={`http://localhost:8080/uploads/${user.profilnaSlika}`}
                alt="Profilna Slika"
                style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "cover" }}
                className="img-thumbnail"
              />
            </div>
          )}

          <form onSubmit={onSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label>Ime i Prezime</label>
              <input type="text" className="form-control" name="imePrezime" value={user.imePrezime} onChange={onInputChange} />
            </div>

            <div className="mb-3">
              <label>Odsjek</label>
              <input type="text" className="form-control" name="odsjek" value={user.odsjek} onChange={onInputChange} />
            </div>

            <div className="mb-3">
              <label>Pozicija</label>
              <input type="text" className="form-control" name="pozicija" value={user.pozicija} onChange={onInputChange} />
            </div>

            <div className="mb-3">
              <label>Radno Vrijeme</label>
              <input type="text" className="form-control" name="radnoVrijeme" value={user.radnoVrijeme} onChange={onInputChange} />
            </div>

            <div className="mb-3">
              <label>Akademsko Zvanje</label>
              <input type="text" className="form-control" name="akademskoZvanje" value={user.akademskoZvanje} onChange={onInputChange} />
            </div>

            <div className="mb-3">
              <label>Proljetni Koeficijent</label>
              <input type="text" className="form-control" name="proljetniKoeficijent" value={user.proljetniKoeficijent} onChange={onInputChange} />
            </div>

            {/* Sva numerička polja */}
            {[
              "opterećenje",
              "brojPredmeta",
              "brojStudenataNaOdsjeku",
              "osnovniKoeficijent",
              "umanjenjeKoeficijentaZaRukovodioceIspodOptimuma",
              "povećanjeKoeficijentaZaRukovodiocePreko",
              "povećanjeKoeficijentaPoBrojuStudenata",
              "povećanjeKoeficijentaPoBrojuPredmeta",
              "koeficijentZaDekanaPoBrojuStudenataNaFakultetu",
              "koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku",
              "koeficijentZaDodatniStudijskiProgram",
              "dodatniKoeficijentZaPreko350StudenataNaOdsjeku",
              "dodatniKoeficijentZaAsistentaVisegAsistenta",
            ].map((field) => (
              <div className="mb-3" key={field}>
                <label>{field}</label>
                <input type="number" className="form-control" name={field} value={user[field]} onChange={onInputChange} />
              </div>
            ))}

            <div className="mb-3">
              <label>Izmijeni profilnu sliku</label>
              <input type="file" className="form-control" name="profilnaSlika" onChange={onFileChange} />
            </div>

            <button type="submit" className="btn btn-primary">Spasi izmjene</button>
          </form>
        </div>
      </div>
    </div>
  );
}
