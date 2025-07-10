import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/global.css';

export default function Navbar() {
  return (
    <nav 
      className="navbar navbar-expand-lg navbar-dark" 
      style={{ backgroundColor: '#234668' }}
    >
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span 
            className="fw-normal me-4"
            style={{ 
              fontSize: '1.3rem',
              color: 'white'
            }}
          >
            IBU
          </span>
          <span 
            className="fw-normal"
            style={{ 
              fontSize: '1.1rem',
              color: 'white'
            }}
          >
            Sistem za upravljanje koeficijentima
          </span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className="btn btn-outline-light" 
                to="/adduser"
                style={{
                  padding: '6px 16px',
                  fontSize: '0.9rem'
                }}
              >
                Dodaj zaposlenika
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
