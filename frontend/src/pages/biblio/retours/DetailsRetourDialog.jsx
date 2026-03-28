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
import { RETOUR_STATUS, RETOUR_STATUS_CONFIG } from "../utils";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR");
};

export const DetailsRetourDialog = ({ open, onClose, retour }) => {
  const statutConfig = RETOUR_STATUS_CONFIG[retour?.statut] || {
    label: "-",
    color: "default",
  };

  const isRetourne = retour?.statut === RETOUR_STATUS.RETOURNE;

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
      <DialogTitle>Détails du retour</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {/* Livre + utilisateur */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Livre"
              value={retour?.livre?.titre ?? "-"}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />

            <TextField
              label="Utilisateur"
              value={
                retour?.utilisateur?.nom_complet ||
                retour?.utilisateur?.email ||
                "-"
              }
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />
          </Stack>

          {/* Email + statut */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Email"
              value={retour?.utilisateur?.email ?? "-"}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />

            <TextField
              label="Statut"
              value={statutConfig.label}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />
          </Stack>

          {/* Dates */}
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Date de retour prévue"
              value={formatDate(retour?.date_retour_prevue)}
              fullWidth
              disabled
              sx={commonTextFieldSx}
            />

            <TextField
              label="Date de retour effective"
              value={isRetourne ? formatDate(retour?.retourne_le) : "-"}
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