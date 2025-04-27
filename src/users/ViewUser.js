import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AddAcademicYear from "./AddAcademicYear";

export default function ViewUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAcademicId, setEditingAcademicId] = useState(null);
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
      console.error("Greška pri učitavanju korisnika:", error);
      setError(error.response?.data || "Greška pri učitavanju korisnika");
      if (error.response?.status === 404) {
        navigate("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAcademicYearAdded = () => {
    loadUser();
    setShowAddForm(false);
  };

  const handleDeleteAcademicYear = async (academicId) => {
    if (window.confirm('Da li ste sigurni da želite izbrisati ovu akademsku godinu?')) {
      try {
        await axios.delete(`http://localhost:8080/user/${id}/academic-year/${academicId}`);
        loadUser();
      } catch (error) {
        console.error("Greška pri brisanju akademske godine:", error);
        alert('Greška pri brisanju akademske godine');
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
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-center m-0">Detalji zaposlenika</h2>
            <Link 
              to={`/edituser/${id}`}
              className="btn btn-primary"
            >
              Izmijeni detalje korisnika
            </Link>
          </div>

          <div className="card mb-4">
            <div className="card-header">
              <h3>Osnovni podaci</h3>
              {user.slikaPath && (
                <img
                  src={`http://localhost:8080/uploads/${user.slikaPath}`}
                  alt={user.imePrezime}
                  className="img-fluid mb-3"
                  style={{ maxWidth: '200px' }}
                />
              )}
            </div>
            <div className="card-body">
              <div className="row mb-2">
                <div className="col-sm-3">
                  <strong>Ime i Prezime:</strong>
                </div>
                <div className="col-sm-9">{user.imePrezime}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-3">
                  <strong>Odsjek:</strong>
                </div>
                <div className="col-sm-9">{user.odsjek}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-3">
                  <strong>Pozicija:</strong>
                </div>
                <div className="col-sm-9">{user.pozicija}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-3">
                  <strong>Radno Vrijeme:</strong>
                </div>
                <div className="col-sm-9">{user.radnoVrijeme}</div>
              </div>
              <div className="row mb-2">
                <div className="col-sm-3">
                  <strong>Akademsko Zvanje:</strong>
                </div>
                <div className="col-sm-9">{user.akademskoZvanje}</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h3>Akademske godine</h3>
              <button 
                className="btn btn-primary"
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? 'Otkaži' : 'Dodaj akademsku godinu'}
              </button>
            </div>

            {showAddForm && (
              <AddAcademicYear 
                userId={id} 
                onSuccess={handleAcademicYearAdded}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {user.academics && user.academics.length > 0 ? (
              user.academics.map((academic) => (
                <div key={academic.id} className="border rounded p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h4>Akademska godina: {academic.academicYear}</h4>
                    <div>
                      <button 
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => navigate(`/editacademic/${id}/${academic.id}`)}
                      >
                        Izmijeni
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteAcademicYear(academic.id)}
                      >
                        Izbriši
                      </button>
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6">
                      <p><strong>Proljetni Koeficijent:</strong> {academic.proljetniKoeficijent}</p>
                      <p><strong>Opterećenje:</strong> {academic.opterećenje}</p>
                      <p><strong>Broj Predmeta:</strong> {academic.brojPredmeta}</p>
                      <p><strong>Broj Studenata na Odsjeku:</strong> {academic.brojStudenataNaOdsjeku}</p>
                      <p><strong>Osnovni Koeficijent:</strong> {academic.osnovniKoeficijent}</p>
                      <p><strong>Umanjenje Koef. za Rukovodioce:</strong> {academic.umanjenjeKoeficijentaZaRukovodioceIspodOptimuma}</p>
                      <p><strong>Povećanje Koef. za Rukovodioce:</strong> {academic.povećanjeKoeficijentaZaRukovodiocePreko}</p>
                    </div>
                    <div className="col-md-6">
                      <p><strong>Povećanje po Broju Studenata:</strong> {academic.povećanjeKoeficijentaPoBrojuStudenata}</p>
                      <p><strong>Povećanje po Broju Predmeta:</strong> {academic.povećanjeKoeficijentaPoBrojuPredmeta}</p>
                      <p><strong>Koef. za Dekana:</strong> {academic.koeficijentZaDekanaPoBrojuStudenataNaFakultetu}</p>
                      <p><strong>Koef. za Šefa Odsjeka:</strong> {academic.koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku}</p>
                      <p><strong>Koef. za Dodatni Program:</strong> {academic.koeficijentZaDodatniStudijskiProgram}</p>
                      <p><strong>Dodatni Koef. 350 Studenata:</strong> {academic.dodatniKoeficijentZaPreko350StudenataNaOdsjeku}</p>
                      <p><strong>Dodatni Koef. za Asistente:</strong> {academic.dodatniKoeficijentZaAsistentaVisegAsistenta}</p>
                      <p><strong>Ukupan Koeficijent (Jesenji):</strong> {academic.ukupanKoeficijentZaJesenjiSemestar}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Nema unesenih akademskih godina</p>
            )}
          </div>

          <div className="mt-3">
            <Link to="/" className="btn btn-secondary">
              Nazad na početnu
            </Link>
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
