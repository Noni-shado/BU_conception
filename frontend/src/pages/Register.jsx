import React, { useState } from "react";
import {
  Alert,
  Button,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "../components/AuthShell";
import { http } from "../api/http";

export default function Register() {
  const nav = useNavigate();
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState("UTILISATEUR");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      // Backend actuel: /auth/register?email=...&password=...
      await http.post("/auth/register", null, { params: { email, password } });

      // (option) si tu veux aussi stocker full_name/role côté backend plus tard
      // on le fera quand on améliorera l'API

      alert("Compte créé ✅ Tu peux te connecter.");
      nav("/login");
    } catch (e2) {
      setErr(e2?.response?.data?.detail || e2?.response?.data || "Inscription impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Inscription"
      subtitle="Crée un compte pour accéder aux fonctionnalités de la BU."
    >
      <Stack spacing={2}>
        <Typography fontWeight={800}>Créer un compte</Typography>
        <Typography variant="body2" color="text.secondary">
          (Démo) Choisis un rôle. Plus tard, on pourra le gérer uniquement côté admin.
        </Typography>

        {err ? <Alert severity="error">{String(err)}</Alert> : null}

        <form onSubmit={submit}>
          <Stack spacing={2}>
            <TextField
              label="Nom complet (optionnel)"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              fullWidth
            />

            <TextField
              select
              label="Rôle (démo)"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
            >
              <MenuItem value="UTILISATEUR">Utilisateur</MenuItem>
              <MenuItem value="BIBLIOTHECAIRE">Bibliothécaire</MenuItem>
              <MenuItem value="ADMIN">Administrateur</MenuItem>
            </TextField>

            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              fullWidth
            />

            <TextField
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              fullWidth
              helperText="Minimum 6 caractères recommandé"
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.2, fontWeight: 800 }}
            >
              {loading ? "Création..." : "Créer mon compte"}
            </Button>

            <Divider />

            <Typography variant="body2" color="text.secondary" textAlign="center">
              Déjà un compte ?{" "}
              <Link to="/login" style={{ fontWeight: 700, textDecoration: "none" }}>
                Se connecter
              </Link>
            </Typography>
          </Stack>
        </form>
      </Stack>
    </AuthShell>
  );
}
