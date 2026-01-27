import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { http } from "../../api/http";

export default function AjouterLivreDialog({ open, onClose, onSuccess }) {
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [nbTotal, setNbTotal] = useState(1);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await http.post("/bibliothecaire/livres", {
        titre,
        auteur,
        isbn: isbn || null,
        description,
        nb_total: Number(nbTotal),
      });
      onSuccess(); // recharge la liste
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Ajouter un livre</DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Titre"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="Auteur"
            value={auteur}
            onChange={(e) => setAuteur(e.target.value)}
            required
            fullWidth
          />

          <TextField
            label="ISBN (optionnel)"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            fullWidth
          />

          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />

          <TextField
            label="Nombre total d'exemplaires"
            type="number"
            value={nbTotal}
            onChange={(e) => setNbTotal(e.target.value)}
            inputProps={{ min: 1 }}
            required
            fullWidth
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={submit}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Ajout..." : "Ajouter"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
