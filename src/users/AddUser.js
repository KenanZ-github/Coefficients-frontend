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
    slikaPath: null,
  });

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
      
      // Dodaj osnovne informacije o korisniku
      formData.append("imePrezime", user.imePrezime);
      formData.append("odsjek", user.odsjek);
      formData.append("pozicija", user.pozicija);
      formData.append("radnoVrijeme", user.radnoVrijeme);
      formData.append("akademskoZvanje", user.akademskoZvanje);
      if (user.slikaPath) {
        formData.append("slikaPath", user.slikaPath);
      }

      const response = await axios.post("http://localhost:8080/user", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Server response:", response.data);
      navigate("/");
    } catch (error) {
      console.error("Greška pri slanju podataka:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Dodaj zaposlenika</h2>
          <form onSubmit={onSubmit}>
            <div className="mb-3">
              <label className="form-label">Ime i Prezime</label>
              <input
                type="text"
                className="form-control"
                name="imePrezime"
                value={user.imePrezime}
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
                value={user.odsjek}
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
                value={user.pozicija}
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
                value={user.radnoVrijeme}
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
                value={user.akademskoZvanje}
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
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Sačuvaj
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate("/")}
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
