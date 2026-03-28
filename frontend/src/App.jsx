import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/authentification/Login";
import Register from "./pages/authentification/Register";

// Bibliothécaire
import BiblioLayout from "./layout/BiblioLayout";
import Livres from "./pages/biblio/livres/Livres";
import Emprunts from "./pages/biblio/emprunts/Emprunts";
import Retours from "./pages/biblio/retours/Retours";

// User
import UserLayout from "./layout/UserLayout";
import LivresUser from "./pages/user/livres/LivresUser";
import EmpruntsUser  from "./pages/user/emprunts/Emprunts";
import Notifications from "./pages/user/notifs/Notifs";

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
        <Route index element={<Livres />} />
        <Route path="emprunts" element={<Emprunts />} />
        <Route path="retours" element={<Retours />} />
      </Route>

      {/* Dashboard Utilisateur */}
      <Route
        path="/user"
        element={
          <RequireRole role="UTILISATEUR">
            <UserLayout />
          </RequireRole>
        }
      >
        <Route index element={<LivresUser />} />
        <Route path="emprunts" element={<EmpruntsUser />} />
        <Route path="notifs" element={<Notifications />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
