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

const buildForm = (compte) => ({
  nom_complet: compte?.nom_complet || "",
  email: compte?.email || "",
  role: compte?.role || "UTILISATEUR",
});

export const ModifierCompteDialog = ({
  open,
  onClose,
  compte,
  onSuccess,
  onError,
}) => {
  const [form, setForm] = useState(buildForm(compte));
  const [initialForm, setInitialForm] = useState(buildForm(compte));
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      const nextForm = buildForm(compte);
      setForm(nextForm);
      setInitialForm(nextForm);
      setErrors({});
      setLoading(false);
    }
  }, [open, compte]);

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

    if (!form.role) {
      newErrors.role = "Le rôle est obligatoire.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isDirty = useMemo(() => {
    return JSON.stringify(form) !== JSON.stringify(initialForm);
  }, [form, initialForm]);

  const isDisabled = useMemo(() => {
    return (
      loading ||
      !isDirty ||
      !form.nom_complet.trim() ||
      !form.email.trim() ||
      !form.role
    );
  }, [form, loading, isDirty]);

  const handleSubmit = async () => {
    if (!compte?.id) return;
    if (!validate()) return;

    setLoading(true);

    try {
      await http.put(`/admin/comptes/${compte.id}`, {
        nom_complet: form.nom_complet.trim(),
        email: form.email.trim(),
        role: form.role,
      });

      onSuccess?.();
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "Erreur lors de la modification du compte.";
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
      <DialogTitle>Modifier le compte</DialogTitle>

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
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
};