import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { ConfirmDialog } from "../../../components/ConfirmDialog";

export function DeclinerEmpruntDialog({
  open,
  onClose,
  onConfirm,
  emprunt,
  loading = false,
}) {
  const [motif, setMotif] = useState("");

  useEffect(() => {
    if (open) {
      setMotif("");
    }
  }, [open]);

  const handleConfirm = () => {
    onConfirm?.(motif.trim());
  };

  return (
    <ConfirmDialog
      open={open}
      onCancel={onClose}
      onConfirm={handleConfirm}
      loading={loading}
      type="error"
      title="Décliner l'emprunt"
      message={`Voulez-vous décliner l'emprunt de "${
        emprunt?.livre?.titre ?? "-"
      }" pour "${
        emprunt?.utilisateur?.nom_complet ||
        emprunt?.utilisateur?.email ||
        "-"
      }" ?`}
      confirmLabel="Décliner"
      cancelLabel="Annuler"
      confirmDisabled={!motif.trim()}
    >
      <TextField
        label="Motif de refus"
        placeholder="Saisir le motif du refus"
        value={motif}
        onChange={(e) => setMotif(e.target.value)}
        fullWidth
        multiline
        minRows={3}
        autoFocus
        required
      />
    </ConfirmDialog>
  );
}