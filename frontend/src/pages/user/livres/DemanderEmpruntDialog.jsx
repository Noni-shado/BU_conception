import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

export const DemanderEmpruntDialog = ({
  open,
  onClose,
  onSubmit,
  livre = null,
  loading = false,
}) => {
  const commonTextFieldSx = {
    "& .MuiFormLabel-asterisk": {
      color: "error.main",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#111827",
    },
  };

  const handleSubmit = () => {
    if (!livre?.id) return;

    onSubmit?.({
      livre_id: livre.id,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>Demander un emprunt</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Typography>
            Vous allez demander l’emprunt du livre suivant :
          </Typography>

          <TextField
            label="Titre"
            value={livre?.titre ?? ""}
            fullWidth
            disabled
            sx={commonTextFieldSx}
          />

          <TextField
            label="Auteur"
            value={livre?.auteur ?? ""}
            fullWidth
            disabled
            sx={commonTextFieldSx}
          />

          <TextField
            label="ISBN"
            value={livre?.isbn ?? ""}
            fullWidth
            disabled
            sx={commonTextFieldSx}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !livre?.id}
        >
          Confirmer
        </Button>
      </DialogActions>
    </Dialog>
  );
};