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
import { http } from "../../api/http";

export default function ModifierLivreDialog({ open, onClose, onSuccess, livre }) {
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [nbTotal, setNbTotal] = useState(1);
  const [nbDisponible, setNbDisponible] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && livre) {
      setTitre(livre.titre ?? "");
      setAuteur(livre.auteur ?? "");
      setIsbn(livre.isbn ?? "");
      setDescription(livre.description ?? "");
      setNbTotal(livre.nb_total ?? 1);
      setNbDisponible(livre.nb_disponible ?? 1);
    }
  }, [open, livre]);

  const submit = async () => {
    if (!livre?.id) return;

    setLoading(true);
    try {
      await http.put(`/bibliothecaire/livres/${livre.id}`, {
        titre: titre.trim(),
        auteur: auteur.trim(),
        isbn: isbn.trim() ? isbn.trim() : null,
        description: description.trim(),
        nb_total: Number(nbTotal) || 1,
        nb_disponible: Number(nbDisponible) || 0,
      });

      onSuccess?.();
      onClose?.();
    } catch (e) {
      console.error(e);
      alert(
        e?.response?.data?.detail ||
          "Erreur lors de la modification (ISBN unique ? valeurs invalides ?)."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Modifier le livre</DialogTitle>

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
            inputProps={{ min: 0 }}
            required
            fullWidth
          />

          <TextField
            label="Nombre disponible"
            type="number"
            value={nbDisponible}
            onChange={(e) => setNbDisponible(e.target.value)}
            inputProps={{ min: 0 }}
            required
            fullWidth
            helperText="Astuce : nb_disponible ne doit pas dépasser nb_total"
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={submit} disabled={loading}>
          {loading ? "Sauvegarde..." : "Enregistrer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
