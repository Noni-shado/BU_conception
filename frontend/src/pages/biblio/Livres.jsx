import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import {
  Button,
  Stack,
  TextField,
  IconButton,
  Tooltip,
  Box,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import {AjouterLivreDialog} from "./Dialog/AjouterLivreDialog";
import {ModifierLivreDialog} from "./Dialog/ModifierLivreDialog";
import {DetailsLivreDialog} from "./Dialog/DetailsLivreDialog";
import { TableUI } from "../../components/TableUI/TableUI";
import { Header } from "../../components/TableUI/Header";

export default function Livres() {
  const [q, setQ] = useState("");
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [livreSelectionne, setLivreSelectionne] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [livreDetails, setLivreDetails] = useState(null);

  const cells = [
    { key: "titre", name: "Titre" },
    { key: "auteur", name: "Auteur" },
    { key: "isbn", name: "ISBN" },
    { key: "disponibilite", name: "Disponibilité" },
    { key: "actions", name: "Actions" },
  ];

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
  const delay = setTimeout(() => {
    charger();
  }, 500);

  return () => clearTimeout(delay);
}, [q]);

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
      `Supprimer le livre : "${livre.titre}" ?`
    );
    if (!ok) return;

    await http.delete(`/bibliothecaire/livres/${livre.id}`);
    await charger();
  };

  const dataCells = livres.map((l) => ({
    ...l,
    isbn: l.isbn || "-",
    disponibilite: `${l.nb_disponible}/${l.nb_total}`,
  }));

  const tableHeader = (
    <Header
      title="Livres"
      Action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAdd(true)}
        >
          Ajouter
        </Button>
      }
    />
  );

  return (
    <>
      {/* Search */}
<Stack
  component="form"
  onSubmit={(e) => {
    e.preventDefault(); // 🚫 empêche reload
    charger();
  }}
  direction={{ xs: "column", sm: "row" }}
  spacing={2}
  mb={2}
>
  <TextField
    size="small"
    label="Rechercher"
    value={q}
    onChange={(e) => setQ(e.target.value)}
    fullWidth
    autoFocus   
  />

  <Button
    type="submit"   
    variant="outlined"
    disabled={loading}
  >
    Rechercher
  </Button>
</Stack>

      <TableUI
        Header={tableHeader}
        cells={cells}
        dataCells={dataCells}
        renderActions={(livre) => (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Tooltip title="Détails">
              <IconButton color="primary" onClick={() => ouvrirDetails(livre)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Modifier">
              <IconButton color="primary" onClick={() => ouvrirEdition(livre)}>
                <EditIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Supprimer">
              <IconButton color="error" onClick={() => supprimer(livre)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />

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
    </>
  );
}