import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [imePrezimeTerm, setImePrezimeTerm] = useState("");  // Dodano
  const [odsjekTerm, setOdsjekTerm] = useState("");  // Dodano

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const result = await axios.get("http://localhost:8080/user");
    setUsers(result.data);
  };

  const handleSearch = async () => {
    const params = new URLSearchParams();
    if (imePrezimeTerm.trim() !== "") params.append("imePrezime", imePrezimeTerm);
    if (odsjekTerm.trim() !== "") params.append("odsjek", odsjekTerm);
  
    if (params.toString() !== "") {
      const result = await axios.get(`http://localhost:8080/user/users/search?${params.toString()}`);
      setUsers(result.data);
    } else {
      loadUsers();
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/user/${id}`);
      loadUsers();
    } catch (error) {
      console.error("There was an error deleting the user!", error);
    }
  };

  const exportToExcel = () => {
    if (users.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(users);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
      XLSX.writeFile(workbook, "users.xlsx");
    } else {
      console.warn("No users to export.");
    }
  };

  return (
    <div className="container">
      <div className="py-4">
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
          <button className="btn btn-primary" onClick={handleSearch}>
            Pretraga
          </button>
          <button className="btn btn-success" onClick={exportToExcel}>
            Export to Excel
          </button>
        </div>

        {users.length > 0 ? (
          <table className="table border shadow">
            <thead>
              <tr>
                <th>#</th>
                <th>Ime Prezime</th>
                <th>Odsjek</th>
                <th>Pozicija</th>
                <th>Proljetni Koeficijent</th>
                <th>Akcija</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{user.imePrezime}</td>
                  <td>{user.odsjek}</td>
                  <td>{user.pozicija}</td>
                  <td>{user.proljetniKoeficijent}</td>
                  <td>
                    <Link className="btn btn-primary mx-2" to={`/viewuser/${user.id}`}>
                      View
                    </Link>
                    <Link className="btn btn-outline-primary mx-2" to={`/edituser/${user.id}`}>
                      Edit
                    </Link>
                    <button className="btn btn-danger mx-2" onClick={() => deleteUser(user.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nema pronađenih zaposlenika.</p>
        )}
      </div>
    </div>
  );
}
