import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import '../styles/global.css';
import * as XLSX from "xlsx";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [searchImePrezime, setSearchImePrezime] = useState("");
  const [searchOdsjek, setSearchOdsjek] = useState("");
  const [error, setError] = useState(null);

  // Učitaj sve korisnike prilikom mountanja komponente
  useEffect(() => {
    loadUsers();
  }, []);

  // Automatski resetuj listu kada su oba polja prazna
  useEffect(() => {
    if (searchImePrezime === "" && searchOdsjek === "") {
      loadUsers();
    }
  }, [searchImePrezime, searchOdsjek]);

  const loadUsers = async () => {
    try {
      const result = await axios.get("http://localhost:8080/user");
      setUsers(result.data);
      setError(null);
    } catch (error) {
      setError("Greška pri učitavanju korisnika");
    }
  };

  const handleSearch = async () => {
    try {
      const params = {};
      if (searchImePrezime) params.imePrezime = searchImePrezime;
      if (searchOdsjek) params.odsjek = searchOdsjek;

      const result = await axios.get("http://localhost:8080/user/users/search", { params });
      setUsers(result.data);
      setError(null);
    } catch (error) {
      setError("Greška pri pretrazi korisnika");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite izbrisati ovog korisnika?")) {
      try {
        await axios.delete(`http://localhost:8080/user/${id}`);
        loadUsers();
      } catch (error) {
        setError("Greška pri brisanju korisnika: " + (error.response?.data || error.message));
      }
    }
  };

  const exportToExcel = () => {
    const data = users.map(user => {
      const base = {
        "Ime i Prezime": user.imePrezime,
        "Odsjek": user.odsjek,
        "Pozicija": user.pozicija,
        "Radno Vrijeme": user.radnoVrijeme,
        "Akademsko Zvanje": user.akademskoZvanje,
      };
      if (user.academics && user.academics.length > 0) {
        user.academics.forEach((academic, idx) => {
          base[`Godina ${idx + 1}`] = academic.academicYear;
          base[`Koeficijent ${idx + 1}`] = academic.ukupanKoeficijentZaJesenjiSemestar;
        });
      }
      return base;
    });
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Zaposlenici");
    XLSX.writeFile(workbook, "zaposlenici.xlsx");
  };

  return (
    <div className="container py-4">
      <div className="page-header text-center mb-4">
        <h3 className="fw-bold mb-2" style={{ fontSize: "2rem" }}>PREGLED ZAPOSLENIKA</h3>
        <p className="lead">Upravljanje koeficijentima akademskog osoblja</p>
      </div>

      <div className="search-form">
        <div className="row">
          <div className="col-md-5">
            <div className="form-group">
              <label className="form-label">Ime i Prezime</label>
              <input
                type="text"
                className="form-control"
                placeholder="Pretraži po imenu..."
                name="searchImePrezime"
                value={searchImePrezime}
                onChange={(e) => setSearchImePrezime(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-5">
            <div className="form-group">
              <label className="form-label">Odsjek</label>
              <input
                type="text"
                className="form-control"
                placeholder="Pretraži po odsjeku..."
                name="searchOdsjek"
                value={searchOdsjek}
                onChange={(e) => setSearchOdsjek(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-2 d-flex align-items-end gap-2">
            <button 
              className="btn btn-academic d-flex justify-content-center align-items-center"
              onClick={handleSearch}
              type="button"
              style={{ height: "36px", width: "75px" }}
            >
              <i className="fas fa-search" style={{ marginRight: "6px" }}></i>
              Pretraži
            </button>
            <button
              className="btn btn-academic d-flex justify-content-center align-items-center"
              onClick={exportToExcel}
              type="button"
              style={{ height: "36px", width: "75px" }}
            >
              Export
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger mt-3" role="alert">
          {error}
        </div>
      )}

      <div className="table-academic mt-3">
        <table className="table mb-0">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Slika</th>
              <th scope="col">Ime i Prezime</th>
              <th scope="col">Odsjek</th>
              <th scope="col">Pozicija</th>
              <th scope="col">Akademsko Zvanje</th>
              <th scope="col" className="text-center">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id}>
                <th scope="row">{index + 1}</th>
                <td>
                  {user.slikaPath ? (
                    <img 
                      src={`http://localhost:8080/uploads/${user.slikaPath}`}
                      alt={user.imePrezime}
                      className="profile-image"
                      style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div 
                      className="profile-image-placeholder"
                      style={{ 
                        width: '50px', 
                        height: '50px', 
                        backgroundColor: 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        borderRadius: '50%'
                      }}
                    >
                      {user.imePrezime.charAt(0)}
                    </div>
                  )}
                </td>
                <td>{user.imePrezime}</td>
                <td>{user.odsjek}</td>
                <td>{user.pozicija}</td>
                <td>{user.akademskoZvanje}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <Link
                      className="btn btn-academic btn-sm"
                      to={`/viewuser/${user.id}`}
                    >
                      <i className="fas fa-eye me-1"></i>
                      Pregled
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      <i className="fas fa-trash-alt me-1"></i>
                      Brisanje
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 