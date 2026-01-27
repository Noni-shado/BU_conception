import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import {
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import AjouterLivreDialog from "./AjouterLivreDialog";
import ModifierLivreDialog from "./ModifierLivreDialog";
import DetailsLivreDialog from "./DetailsLivreDialog";

export default function Livres() {
  const [q, setQ] = useState("");
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);
  const [livreSelectionne, setLivreSelectionne] = useState(null);

  const [openDetails, setOpenDetails] = useState(false);
  const [livreDetails, setLivreDetails] = useState(null);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await http.get("/bibliothecaire/livres", {
        params: q ? { q } : {},
      });
      setLivres(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const ouvrirEdition = (livre) => {
    setLivreSelectionne(livre);
    setOpenEdit(true);
  };

  const ouvrirDetails = (livre) => {
    setLivreDetails(livre);
    setOpenDetails(true);
  };

  const supprimer = async (livre) => {
    if (!livre?.id) return;

    const ok = window.confirm(
      `Supprimer le livre : "${livre.titre}" ?\nCette action est irréversible.`
    );
    if (!ok) return;

    try {
      await http.delete(`/bibliothecaire/livres/${livre.id}`);
      await charger();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.detail || "Suppression impossible.");
    }
  };

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid #E6EAF2", borderRadius: 3 }}>
      {/* Header */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={900} sx={{ flex: 1 }}>
          Livres
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
          sx={{ fontWeight: 800 }}
        >
          Ajouter un livre
        </Button>
      </Stack>

      {/* Search */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" mb={2}>
        <TextField
          size="small"
          label="Rechercher (titre / auteur / isbn)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          fullWidth
        />
        <Button variant="outlined" onClick={charger} disabled={loading}>
          {loading ? "Chargement..." : "Rechercher"}
        </Button>
      </Stack>

      {/* Table */}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Titre</TableCell>
            <TableCell>Auteur</TableCell>
            <TableCell>ISBN</TableCell>
            <TableCell>Disponibilité</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {livres.map((l) => (
            <TableRow key={l.id}>
              <TableCell>{l.id}</TableCell>
              <TableCell>{l.titre}</TableCell>
              <TableCell>{l.auteur}</TableCell>
              <TableCell>{l.isbn || "-"}</TableCell>
              <TableCell>
                <Chip label={`${l.nb_disponible}/${l.nb_total}`} variant="outlined" />
              </TableCell>

              <TableCell align="right">
                <Tooltip title="Détails">
                  <IconButton onClick={() => ouvrirDetails(l)}>
                     <VisibilityIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Modifier">
                  <IconButton onClick={() => ouvrirEdition(l)}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Supprimer">
                  <IconButton onClick={() => supprimer(l)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}

          {livres.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>
                <Typography color="text.secondary">Aucun livre trouvé.</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Dialogs */}
      <AjouterLivreDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={charger}
      />

      <ModifierLivreDialog
        open={openEdit}
        livre={livreSelectionne}
        onClose={() => setOpenEdit(false)}
        onSuccess={charger}
      />

      <DetailsLivreDialog
        open={openDetails}
        livre={livreDetails}
        onClose={() => setOpenDetails(false)}
      />
    </Paper>
  );
}
