import React, { useState, useRef } from "react";
import { Button, IconButton, Tooltip, Box } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { AjouterLivreDialog } from "./AjouterLivreDialog";
import { ModifierLivreDialog } from "./ModifierLivreDialog";
import { DetailsLivreDialog } from "./DetailsLivreDialog";
import { Header } from "../../../components/TableUI/Header";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { LivresListBase } from "../../../components/livres/LivresListBase";
import { http } from "../../../api/http";

export default function Livres() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [livreSelectionne, setLivreSelectionne] = useState(null);

  const [openDetails, setOpenDetails] = useState(false);
  const [livreDetails, setLivreDetails] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ✅ FIX: useRef au lieu de useState
  const listHelpersRef = useRef(null);

  const cells = [
    { key: "titre", name: "Titre" },
    { key: "auteur", name: "Auteur" },
    { key: "isbn", name: "ISBN" },
    { key: "disponibilite", name: "Disponibilité" },
    { key: "actions", name: "Actions" },
  ];

  const ouvrirEdition = (livre) => {
    setLivreSelectionne(livre);
    setOpenEdit(true);
  };

  const ouvrirDetails = (livre) => {
    setLivreDetails(livre);
    setOpenDetails(true);
  };

  const supprimer = (livre) => {
    setSelectedLivre(livre);
    setDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    const helpers = listHelpersRef.current;
    if (!selectedLivre || !helpers) return;

    try {
      setDeleteLoading(true);

      await http.delete(`/bibliothecaire/livres/${selectedLivre.id}`);

      if (helpers.livres.length === 1 && helpers.page > 0) {
        helpers.setPage((prev) => prev - 1);
      } else {
        await helpers.refresh();
      }

      helpers.showSnackbar({
        message: `Le livre "${selectedLivre.titre}" a été supprimé avec succès.`,
        severity: "success",
      });

      setDeleteConfirm(false);
      setSelectedLivre(null);
    } catch (error) {
      helpers.showSnackbar({
        message:
          error?.response?.data?.detail ||
          "Erreur lors de la suppression du livre.",
        severity: "error",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancel = () => {
    if (deleteLoading) return;
    setDeleteConfirm(false);
    setSelectedLivre(null);
  };

  return (
    <>
      <LivresListBase
        endpoint="/bibliothecaire/livres"
        cells={cells}
        renderHeader={({ title, helpers }) => {
          // ✅ FIX: PAS de setState
          listHelpersRef.current = helpers;

          return (
            <Header
              title={title}
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
        }}
        renderActions={(livre, helpers) => {
          // ✅ FIX: PAS de setState
          listHelpersRef.current = helpers;

          return (
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
          );
        }}
      />

      <AjouterLivreDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={async () => {
          const helpers = listHelpersRef.current;

          setOpenAdd(false);
          await helpers?.refresh();

          helpers?.showSnackbar({
            message: "Le livre a été ajouté avec succès.",
            severity: "success",
          });
        }}
        onError={(message) => {
          listHelpersRef.current?.showSnackbar({
            message: message || "Erreur lors de l’ajout du livre.",
            severity: "error",
          });
        }}
      />

      <ModifierLivreDialog
        open={openEdit}
        livre={livreSelectionne}
        onClose={() => {
          setOpenEdit(false);
          setLivreSelectionne(null);
        }}
        onSuccess={async () => {
          const helpers = listHelpersRef.current;

          setOpenEdit(false);
          setLivreSelectionne(null);
          await helpers?.refresh();

          helpers?.showSnackbar({
            message: "Le livre a été modifié avec succès.",
            severity: "success",
          });
        }}
        onError={(message) => {
          listHelpersRef.current?.showSnackbar({
            message: message || "Erreur lors de la modification du livre.",
            severity: "error",
          });
        }}
      />

      <DetailsLivreDialog
        open={openDetails}
        livre={livreDetails}
        onClose={() => {
          setOpenDetails(false);
          setLivreDetails(null);
        }}
      />

      <ConfirmDialog
        open={deleteConfirm}
        title="Supprimer le livre"
        message={`Voulez-vous vraiment supprimer "${selectedLivre?.titre ?? ""}" ?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={deleteLoading}
        confirmColor="error"
        type="warning"
      />
    </>
  );
}