import React, { useState } from "react";
import { http } from "../../../api/http";
import { Box, IconButton, Tooltip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { Header } from "../../../components/TableUI/Header";
import { TableFilter } from "../../../components/TableUI/TableFilter";
import { ConfirmDialog } from "../../../components/ConfirmDialog";
import { DeclinerEmpruntDialog } from "./DeclinerEmpruntDialog";
import { EmpruntsListBase } from "../../../components/emprunts/EmpruntListBase";

import { EMPRUNT_STATUS } from "../utils";

export default function Emprunts() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);
  const [selectedEmprunt, setSelectedEmprunt] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [filtersState, setFiltersState] = useState({
    statut: "",
  });

  const statutOptions = [
    { value: "", label: "Tous" },
    { value: EMPRUNT_STATUS.EN_ATTENTE, label: "En attente" },
    { value: EMPRUNT_STATUS.VALIDE, label: "Validé" },
    { value: EMPRUNT_STATUS.REFUSE, label: "Refusé" },
  ];

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

  const handleValider = async (refresh, showSnackbar) => {
    if (!selectedEmprunt?.id) return;

    try {
      setActionLoading(true);

      await http.post(`/bibliothecaire/emprunts/${selectedEmprunt.id}/valider`);

      showSnackbar({
        message: "L'emprunt a été validé avec succès.",
        severity: "success",
      });

      fermerConfirmation();
      await refresh();
    } catch (error) {
      showSnackbar({
        message:
          error?.response?.data?.detail ||
          "Une erreur est survenue lors de la validation de l'emprunt.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecliner = async (motifRefus, refresh, showSnackbar) => {
    if (!selectedEmprunt?.id) return;

    try {
      setActionLoading(true);

      await http.post(
        `/bibliothecaire/emprunts/${selectedEmprunt.id}/decliner`,
        { motif_refus: motifRefus }
      );

      showSnackbar({
        message: "L'emprunt a été décliné avec succès.",
        severity: "success",
      });

      fermerDeclin();
      await refresh();
    } catch (error) {
      showSnackbar({
        message:
          error?.response?.data?.detail ||
          "Une erreur est survenue lors du refus de l'emprunt.",
        severity: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <EmpruntsListBase
      endpoint="/bibliothecaire/emprunts"
      title="Emprunts"
      searchFields={["email utilisateur"]}
      extraParams={{
        ...(filtersState.statut ? { statut: filtersState.statut } : {}),
      }}
      renderHeader={({ title, loading }) => (
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
          <Header title={title} />

          <TableFilter
            label="Statut"
            value={filtersState.statut}
            options={statutOptions}
            onChange={(value) =>
              setFiltersState((prev) => ({
                ...prev,
                statut: value,
              }))
            }
            disabled={loading}
          />
        </Box>
      )}
      renderActions={({ row, voirDetails }) => (
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
      extraDialogs={({ refresh, showSnackbar }) => (
        <>
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
            onConfirm={() => handleValider(refresh, showSnackbar)}
            onCancel={fermerConfirmation}
            confirmLabel="Valider"
            cancelLabel="Annuler"
            loading={actionLoading}
          />

          <DeclinerEmpruntDialog
            open={declineOpen}
            onClose={fermerDeclin}
            onConfirm={(motifRefus) =>
              handleDecliner(motifRefus, refresh, showSnackbar)
            }
            emprunt={selectedEmprunt}
            loading={actionLoading}
          />
        </>
      )}
    />
  );
}