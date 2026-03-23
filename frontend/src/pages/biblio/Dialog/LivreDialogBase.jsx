import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

export const LivreDialogBase = ({
  open,
  onClose,
  onSubmit,
  title,
  submitLabel,
  loading = false,
  livre = null,
  isAdd = false,
  isEdit = false,
  isDetails = false,
}) => {
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [nbTotal, setNbTotal] = useState(1);
  const [nbDisponible, setNbDisponible] = useState(1);

  const titreRef = useRef(null);
  const disabled = isDetails;

  useEffect(() => {
    if (!open) return;

    if (isAdd) {
      setTitre("");
      setAuteur("");
      setIsbn("");
      setDescription("");
      setNbTotal(1);
      setNbDisponible(1);
    } else if (livre) {
      setTitre(livre.titre ?? "");
      setAuteur(livre.auteur ?? "");
      setIsbn(livre.isbn ?? "");
      setDescription(livre.description ?? "");
      setNbTotal(livre.nb_total ?? 1);
      setNbDisponible(livre.nb_disponible ?? 1);
    }
  }, [open, livre, isAdd]);

  useEffect(() => {
    if (!open || isDetails) return;

    const timer = setTimeout(() => {
      titreRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [open, isDetails]);

  const handleSubmit = () => {
    if (isDetails) {
      onClose?.();
      return;
    }

    onSubmit?.({
      titre,
      auteur,
      isbn,
      description,
      nb_total: Number(nbTotal),
      nb_disponible: Number(nbDisponible),
    });
  };

  const commonTextFieldSx = {
    "& .MuiFormLabel-asterisk": {
      color: "error.main",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#111827",
      color: "#111827",
    },
    "& .MuiInputLabel-root.Mui-disabled": {
      color: "#374151",
    },
    "& .MuiInputBase-root.Mui-disabled": {
      backgroundColor: "#fff",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      scroll="paper"
      PaperProps={{
        sx: {
          borderRadius: 3,
          width: "100%",
          maxWidth: 900,
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              inputRef={titreRef}
              label="Titre"
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              required={!isDetails}
              fullWidth
              disabled={disabled}
              sx={commonTextFieldSx}
            />

            <TextField
              label="Auteur"
              value={auteur}
              onChange={(e) => setAuteur(e.target.value)}
              required={!isDetails}
              fullWidth
              disabled={disabled}
              sx={commonTextFieldSx}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="ISBN (optionnel)"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              fullWidth
              disabled={disabled}
              sx={commonTextFieldSx}
            />

            <TextField
              label="Nombre total d'exemplaires"
              type="number"
              value={nbTotal}
              onChange={(e) => setNbTotal(e.target.value)}
              inputProps={{ min: 0 }}
              required={!isDetails}
              fullWidth
              disabled={disabled}
              sx={commonTextFieldSx}
            />
          </Stack>

          {(isEdit || isDetails) && (
            <TextField
              label="Nombre disponible"
              type="number"
              value={nbDisponible}
              onChange={(e) => setNbDisponible(e.target.value)}
              inputProps={{ min: 0 }}
              required={!isDetails}
              fullWidth
              disabled={disabled}
              helperText={
                isEdit ? "nb_disponible ne doit pas dépasser nb_total" : ""
              }
              sx={commonTextFieldSx}
            />
          )}

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            fullWidth
            disabled={disabled}
            sx={commonTextFieldSx}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>
          {isDetails ? "Fermer" : "Annuler"}
        </Button>

        {!isDetails && (
          <Button onClick={handleSubmit} variant="contained" disabled={loading}>
            {submitLabel}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}