import React, { useEffect, useState } from "react";
import { http } from "../../../api/http";
import { Box, IconButton, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TableUI } from "../../../components/TableUI/TableUI";
import { Header } from "../../../components/TableUI/Header";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { AppSnackbar } from "../../../components/AppSnackbar";
import { EMPRUNT_STATUS, EMPRUNT_STATUS_CONFIG } from "../utils";
import { DetailsEmpruntDialog } from "./DetailsEmpruntDialog";
import { DeclinerEmpruntDialog } from "./DeclinerEmpruntDialog";
import { SearchBar } from "../../../components/SearchBar/SearchBar";

export default function Emprunts() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);

  const [selectedEmprunt, setSelectedEmprunt] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedEmpruntDetails, setSelectedEmpruntDetails] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const cells = [
    {
      key: "livre",
      name: "Livre",
      render: (row) => row.livre?.titre ?? "-",
    },
    {
      key: "utilisateur",
      name: "Utilisateur",
      render: (row) =>
        row.utilisateur?.nom_complet || row.utilisateur?.email || "-",
    },
    { key: "statut", name: "Statut" },
    {
      key: "date_emprunt",
      name: "Date emprunt",
      render: (row) =>
        row.demande_le
          ? new Date(row.demande_le).toLocaleDateString("fr-FR")
          : "-",
    },
    { key: "actions", name: "Actions" },
  ];

  const charger = async () => {
    setLoading(true);
    try {
      const res = await http.get("/bibliothecaire/emprunts", {
        params: {
          ...(q ? { q } : {}),
          page: page + 1,
          page_size: rowsPerPage,
        },
      });

      setRows(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des emprunts.",
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

  const ouvrirConfirmationValidation = (row) => {
    setSelectedEmprunt(row);
    setConfirmOpen(true);
  };

  const ouvrirConfirmationDeclin = (row) => {
    setSelectedEmprunt(row);
    setDeclineOpen(true);
  };

  const fermerConfirmation = () => {
    if (actionLoading) return;
    setConfirmOpen(false);
    setSelectedEmprunt(null);
  };

  const fermerDeclin = () => {
    if (actionLoading) return;
    setDeclineOpen(false);
    setSelectedEmprunt(null);
  };

  const handleValider = async () => {
    if (!selectedEmprunt?.id) return;

    try {
      setActionLoading(true);

      await http.post(`/bibliothecaire/emprunts/${selectedEmprunt.id}/valider`);

      setSnackbar({
        open: true,
        message: "L'emprunt a été validé avec succès.",
        severity: "success",
      });

      await charger();
      fermerConfirmation();
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.detail ||
          "Une erreur est survenue lors de la validation de l'emprunt.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecliner = async (motifRefus) => {
    if (!selectedEmprunt?.id) return;

    try {
      setActionLoading(true);

      await http.post(
        `/bibliothecaire/emprunts/${selectedEmprunt.id}/decliner`,
        { motif_refus: motifRefus }
      );

      setSnackbar({
        open: true,
        message: "L'emprunt a été décliné avec succès.",
        severity: "success",
      });

      await charger();
      fermerDeclin();
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.detail ||
          "Une erreur est survenue lors du refus de l'emprunt.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const voirDetails = (row) => {
    setSelectedEmpruntDetails(row);
    setOpenDetails(true);
  };

  const getColor = (data) => {
    return EMPRUNT_STATUS_CONFIG[data]?.color ?? "default";
  };

  const getLabel = (data) => {
    return EMPRUNT_STATUS_CONFIG[data]?.label ?? "-";
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

  const tableHeader = <Header title="Emprunts" />;

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
        searchFields={["email utilisateur"]}
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
        renderActions={(row) => (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Tooltip title="Voir détails">
              <IconButton color="primary" onClick={() => voirDetails(row)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Valider">
              <span>
                <IconButton
                  color="success"
                  disabled={row?.statut !== EMPRUNT_STATUS.EN_ATTENTE}
                  onClick={() => ouvrirConfirmationValidation(row)}
                >
                  <CheckCircleIcon />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Décliner">
              <span>
                <IconButton
                  color="error"
                  disabled={row?.statut !== EMPRUNT_STATUS.EN_ATTENTE}
                  onClick={() => ouvrirConfirmationDeclin(row)}
                >
                  <CancelIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
      />

      <ConfirmDialog
        open={confirmOpen}
        type="success"
        title="Valider l'emprunt"
        message={`Voulez-vous valider l'emprunt de "${
          selectedEmprunt?.livre?.titre ?? ""
        }" pour "${
          selectedEmprunt?.utilisateur?.nom_complet ||
          selectedEmprunt?.utilisateur?.email ||
          ""
        }" ?`}
        onConfirm={handleValider}
        onCancel={fermerConfirmation}
        confirmLabel="Valider"
        cancelLabel="Annuler"
        loading={actionLoading}
      />

      <DeclinerEmpruntDialog
        open={declineOpen}
        onClose={fermerDeclin}
        onConfirm={handleDecliner}
        emprunt={selectedEmprunt}
        loading={actionLoading}
      />

      <DetailsEmpruntDialog
        open={openDetails}
        emprunt={selectedEmpruntDetails}
        onClose={() => {
          setOpenDetails(false);
          setSelectedEmpruntDetails(null);
        }}
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