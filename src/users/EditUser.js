import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState({
    imePrezime: "",
    odsjek: "",
    pozicija: "",
    radnoVrijeme: "",
    akademskoZvanje: "",
    slikaPath: null
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const result = await axios.get(`http://localhost:8080/user/${id}`);
      setUser(result.data);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setUser({ ...user, slikaPath: e.target.files[0] });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      
      // Dodaj sve podatke u FormData
      formData.append("imePrezime", user.imePrezime);
      formData.append("odsjek", user.odsjek);
      formData.append("pozicija", user.pozicija);
      formData.append("radnoVrijeme", user.radnoVrijeme);
      formData.append("akademskoZvanje", user.akademskoZvanje);

      // Ako postoji stara slika, dodaj je kao string
      if (typeof user.slikaPath === 'string') {
        formData.append("postojecaSlikaPath", user.slikaPath);
      }

      // Ako je nova slika odabrana, dodaj je
      if (user.slikaPath instanceof File) {
        formData.append("slikaPath", user.slikaPath);
      }

      await axios.put(`http://localhost:8080/user/${id}`, formData, {
        headers: { 
          "Content-Type": "multipart/form-data"
        }
      });

      navigate(`/viewuser/${id}`);
    } catch (error) {
      console.error("Greška pri ažuriranju podataka:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Izmijeni detalje zaposlenika</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Ime i Prezime</label>
              <input
                type="text"
                className="form-control"
                name="imePrezime"
                value={user.imePrezime || ''}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Odsjek</label>
              <input
                type="text"
                className="form-control"
                name="odsjek"
                value={user.odsjek || ''}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Pozicija</label>
              <input
                type="text"
                className="form-control"
                name="pozicija"
                value={user.pozicija || ''}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Radno Vrijeme</label>
              <input
                type="text"
                className="form-control"
                name="radnoVrijeme"
                value={user.radnoVrijeme || ''}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Akademsko Zvanje</label>
              <input
                type="text"
                className="form-control"
                name="akademskoZvanje"
                value={user.akademskoZvanje || ''}
                onChange={onInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Profilna slika</label>
              <input
                type="file"
                className="form-control"
                name="slikaPath"
                onChange={onFileChange}
                accept="image/*"
              />
              {user.slikaPath && typeof user.slikaPath === 'string' && (
                <img
                  src={`http://localhost:8080/uploads/${user.slikaPath}`}
                  alt="Trenutna profilna slika"
                  style={{ maxWidth: "200px", marginTop: "10px" }}
                  className="img-thumbnail"
                />
              )}
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Sačuvaj izmjene
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate(`/viewuser/${id}`)}
              >
                Otkaži
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
