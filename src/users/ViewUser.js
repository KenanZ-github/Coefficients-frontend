import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddAcademicYear from "./AddAcademicYear";
import "../styles/global.css";

export default function ViewUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedAcademics, setExpandedAcademics] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
      loadUser();
  }, [id]);
  
  const loadUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await axios.get(`http://localhost:8080/user/${id}`);
      setUser(result.data);
    } catch (error) {
      setError(error.response?.data || "Greška pri učitavanju korisnika");
      if (error.response?.status === 404) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleAcademic = (id) => {
    setExpandedAcademics((prev) =>
      prev.includes(id) ? prev.filter((aid) => aid !== id) : [...prev, id]
    );
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
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link className="btn btn-primary" to="/">
          Nazad na početnu
        </Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          Korisnik nije pronađen
        </div>
        <Link className="btn btn-primary" to="/">
          Nazad na početnu
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-lg border-0 mb-4">
            <div className="card-body p-4">
              <div className="d-flex flex-column align-items-center mb-4">
                <div className="mb-3">
                  {user.slikaPath ? (
                    <img
                      src={`http://localhost:8080/uploads/${user.slikaPath}`}
                      alt={user.imePrezime}
                      className="profile-image"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        border: "4px solid var(--primary-color)",
                        boxShadow: "0 2px 8px rgba(30,61,89,0.15)"
                      }}
                    />
                  ) : (
                    <div
                      className="profile-image"
                      style={{
                        width: "120px",
                        height: "120px",
                        background: "var(--primary-color)",
                        color: "#fff",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "2.5rem",
                        fontWeight: "bold",
                        border: "4px solid var(--primary-color)",
                        boxShadow: "0 2px 8px rgba(30,61,89,0.15)"
                      }}
                    >
                      {user.imePrezime ? user.imePrezime.charAt(0) : "?"}
            </div>
                  )}
                </div>
                <h2 className="mb-2">{user.imePrezime}</h2>
                <div className="text-center">
                  <div className="text-muted mb-1">
                    <i className="fas fa-graduation-cap me-2 text-primary"></i>
                    <strong>Akademsko zvanje:</strong> {user.akademskoZvanje}
                  </div>
                  <div className="text-muted mb-1">
                    <i className="fas fa-building me-2 text-primary"></i>
                    <strong>Odsjek:</strong> {user.odsjek}
                  </div>
                  <div className="text-muted mb-1">
                    <i className="fas fa-briefcase me-2 text-primary"></i>
                    <strong>Pozicija:</strong> {user.pozicija}
                  </div>
                  <div className="text-muted">
                    <i className="fas fa-clock me-2 text-primary"></i>
                    <strong>Radno vrijeme:</strong> {user.radnoVrijeme}
                  </div>
                </div>
              </div>
              <div className="text-center mt-4">
                <button
                  className="btn btn-academic me-2"
                  onClick={() => navigate(`/edituser/${id}`)}
                >
                  <i className="fas fa-edit me-1"></i>
                  Izmijeni detalje korisnika
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate("/")}
                >
                  Nazad na početnu
                </button>
          </div>
        </div>
      </div>

          {/* Akademske godine */}
          <div className="card shadow-sm border-0">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h4 className="mb-0">Akademske godine</h4>
            <button 
                className="btn btn-academic"
              onClick={() => setShowAddForm(!showAddForm)}
            >
                {showAddForm ? "Otkaži" : "Dodaj akademsku godinu"}
            </button>
          </div>
            <div className="card-body">
          {showAddForm && (
            <AddAcademicYear 
              userId={id} 
                  onSuccess={() => {
                    loadUser();
                    setShowAddForm(false);
                  }}
              onCancel={() => setShowAddForm(false)}
            />
          )}
              {user.academics && user.academics.length > 0 ? (
                user.academics.map((academic) => (
                  <div
                    key={academic.id}
                    className="academic-card mb-3 p-0"
                    style={{
                      borderLeft: "6px solid var(--primary-color)",
                      background: "#f8fafc",
                      cursor: "pointer"
                    }}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center p-3"
                      onClick={() => toggleAcademic(academic.id)}
                      style={{ userSelect: "none" }}
                    >
                      <div>
                        <h5 className="mb-1">
                          <i className="fas fa-calendar-alt me-2 text-primary"></i>
                          {academic.academicYear}
                        </h5>
                        <div style={{ marginLeft: '20px' }}>
                          Ukupan koeficijent: {academic.ukupanKoeficijentZaJesenjiSemestar}
                        </div>
                      </div>
                      <div className="d-flex gap-2" onClick={e => e.stopPropagation()}>
                        <button
                          className="btn btn-academic btn-sm"
                          onClick={() => navigate(`/editacademic/${id}/${academic.id}`)}
                        >
                          <i className="fas fa-edit me-1"></i> Izmijeni
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={async () => {
                            if (window.confirm("Da li ste sigurni da želite izbrisati ovu akademsku godinu?")) {
                              await axios.delete(`http://localhost:8080/user/${id}/academic-year/${academic.id}`);
                              loadUser();
                            }
                          }}
                        >
                          <i className="fas fa-trash-alt me-1"></i> Obriši
                  </button>
                </div>
              </div>
                    {expandedAcademics.includes(academic.id) && (
                      <div className="p-3 pt-0">
                        <table className="table table-bordered table-sm mb-0">
                          <tbody>
                            <tr>
                              <th>Proljetni koeficijent</th>
                              <td>{academic.proljetniKoeficijent}</td>
                            </tr>
                            <tr>
                              <th>Opterećenje</th>
                              <td>{academic.opterećenje}</td>
                            </tr>
                            <tr>
                              <th>Broj predmeta</th>
                              <td>{academic.brojPredmeta}</td>
                            </tr>
                            <tr>
                              <th>Broj studenata na odsjeku</th>
                              <td>{academic.brojStudenataNaOdsjeku}</td>
                            </tr>
                            <tr>
                              <th>Osnovni koeficijent</th>
                              <td>{academic.osnovniKoeficijent}</td>
                            </tr>
                            <tr>
                              <th>Umanjenje koef. za rukovodioce ispod optimuma</th>
                              <td>{academic.umanjenjeKoeficijentaZaRukovodioceIspodOptimuma}</td>
                            </tr>
                            <tr>
                              <th>Povećanje koef. za rukovodioce preko</th>
                              <td>{academic.povećanjeKoeficijentaZaRukovodiocePreko}</td>
                            </tr>
                            <tr>
                              <th>Povećanje po broju studenata</th>
                              <td>{academic.povećanjeKoeficijentaPoBrojuStudenata}</td>
                            </tr>
                            <tr>
                              <th>Povećanje po broju predmeta</th>
                              <td>{academic.povećanjeKoeficijentaPoBrojuPredmeta}</td>
                            </tr>
                            <tr>
                              <th>Koef. za dekana</th>
                              <td>{academic.koeficijentZaDekanaPoBrojuStudenataNaFakultetu}</td>
                            </tr>
                            <tr>
                              <th>Koef. za šefa odsjeka</th>
                              <td>{academic.koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku}</td>
                            </tr>
                            <tr>
                              <th>Koef. za dodatni program</th>
                              <td>{academic.koeficijentZaDodatniStudijskiProgram}</td>
                            </tr>
                            <tr>
                              <th>Dodatni koef. >350 studenata</th>
                              <td>{academic.dodatniKoeficijentZaPreko350StudenataNaOdsjeku}</td>
                            </tr>
                            <tr>
                              <th>Dodatni koef. za asistente</th>
                              <td>{academic.dodatniKoeficijentZaAsistentaVisegAsistenta}</td>
                            </tr>
                            <tr>
                              <th>Ukupan koeficijent (jesenji)</th>
                              <td>{academic.ukupanKoeficijentZaJesenjiSemestar}</td>
                            </tr>
                          </tbody>
                        </table>
                </div>
                    )}
                </div>
                ))
              ) : (
                <div className="text-muted">Nema unesenih akademskih godina.</div>
              )}
        </div>
      </div>
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
