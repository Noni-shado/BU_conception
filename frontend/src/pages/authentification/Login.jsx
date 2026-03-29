import React, { useState } from "react";
import {
  Alert,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AuthShell from "../../components/AuthShell";
import { http } from "../../api/http";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

const submit = async (e) => {
  e.preventDefault();
  setErr("");
  setLoading(true);
  try {
    const res = await http.post("/auth/login", {
      email,
      mot_de_passe: password,
    });

    const role = res.data?.role;
    localStorage.setItem("role", role || "UTILISATEUR");
    localStorage.setItem("utilisateur_id", String(res.data?.id ?? ""));
    localStorage.setItem("email", res.data?.email ?? "");

    if (role === "BIBLIOTHECAIRE") {
  nav("/biblio");
} else if (role === "UTILISATEUR") {
  nav("/user");
} else if (role === "ADMIN") {
  nav("/admin");
}else {
  nav("/");
}
  } catch (e2) {
    setErr(e2?.response?.data?.detail || "Connexion impossible");
  } finally {
    setLoading(false);
  }
};


  return (
    <AuthShell
      title="Connexion"
      subtitle="Accède à ton espace pour rechercher et gérer tes emprunts."
    >
      <Stack spacing={2}>
        <Typography fontWeight={800}>Bienvenue 👋</Typography>
        <Typography variant="body2" color="text.secondary">
          Connecte-toi avec ton email et ton mot de passe.
        </Typography>

        {err ? <Alert severity="error">{String(err)}</Alert> : null}

        <form onSubmit={submit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              fullWidth
              autoFocus
            />

            <TextField
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              required
              fullWidth
              id="mdp"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShow((s) => !s)} edge="end">
                      {show ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ py: 1.2, fontWeight: 800 }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>

            <Divider />

            {/* <Typography variant="body2" color="text.secondary" textAlign="center">
              Pas de compte ?{" "}
              <Link to="/register" style={{ fontWeight: 700, textDecoration: "none" }}>
                Créer un compte
              </Link>
            </Typography> */}
          </Stack>
        </form>
      </Stack>
    </AuthShell>
  );
}
