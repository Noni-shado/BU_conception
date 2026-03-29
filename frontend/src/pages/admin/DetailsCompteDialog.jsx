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

export const DetailsCompteDialog = ({ open, onClose, compte }) => {
  if (!compte) return null;

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
          borderRadius: 2,
          width: "100%",
          maxWidth: 900,
        },
      }}
    >
      <DialogTitle>Détails du compte</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Nom complet"
            value={compte.nom_complet || ""}
            fullWidth
            disabled
            sx={commonTextFieldSx}
          />

          <TextField
            label="Email"
            value={compte.email || ""}
            fullWidth
            disabled
            sx={commonTextFieldSx}
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Rôle"
              value={compte.role || ""}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />

            <TextField
              label="Statut"
  value={compte.actif ? "Actif" : "Bloqué"}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
};