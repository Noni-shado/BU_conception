import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

export default function DetailsLivreDialog({ open, onClose, livre }) {
  if (!livre) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Détails du livre</DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} mt={1}>
          <Stack direction="row" justifyContent="space-between">
            <Typography fontWeight={800}>ID</Typography>
            <Typography>{livre.id}</Typography>
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography fontWeight={800}>Titre</Typography>
            <Typography textAlign="right">{livre.titre}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography fontWeight={800}>Auteur</Typography>
            <Typography textAlign="right">{livre.auteur}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography fontWeight={800}>ISBN</Typography>
            <Typography textAlign="right">{livre.isbn || "-"}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography fontWeight={800}>Total</Typography>
            <Typography textAlign="right">{livre.nb_total}</Typography>
          </Stack>

          <Stack direction="row" justifyContent="space-between" gap={2}>
            <Typography fontWeight={800}>Disponibles</Typography>
            <Typography textAlign="right">{livre.nb_disponible}</Typography>
          </Stack>

          <Divider />

          <Typography fontWeight={800}>Description</Typography>
          <Typography color="text.secondary" sx={{ whiteSpace: "pre-wrap" }}>
            {livre.description?.trim() ? livre.description : "—"}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
