import React, { useEffect, useState } from "react";
import { http } from "../../../api/http";
import { Button, IconButton, Tooltip, Box } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { AjouterLivreDialog } from "./AjouterLivreDialog";
import { ModifierLivreDialog } from "./ModifierLivreDialog";
import { DetailsLivreDialog } from "./DetailsLivreDialog";
import { TableUI } from "../../../components/TableUI/TableUI";
import { Header } from "../../../components/TableUI/Header";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { AppSnackbar } from "../../../components/AppSnackBar";
import { SearchBar } from "../../../components/SearchBar/SearchBar";

export default function Livres() {
  const [q, setQ] = useState("");
  const [livres, setLivres] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [livreSelectionne, setLivreSelectionne] = useState(null);
  const [openDetails, setOpenDetails] = useState(false);
  const [livreDetails, setLivreDetails] = useState(null);

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [selectedLivre, setSelectedLivre] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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
        params: {
          ...(q ? { q } : {}),
          page: page + 1,
          page_size: rowsPerPage,
        },
      });

      setLivres(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des livres.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      charger();
    }, 500);

    return () => clearTimeout(delay);
  }, [q, page, rowsPerPage]);

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
    if (!selectedLivre) return;

    try {
      setDeleteLoading(true);

      await http.delete(`/bibliothecaire/livres/${selectedLivre.id}`);

      if (livres.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        await charger();
      }

      setSnackbar({
        open: true,
        message: `Le livre "${selectedLivre.titre}" a été supprimé avec succès.`,
        severity: "success",
      });

      setDeleteConfirm(false);
      setSelectedLivre(null);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression du livre.",
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

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(0);
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
      <SearchBar
        value={q}
        onChange={(value) => {
          setQ(value);
          setPage(0);
        }}
        onSubmit={handleSearchSubmit}
        loading={loading}
        autoFocus
        searchFields={["titre", "auteur", "ISBN"]}
      />

      <TableUI
        Header={tableHeader}
        cells={cells}
        dataCells={dataCells}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        total={total}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
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

      <AjouterLivreDialog
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onSuccess={async () => {
          setOpenAdd(false);
          setPage(0);
          await charger();
          setSnackbar({
            open: true,
            message: "Le livre a été ajouté avec succès.",
            severity: "success",
          });
        }}
        onError={(message) => {
          setSnackbar({
            open: true,
            message: message || "Erreur lors de l'ajout du livre.",
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
          setOpenEdit(false);
          setLivreSelectionne(null);
          await charger();
          setSnackbar({
            open: true,
            message: "Le livre a été modifié avec succès.",
            severity: "success",
          });
        }}
        onError={(message) => {
          setSnackbar({
            open: true,
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
        message={`Voulez-vous vraiment supprimer "${
          selectedLivre?.titre ?? ""
        }" ?`}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancel}
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        loading={deleteLoading}
        confirmColor="error"
        type="warning"
      />

      <AppSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
}