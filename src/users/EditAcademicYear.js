import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditAcademicYear() {
  const { userId, academicId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [academicYear, setAcademicYear] = useState({
    academicYear: "",
    proljetniKoeficijent: 0,
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
    ukupanKoeficijentZaJesenjiSemestar: ""
  });

  useEffect(() => {
    loadAcademicYear();
  }, [academicId]);

  const loadAcademicYear = async () => {
    try {
      setLoading(true);
      const result = await axios.get(`http://localhost:8080/user/${userId}/academic-year/${academicId}`);
      setAcademicYear(result.data);
    } catch (error) {
      console.error("Greška pri učitavanju:", error);
      setError("Greška pri učitavanju akademske godine");
    } finally {
      setLoading(false);
    }
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;
    let parsedValue = value;
    
    if (name !== "academicYear" && name !== "ukupanKoeficijentZaJesenjiSemestar") {
      parsedValue = value === "" ? 0 : parseFloat(value);
      if (["brojPredmeta", "brojStudenataNaOdsjeku"].includes(name)) {
        parsedValue = parseInt(value) || 0;
      }
    }

    setAcademicYear(prev => {
      const newState = { ...prev, [name]: parsedValue };
      if (name !== "ukupanKoeficijentZaJesenjiSemestar") {
        const ukupanKoeficijent = calculateUkupanKoeficijent(newState);
        newState.ukupanKoeficijentZaJesenjiSemestar = ukupanKoeficijent.toString();
      }
      return newState;
    });
  };

  const calculateUkupanKoeficijent = (data) => {
    return (
      (data.osnovniKoeficijent || 0) +
      (data.umanjenjeKoeficijentaZaRukovodioceIspodOptimuma || 0) +
      (data.povećanjeKoeficijentaZaRukovodiocePreko || 0) +
      (data.povećanjeKoeficijentaPoBrojuStudenata || 0) +
      (data.povećanjeKoeficijentaPoBrojuPredmeta || 0) +
      (data.koeficijentZaDekanaPoBrojuStudenataNaFakultetu || 0) +
      (data.koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku || 0) +
      (data.koeficijentZaDodatniStudijskiProgram || 1.0) +
      (data.dodatniKoeficijentZaPreko350StudenataNaOdsjeku || 0) +
      (data.dodatniKoeficijentZaAsistentaVisegAsistenta || 1.5)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8080/user/${userId}/academic-year/${academicId}`, academicYear);
      navigate(`/viewuser/${userId}`);
    } catch (error) {
      console.error("Greška pri ažuriranju:", error);
      setError("Greška pri ažuriranju akademske godine");
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Učitavanje...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={() => navigate(`/viewuser/${userId}`)}
        >
          Nazad
        </button>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8 offset-md-2 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Izmjena akademske godine</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Akademska godina */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Akademska Godina</label>
                <input
                  type="text"
                  className="form-control"
                  name="academicYear"
                  value={academicYear.academicYear}
                  onChange={onInputChange}
                  required
                  placeholder="npr. 2023/2024"
                />
              </div>

              {/* Proljetni koeficijent */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Proljetni Koeficijent</label>
                <input
                  type="number"
                  className="form-control"
                  name="proljetniKoeficijent"
                  value={academicYear.proljetniKoeficijent}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Opterećenje */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Opterećenje</label>
                <input
                  type="number"
                  className="form-control"
                  name="opterećenje"
                  value={academicYear.opterećenje}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Broj predmeta */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Broj Predmeta</label>
                <input
                  type="number"
                  className="form-control"
                  name="brojPredmeta"
                  value={academicYear.brojPredmeta}
                  onChange={onInputChange}
                  step="1"
                />
              </div>

              {/* Broj studenata na odsjeku */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Broj Studenata na Odsjeku</label>
                <input
                  type="number"
                  className="form-control"
                  name="brojStudenataNaOdsjeku"
                  value={academicYear.brojStudenataNaOdsjeku}
                  onChange={onInputChange}
                  step="1"
                />
              </div>

              {/* Osnovni koeficijent */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Osnovni Koeficijent</label>
                <input
                  type="number"
                  className="form-control"
                  name="osnovniKoeficijent"
                  value={academicYear.osnovniKoeficijent}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Umanjenje koeficijenta za rukovodioce */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Umanjenje Koef. za Rukovodioce</label>
                <input
                  type="number"
                  className="form-control"
                  name="umanjenjeKoeficijentaZaRukovodioceIspodOptimuma"
                  value={academicYear.umanjenjeKoeficijentaZaRukovodioceIspodOptimuma}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Povećanje koeficijenta za rukovodioce */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Povećanje Koef. za Rukovodioce</label>
                <input
                  type="number"
                  className="form-control"
                  name="povećanjeKoeficijentaZaRukovodiocePreko"
                  value={academicYear.povećanjeKoeficijentaZaRukovodiocePreko}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Povećanje po broju studenata */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Povećanje po Broju Studenata</label>
                <input
                  type="number"
                  className="form-control"
                  name="povećanjeKoeficijentaPoBrojuStudenata"
                  value={academicYear.povećanjeKoeficijentaPoBrojuStudenata}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Povećanje po broju predmeta */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Povećanje po Broju Predmeta</label>
                <input
                  type="number"
                  className="form-control"
                  name="povećanjeKoeficijentaPoBrojuPredmeta"
                  value={academicYear.povećanjeKoeficijentaPoBrojuPredmeta}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Koeficijent za dekana */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Koef. za Dekana</label>
                <input
                  type="number"
                  className="form-control"
                  name="koeficijentZaDekanaPoBrojuStudenataNaFakultetu"
                  value={academicYear.koeficijentZaDekanaPoBrojuStudenataNaFakultetu}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Koeficijent za šefa odsjeka */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Koef. za Šefa Odsjeka</label>
                <input
                  type="number"
                  className="form-control"
                  name="koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku"
                  value={academicYear.koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Koeficijent za dodatni program */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Koef. za Dodatni Program</label>
                <input
                  type="number"
                  className="form-control"
                  name="koeficijentZaDodatniStudijskiProgram"
                  value={academicYear.koeficijentZaDodatniStudijskiProgram}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Dodatni koeficijent za preko 350 studenata */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Dodatni Koef. >350 Studenata</label>
                <input
                  type="number"
                  className="form-control"
                  name="dodatniKoeficijentZaPreko350StudenataNaOdsjeku"
                  value={academicYear.dodatniKoeficijentZaPreko350StudenataNaOdsjeku}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Dodatni koeficijent za asistente */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Dodatni Koef. za Asistente</label>
                <input
                  type="number"
                  className="form-control"
                  name="dodatniKoeficijentZaAsistentaVisegAsistenta"
                  value={academicYear.dodatniKoeficijentZaAsistentaVisegAsistenta}
                  onChange={onInputChange}
                  step="0.01"
                />
              </div>

              {/* Ukupan koeficijent */}
              <div className="col-md-6 mb-3">
                <label className="form-label">Ukupan Koeficijent (Jesenji)</label>
                <input
                  type="text"
                  className="form-control"
                  value={academicYear.ukupanKoeficijentZaJesenjiSemestar}
                  readOnly
                  disabled
                />
              </div>
            </div>

            <div className="d-flex gap-2">
              <button type="submit" className="btn btn-primary">
                Sačuvaj izmjene
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => navigate(`/viewuser/${userId}`)}
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