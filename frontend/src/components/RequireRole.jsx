import React from "react";
import { Navigate } from "react-router-dom";

export default function RequireRole({ role, children }) {
  const r = localStorage.getItem("role");
  console.log({r, role})
  if (r !== role) return <Navigate to="/login" replace />;
  return children;
}
