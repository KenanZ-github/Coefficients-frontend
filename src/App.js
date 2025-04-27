import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./Layout/Navbar";
import UserList from "./users/UserList";
import AddUser from "./users/AddUser";
import EditUser from "./users/EditUser";
import ViewUser from "./users/ViewUser";
import EditAcademicYear from "./users/EditAcademicYear";
import * as XLSX from "xlsx"; // Import za Excel

function App() {
  const exportToExcel = (users) => {
    const worksheet = XLSX.utils.json_to_sheet(users); // Kreiraj Excel sheet
    const workbook = XLSX.utils.book_new(); // Kreiraj novi workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users"); // Dodaj sheet u workbook
    XLSX.writeFile(workbook, "users.xlsx"); // Preuzmi Excel fajl
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route exact path="/" element={<UserList />} />
        <Route exact path="/adduser" element={<AddUser />} />
        <Route exact path="/edituser/:id" element={<EditUser />} />
        <Route exact path="/viewuser/:id" element={<ViewUser />} />
        <Route exact path="/editacademic/:userId/:academicId" element={<EditAcademicYear />} />
      </Routes>
    </div>
  );
}

export default App;
