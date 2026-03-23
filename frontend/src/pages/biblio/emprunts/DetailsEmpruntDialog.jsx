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
import { EMPRUNT_STATUS_CONFIG } from "../utils";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR");
};

export const DetailsEmpruntDialog = ({ open, onClose, emprunt }) => {
  const statutConfig = EMPRUNT_STATUS_CONFIG[emprunt?.statut] || {
    label: "-",
    color: "default",
  };

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
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Livre"
              value={emprunt?.livre ?? "-"}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />

            <TextField
              label="Utilisateur"
              value={emprunt?.utilisateur ?? "-"}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />
          </Stack>

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
              value={formatDate(emprunt?.date_emprunt ?? emprunt?.date)}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />
          </Stack>

          <TextField
            label="Date de retour prévue"
            value={formatDate(emprunt?.date_retour_prevue)}
            fullWidth
            disabled
            sx={commonTextFieldSx}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};