import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { http } from "../../api/http";

const ROLE_OPTIONS = [
  { value: "ADMIN", label: "Admin" },
  { value: "BIBLIOTHECAIRE", label: "Bibliothécaire" },
  { value: "UTILISATEUR", label: "Utilisateur" },
];

const initialForm = {
  nom_complet: "",
  email: "",
  mot_de_passe: "",
  role: "UTILISATEUR",
};

export const AjouterCompteDialog = ({
  open,
  onClose,
  onSuccess,
  onError,
}) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initialForm);
      setErrors({});
      setLoading(false);
    }
  }, [open]);

  const handleChange = (field) => (event) => {
    const value = event.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.nom_complet.trim()) {
      newErrors.nom_complet = "Le nom complet est obligatoire.";
    }

    if (!form.email.trim()) {
      newErrors.email = "L'email est obligatoire.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Veuillez saisir un email valide.";
    }

    if (!form.mot_de_passe.trim()) {
      newErrors.mot_de_passe = "Le mot de passe est obligatoire.";
    } else if (form.mot_de_passe.trim().length < 6) {
      newErrors.mot_de_passe =
        "Le mot de passe doit contenir au moins 6 caractères.";
    }

    if (!form.role) {
      newErrors.role = "Le rôle est obligatoire.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isDisabled = useMemo(() => {
    return (
      loading ||
      !form.nom_complet.trim() ||
      !form.email.trim() ||
      !form.mot_de_passe.trim() ||
      !form.role
    );
  }, [form, loading]);

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await http.post("/admin/comptes", {
        nom_complet: form.nom_complet.trim(),
        email: form.email.trim(),
        mot_de_passe: form.mot_de_passe,
        role: form.role,
      });

      onSuccess?.();
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "Erreur lors de l'ajout du compte.";
      onError?.(message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (loading) return;
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un compte</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nom complet"
            value={form.nom_complet}
            onChange={handleChange("nom_complet")}
            fullWidth
            required
            error={!!errors.nom_complet}
            helperText={errors.nom_complet}
            autoFocus
          />

          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange("email")}
            fullWidth
            required
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Mot de passe"
            type="password"
            value={form.mot_de_passe}
            onChange={handleChange("mot_de_passe")}
            fullWidth
            required
            error={!!errors.mot_de_passe}
            helperText={errors.mot_de_passe}
          />

          <TextField
            select
            label="Rôle"
            value={form.role}
            onChange={handleChange("role")}
            fullWidth
            required
            error={!!errors.role}
            helperText={errors.role}
          >
            {ROLE_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={loading}>
          Annuler
        </Button>

        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isDisabled}
        >
          Ajouter
        </Button>
      </DialogActions>
    </Dialog>
  );
};