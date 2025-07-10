import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imePrezimeTerm, setImePrezimeTerm] = useState("");
  const [odsjekTerm, setOdsjekTerm] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await axios.get("http://localhost:8080/user");
      console.log("API Response:", result.data);
      
      if (Array.isArray(result.data)) {
        setUsers(result.data);
      } else {
        console.error("API did not return an array:", result.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error loading users:", error);
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
      const params = new URLSearchParams();
      if (imePrezimeTerm.trim() !== "") params.append("imePrezime", imePrezimeTerm);
      if (odsjekTerm.trim() !== "") params.append("odsjek", odsjekTerm);
    
      const url = params.toString() !== "" 
        ? `http://localhost:8080/user/users/search?${params.toString()}`
        : "http://localhost:8080/user";

      const result = await axios.get(url);
      console.log("Search results:", result.data);
      setUsers(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      console.error("Error searching users:", error);
      setError("Greška pri pretraživanju");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Jeste li sigurni da želite izbrisati ovog korisnika?")) {
      try {
        await axios.delete(`http://localhost:8080/user/${id}`);
        loadUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Greška pri brisanju korisnika");
      }
    }
  };

  const exportToExcel = () => {
    if (users.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(users);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      XLSX.writeFile(workbook, "users.xlsx");
    } else {
      alert("Nema podataka za izvoz");
    }
  };

  return (
    <div className="container">
      <div className="py-4">
        {/* Search and Export Controls */}
        <div className="d-flex mb-3 align-items-center gap-2">
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: "250px" }}
            placeholder="Ime i prezime"
            value={imePrezimeTerm}
            onChange={(e) => setImePrezimeTerm(e.target.value)}
          />
          <input
            type="text"
            className="form-control"
            style={{ maxWidth: "250px" }}
            placeholder="Odsjek"
            value={odsjekTerm}
            onChange={(e) => setOdsjekTerm(e.target.value)}
          />
          <button 
            className="btn btn-primary" 
            onClick={handleSearch}
            disabled={loading}
            style={{ height: "40px", width: "90px" }}
          >
            {loading ? "Učitavanje..." : "Pretraga"}
          </button>
          <button 
            className="btn btn-success" 
            onClick={exportToExcel}
            disabled={users.length === 0}
            style={{ height: "40px", width: "90px" }}
          >
            Export to Excel
          </button>
          <Link to="/adduser" className="btn btn-primary">
            Dodaj novog zaposlenika
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {/* Loading Message */}
        {loading && (
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <>
            {users.length > 0 ? (
              <table className="table border shadow">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Ime Prezime</th>
                    <th scope="col">Odsjek</th>
                    <th scope="col">Pozicija</th>
                    <th scope="col">Akademsko Zvanje</th>
                    <th scope="col">Akcije</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id || index}>
                      <th scope="row">{index + 1}</th>
                      <td>{user.imePrezime}</td>
                      <td>{user.odsjek}</td>
                      <td>{user.pozicija}</td>
                      <td>{user.akademskoZvanje}</td>
                      <td>
                        <Link 
                          className="btn btn-primary btn-sm mx-1" 
                          to={`/viewuser/${user.id}`}
                        >
                          View
                        </Link>
                        <Link 
                          className="btn btn-outline-primary btn-sm mx-1" 
                          to={`/edituser/${user.id}`}
                        >
                          Edit
                        </Link>
                        <button 
                          className="btn btn-danger btn-sm mx-1"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-center">Nema pronađenih zaposlenika.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
