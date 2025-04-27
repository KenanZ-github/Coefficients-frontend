import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    imePrezime: "",
    odsjek: ""
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await axios.get("http://localhost:8080/user");
      setUsers(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Greška pri učitavanju korisnika:", error);
      setError("Greška pri učitavanju korisnika");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      let searchQuery = "http://localhost:8080/user/users/search?";
      if (searchParams.imePrezime) {
        searchQuery += `imePrezime=${encodeURIComponent(searchParams.imePrezime)}&`;
      }
      if (searchParams.odsjek) {
        searchQuery += `odsjek=${encodeURIComponent(searchParams.odsjek)}`;
      }
      const result = await axios.get(searchQuery);
      setUsers(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Greška pri pretrazi:", error);
      setError("Greška pri pretrazi korisnika");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Da li ste sigurni da želite izbrisati ovog korisnika?")) {
      try {
        await axios.delete(`http://localhost:8080/user/${id}`);
        loadUsers();
      } catch (error) {
        console.error("Greška pri brisanju korisnika:", error);
        alert("Greška pri brisanju korisnika: " + (error.response?.data || error.message));
      }
    }
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Učitavanje...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-3">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="py-4">
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Pretraga korisnika</h5>
                <div className="row">
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ime i prezime"
                      value={searchParams.imePrezime}
                      onChange={(e) => setSearchParams({...searchParams, imePrezime: e.target.value})}
                    />
                  </div>
                  <div className="col-md-5">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Odsjek"
                      value={searchParams.odsjek}
                      onChange={(e) => setSearchParams({...searchParams, odsjek: e.target.value})}
                    />
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-primary w-100" onClick={handleSearch}>
                      Pretraži
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table border shadow">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Slika</th>
                    <th scope="col">Ime i Prezime</th>
                    <th scope="col">Odsjek</th>
                    <th scope="col">Pozicija</th>
                    <th scope="col">Akademsko Zvanje</th>
                    <th scope="col">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <th scope="row">{index + 1}</th>
                      <td>
                        {user.slikaPath && (
                          <img 
                            src={`http://localhost:8080/uploads/${user.slikaPath}`}
                            alt={user.imePrezime}
                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          />
                        )}
                      </td>
                      <td>{user.imePrezime}</td>
                      <td>{user.odsjek}</td>
                      <td>{user.pozicija}</td>
                      <td>{user.akademskoZvanje}</td>
                      <td>
                        <Link
                          className="btn btn-primary mx-1"
                          to={`/viewuser/${user.id}`}
                        >
                          Pregled
                        </Link>
                        <button
                          className="btn btn-danger mx-1"
                          onClick={() => handleDelete(user.id)}
                        >
                          Brisanje
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 