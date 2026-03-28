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

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR");
};

export const DetailsNotificationDialog = ({ open, onClose, notification }) => {
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
          maxWidth: 800,
        },
      }}
    >
      <DialogTitle>Détails de la notification</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <TextField
            label="Date"
            value={formatDate(notification?.cree_le)}
            fullWidth
            disabled
            sx={commonTextFieldSx}
          />

          <TextField
            label="Message"
            value={notification?.message ?? "-"}
            fullWidth
            disabled
            multiline
            minRows={4}
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