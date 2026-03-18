import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

// Bibliothécaire
import BiblioLayout from "./layout/BiblioLayout";
import Livres from "./pages/biblio/Livres";
import Emprunts from "./pages/biblio/Emprunts";
import Retours from "./pages/biblio/Retours";

// Guard rôle (optionnel mais conseillé)
import RequireRole from "./components/RequireRole";



export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard Bibliothécaire */}
      <Route
        path="/biblio"
        element={
          <RequireRole role="BIBLIOTHECAIRE">
            <BiblioLayout />
          </RequireRole>
        }
      >
        {/* /biblio => livres */}
        <Route index element={<Livres />} />
        <Route path="emprunts" element={<Emprunts />} />
        <Route path="retours" element={<Retours />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
