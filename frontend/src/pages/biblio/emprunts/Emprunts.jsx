import React, { useEffect, useState } from "react";
import { http } from "../../../api/http";
import { Box, IconButton, Tooltip, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TableUI } from "../../../components/TableUI/TableUI";
import { Header } from "../../../components/TableUI/Header";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import {AppSnackbar} from "../../../components/AppSnackbar";
import { EMPRUNT_STATUS, EMPRUNT_STATUS_CONFIG } from "../utils";
import { DetailsEmpruntDialog } from "./DetailsEmpruntDialog";

export default function Emprunts(){
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedEmprunt, setSelectedEmprunt] = useState(null);
  const [actionType, setActionType] = useState(null); // "valider" | "decliner"
  const [actionLoading, setActionLoading] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
const [selectedEmpruntDetails, setSelectedEmpruntDetails] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const cells = [
    { key: "livre", name: "Livre" },
    { key: "utilisateur", name: "Utilisateur" },
    { key: "statut", name: "Statut" },
    { key: "date", name: "Date" },
    { key: "actions", name: "Actions" },
  ];

  const dataCells = [
  {
    id: 1,
    livre: "Le Petit Prince",
    utilisateur: "Alice Dupont",
    statut: "EN_ATTENTE",
    date: "2026-03-20",
  },
  {
    id: 2,
    livre: "1984",
    utilisateur: "Mohamed Ali",
    statut: "VALIDE",
    date: "2026-03-18",
  },
  {
    id: 4,
    livre: "Clean Code",
    utilisateur: "Youness Benali",
    statut: "EN_ATTENTE",
    date: "2026-03-22",
  },
  {
    id: 5,
    livre: "Atomic Habits",
    utilisateur: "Tom Durand",
    statut: "VALIDE",
    date: "2026-03-10",
  },
];

  useEffect(() => {
    charger();
  }, []);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await http.get("/bibliothecaire/emprunts");
      setRows(res.data);
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

  const ouvrirConfirmationValidation = (row) => {
    setSelectedEmprunt(row);
    setActionType("valider");
    setConfirmOpen(true);
  };

  const ouvrirConfirmationDeclin = (row) => {
    setSelectedEmprunt(row);
    setActionType("decliner");
    setConfirmOpen(true);
  };

  const fermerConfirmation = () => {
    if (actionLoading) return;
    setConfirmOpen(false);
    setSelectedEmprunt(null);
  };

  const handleConfirmAction = async () => {
    if (!selectedEmprunt?.id || !actionType) return;

    try {
      setActionLoading(true);

      if (actionType === "valider") {
        await http.post(
          `/bibliothecaire/emprunts/${selectedEmprunt.id}/valider`,
          { date_retour_prevue: null }
        );

        setSnackbar({
          open: true,
          message: "L'emprunt a été validé avec succès.",
          severity: "success",
        });
      }

      if (actionType === "decliner") {
        await http.post(`/bibliothecaire/emprunts/${selectedEmprunt.id}/decliner`);

        setSnackbar({
          open: true,
          message: "L'emprunt a été décliné avec succès.",
          severity: "success",
        });
      }

      await charger();
      fermerConfirmation();
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.detail ||
          "Une erreur est survenue lors du traitement de l'emprunt.",
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

  const tableHeader = (
    <Header
      title="Emprunts"
    />
  );

  return (
    <>
      <TableUI
        Header={tableHeader}
        cells={cells}
        dataCells={dataCells}
        chipData={{ getColor, getLabel }}
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
        type={actionType === "valider" ? "success" : "error"}
        title={
          actionType === "valider"
            ? "Valider l'emprunt"
            : "Décliner l'emprunt"
        }
        message={
          actionType === "valider"
            ? `Voulez-vous valider l'emprunt de "${
                selectedEmprunt?.livre ?? ""
              }" pour "${selectedEmprunt?.utilisateur ?? ""}" ?`
            : `Voulez-vous décliner l'emprunt de "${
                selectedEmprunt?.livre ?? ""
              }" pour "${selectedEmprunt?.utilisateur ?? ""}" ?`
        }
        onConfirm={handleConfirmAction}
        onCancel={fermerConfirmation}
        confirmLabel={actionType === "valider" ? "Valider" : "Décliner"}
        cancelLabel="Annuler"
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