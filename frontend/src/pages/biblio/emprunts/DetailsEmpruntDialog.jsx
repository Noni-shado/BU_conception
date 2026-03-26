import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { EMPRUNT_STATUS, EMPRUNT_STATUS_CONFIG } from "../utils";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR");
};

export const DetailsEmpruntDialog = ({ open, onClose, emprunt }) => {
  const statutConfig = EMPRUNT_STATUS_CONFIG[emprunt?.statut] || {
    label: "-",
    color: "default",
  };

  const isRetourne = emprunt?.statut === EMPRUNT_STATUS.RETOURNE;
  const isRefuse = emprunt?.statut === EMPRUNT_STATUS.REFUSE;

  const commonTextFieldSx = {
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
      borderRadius: 3,
    },
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: "100%",
          maxWidth: 1000,
        },
      }}
    >
      <DialogTitle>Détails de l'emprunt</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Livre + utilisateur */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Livre"
              value={emprunt?.livre?.titre ?? "-"}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />

            <TextField
              label="Utilisateur"
              value={
                emprunt?.utilisateur?.nom_complet ||
                emprunt?.utilisateur?.email ||
                "-"
              }
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />
          </Stack>

          {/* Statut + date */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Statut"
              value={statutConfig.label}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />

            <TextField
              label="Date d'emprunt"
              value={formatDate(emprunt?.demande_le)}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />
          </Stack>

          {/* Date retour OU retour prévue */}
          {!isRefuse && (
            <TextField
              label={isRetourne ? "Date de retour" : "Date de retour prévue"}
              value={formatDate(
                isRetourne
                  ? emprunt?.retourne_le
                  : emprunt?.date_retour_prevue
              )}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />
          )}

          {/* 🔥 Motif de refus */}
          {isRefuse && (
            <TextField
              label="Motif de refus"
              value={emprunt?.motif_refus ?? "-"}
              fullWidth
              disabled
              multiline
              minRows={3}
              sx={commonTextFieldSx}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};