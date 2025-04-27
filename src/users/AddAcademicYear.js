import React, { useState } from "react";
import axios from "axios";

export default function AddAcademicYear({ userId, onSuccess, onCancel }) {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const validateForm = () => {
    if (!academicYear.academicYear) {
      setError("Akademska godina je obavezna");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await axios.post(`http://localhost:8080/user/${userId}/academic-year`, academicYear);
      onSuccess();
    } catch (error) {
      console.error("Greška pri dodavanju akademske godine:", error);
      setError(error.response?.data || "Greška pri dodavanju akademske godine");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { label: "Akademska Godina", name: "academicYear", type: "text", placeholder: "npr. 2023/2024" },
    { label: "Proljetni Koeficijent", name: "proljetniKoeficijent", type: "number" },
    { label: "Opterećenje", name: "opterećenje", type: "number" },
    { label: "Broj Predmeta", name: "brojPredmeta", type: "number", step: "1" },
    { label: "Broj Studenata na Odsjeku", name: "brojStudenataNaOdsjeku", type: "number", step: "1" },
    { label: "Osnovni Koeficijent", name: "osnovniKoeficijent", type: "number" },
    { label: "Umanjenje Koef. za Rukovodioce", name: "umanjenjeKoeficijentaZaRukovodioceIspodOptimuma", type: "number" },
    { label: "Povećanje Koef. za Rukovodioce", name: "povećanjeKoeficijentaZaRukovodiocePreko", type: "number" },
    { label: "Povećanje po Broju Studenata", name: "povećanjeKoeficijentaPoBrojuStudenata", type: "number" },
    { label: "Povećanje po Broju Predmeta", name: "povećanjeKoeficijentaPoBrojuPredmeta", type: "number" },
    { label: "Koef. za Dekana", name: "koeficijentZaDekanaPoBrojuStudenataNaFakultetu", type: "number" },
    { label: "Koef. za Šefa Odsjeka", name: "koeficijentZaSefaOdsjekaPoBrojuStudenataNaOdsjeku", type: "number" },
    { label: "Koef. za Dodatni Program", name: "koeficijentZaDodatniStudijskiProgram", type: "number" },
    { label: "Dodatni Koef. >350 Studenata", name: "dodatniKoeficijentZaPreko350StudenataNaOdsjeku", type: "number" },
    { label: "Dodatni Koef. za Asistente", name: "dodatniKoeficijentZaAsistentaVisegAsistenta", type: "number" }
  ];

  return (
    <div className="border rounded p-4 mb-4 shadow-sm">
      <h4 className="mb-3">Dodaj novu akademsku godinu</h4>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row">
          {formFields.map((field) => (
            <div className="col-md-6 mb-3" key={field.name}>
              <label className="form-label">{field.label}</label>
              <input
                type={field.type}
                className="form-control"
                name={field.name}
                value={academicYear[field.name] ?? ""}
                onChange={onInputChange}
                step={field.step || "0.01"}
                placeholder={field.placeholder}
                required={field.name === "academicYear"}
              />
            </div>
          ))}

          <div className="col-md-6 mb-3">
            <label className="form-label">Ukupan Koeficijent (Jesenji Semestar)</label>
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
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Sačuvavanje...
              </>
            ) : (
              'Sačuvaj'
            )}
          </button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Otkaži
          </button>
        </div>
      </form>
    </div>
  );
} 