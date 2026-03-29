import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import { Box, IconButton, Tooltip, Button } from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BlockIcon from "@mui/icons-material/Block";
import AddIcon from "@mui/icons-material/Add";

import { TableUI } from "../../components/TableUI/TableUI";
import { Header } from "../../components/TableUI/Header";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { AppSnackbar } from "../../components/AppSnackBar";
import { ConfirmDialog } from "../../components/ConfirmDialog";

import { DetailsCompteDialog } from "./DetailsCompteDialog";
import { AjouterCompteDialog } from "./AjouterCompteDialog";
import { ModifierCompteDialog } from "./ModifierCompteDialog";

export default function Comptes() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [selectedCompte, setSelectedCompte] = useState(null);

  const [openDetails, setOpenDetails] = useState(false);
  const [openAjouter, setOpenAjouter] = useState(false);
  const [openModifier, setOpenModifier] = useState(false);

  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openBlockConfirm, setOpenBlockConfirm] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // À adapter selon ce que tu stockes réellement après connexion
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const currentUserId = currentUser?.id;
  const currentUserEmail = currentUser?.email;

  const cells = [
    {
      key: "nom_complet",
      name: "Nom complet",
      render: (row) => row.nom_complet || "-",
    },
    {
      key: "email",
      name: "Email",
    },
    {
      key: "role",
      name: "Rôle",
      render: (row) => row.role || "-",
    },
    {
      key: "statut",
      name: "Statut",
      render: (row) => (row.actif ? "ACTIF" : "BLOQUE"),
    },
    {
      key: "actions",
      name: "Action",
    },
  ];

  const charger = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        ...(q ? { q } : {}),
      };

      const res = await http.get("/admin/comptes", { params });

      setRows(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des comptes.",
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

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const voirDetails = (row) => {
    setSelectedCompte(row);
    setOpenDetails(true);
  };

  const modifierCompte = (row) => {
    setSelectedCompte(row);
    setOpenModifier(true);
  };

  const supprimerCompte = (row) => {
    setSelectedCompte(row);
    setOpenDeleteConfirm(true);
  };

  const bloquerCompte = (row) => {
    setSelectedCompte(row);
    setOpenBlockConfirm(true);
  };

  const confirmerSuppression = async () => {
    if (!selectedCompte) return;

    try {
      await http.delete(`/admin/comptes/${selectedCompte.id}`);

      setSnackbar({
        open: true,
        message: "Compte supprimé avec succès.",
        severity: "success",
      });

      setOpenDeleteConfirm(false);
      setSelectedCompte(null);
      await charger();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors de la suppression du compte.",
        severity: "error",
      });
    }
  };

  const confirmerBlocage = async () => {
    if (!selectedCompte) return;

    try {
      await http.post(`/admin/comptes/${selectedCompte.id}/bloquer`);

      setSnackbar({
        open: true,
        message: "Compte bloqué avec succès.",
        severity: "success",
      });

      setOpenBlockConfirm(false);
      setSelectedCompte(null);
      await charger();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du blocage du compte.",
        severity: "error",
      });
    }
  };

  const getColor = (statut) => {
    if (statut === "ACTIF") return "success";
    if (statut === "BLOQUE") return "error";
    return "default";
  };

  const getLabel = (statut) => {
    if (statut === "ACTIF") return "Actif";
    if (statut === "BLOQUE") return "Bloqué";
    return statut || "-";
  };

  const tableHeader = (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        mb: 2,
      }}
    >
      <Header title="Comptes" />

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenAjouter(true)}
      >
        Ajouter un compte
      </Button>
    </Box>
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
        searchFields={["email"]}
      />

      <TableUI
        Header={tableHeader}
        cells={cells}
        dataCells={rows}
        loading={loading}
        chipData={{ getColor, getLabel }}
        page={page}
        rowsPerPage={rowsPerPage}
        total={total}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        renderActions={(row) => {
          const isBlocked = !row.actif;
          const isCurrentUser =
            row.id === currentUserId || row.email === currentUserEmail;

          const editDisabled = isBlocked;
          const deleteDisabled = isCurrentUser;
          const blockDisabled = isBlocked || isCurrentUser;

          return (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
              
              <Tooltip title="Voir détails">
                <IconButton color="primary" onClick={() => voirDetails(row)}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>

              <Tooltip
                title={
                  editDisabled
                    ? "Impossible de modifier un compte bloqué"
                    : "Modifier"
                }
              >
                <span>
                  <IconButton
                    color="info"
                    disabled={editDisabled}
                    onClick={() => modifierCompte(row)}
                  >
                    <EditIcon />
                  </IconButton>
                </span>
              </Tooltip>
              
              <Tooltip
                title={
                  isCurrentUser
                    ? "Vous ne pouvez pas bloquer votre propre compte"
                    : isBlocked
                    ? "Compte déjà bloqué"
                    : "Bloquer le compte"
                }
              >
                <span>
                  <IconButton
                    color="warning"
                    disabled={blockDisabled}
                    onClick={() => bloquerCompte(row)}
                  >
                    <BlockIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <Tooltip
                title={
                  deleteDisabled
                    ? "Vous ne pouvez pas supprimer votre propre compte"
                    : "Supprimer"
                }
              >
                <span>
                  <IconButton
                    color="error"
                    disabled={deleteDisabled}
                    onClick={() => supprimerCompte(row)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </span>
              </Tooltip>

            </Box>
          );
        }}
      />

      <DetailsCompteDialog
        open={openDetails}
        onClose={() => {
          setOpenDetails(false);
          setSelectedCompte(null);
        }}
        compte={selectedCompte}
      />

      <AjouterCompteDialog
        open={openAjouter}
        onClose={() => setOpenAjouter(false)}
        onSuccess={async () => {
          setOpenAjouter(false);
          await charger();
          setSnackbar({
            open: true,
            message: "Compte ajouté avec succès.",
            severity: "success",
          });
        }}
        onError={(message) => {
          setSnackbar({
            open: true,
            message: message || "Erreur lors de l'ajout du compte.",
            severity: "error",
          });
        }}
      />

      <ModifierCompteDialog
        open={openModifier}
        onClose={() => {
          setOpenModifier(false);
          setSelectedCompte(null);
        }}
        compte={selectedCompte}
        onSuccess={async () => {
          setOpenModifier(false);
          setSelectedCompte(null);
          await charger();
          setSnackbar({
            open: true,
            message: "Compte modifié avec succès.",
            severity: "success",
          });
        }}
        onError={(message) => {
          setSnackbar({
            open: true,
            message: message || "Erreur lors de la modification du compte.",
            severity: "error",
          });
        }}
      />

      <ConfirmDialog
        open={openDeleteConfirm}
        onCancel={() => {
          setOpenDeleteConfirm(false);
          setSelectedCompte(null);
        }}
        onConfirm={confirmerSuppression}
        title="Supprimer le compte"
        message={`Voulez-vous vraiment supprimer le compte ${
          selectedCompte?.email || ""
        } ?`}
        confirmText="Supprimer"
        cancelText="Annuler"
        type="error"
      />

      <ConfirmDialog
        open={openBlockConfirm}
        onCancel={() => {
          setOpenBlockConfirm(false);
          setSelectedCompte(null);
        }}
        onConfirm={confirmerBlocage}
        title="Bloquer le compte"
        message={`Voulez-vous vraiment bloquer le compte ${
          selectedCompte?.email || ""
        } ?`}
        confirmText="Bloquer"
        cancelText="Annuler"
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