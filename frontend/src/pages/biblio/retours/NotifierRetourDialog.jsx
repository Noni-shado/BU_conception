import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { http } from "../../../api/http";

export const NotifierRetourDialog = ({
  open,
  onClose,
  retour,
  onSuccess,
  onError,
}) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setMessage(
        retour
          ? `Bonjour, le livre "${retour?.livre?.titre}" est en retard. Merci de le retourner dès que possible.`
          : ""
      );
    }
  }, [open, retour]);

  const handleSubmit = async () => {
    if (!message.trim() || !retour?.id) return;

    try {
      setLoading(true);

      await http.post(`/bibliothecaire/retours/${retour.id}/notifier`, {
        message,
      });

      onSuccess?.();
    } catch (error) {
      const apiMessage =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        "Erreur lors de l'envoi de la notification.";

      onError?.(apiMessage);
    } finally {
      setLoading(false);
    }
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
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>Notifier l'utilisateur</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
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

          <TextField
            label="Livre"
            value={retour?.livre?.titre ?? "-"}
            fullWidth
            disabled
            sx={commonTextFieldSx}
          />

          <TextField
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            autoFocus
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
          disabled={loading || !message.trim()}
        >
          Envoyer
        </Button>
      </DialogActions>
    </Dialog>
  );
};