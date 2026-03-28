import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import { http } from "../../../api/http";
import { LivresListBase } from "../../../components/livres/LivresListBase";
import { Header } from "../../../components/TableUI/Header";
import { AppSnackbar } from "../../../components/AppSnackBar";

import { DetailsLivreDialog } from "../../biblio/livres/DetailsLivreDialog";
import { DemanderEmpruntDialog } from "./DemanderEmpruntDialog";
import { EMPRUNT_STATUS } from "../../biblio/utils";

export default function LivresUser() {
  const [openDetails, setOpenDetails] = useState(false);
  const [livreDetails, setLivreDetails] = useState(null);

  const [openDemande, setOpenDemande] = useState(false);
  const [livreSelectionne, setLivreSelectionne] = useState(null);
  const [loadingDemande, setLoadingDemande] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0);

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

  const ouvrirDetails = (livre) => {
    setLivreDetails(livre);
    setOpenDetails(true);
  };

  const ouvrirDemande = (livre) => {
    setLivreSelectionne(livre);
    setOpenDemande(true);
  };

  const fermerDetails = () => {
    setOpenDetails(false);
    setLivreDetails(null);
  };

  const fermerDemande = () => {
    if (loadingDemande) return;
    setOpenDemande(false);
    setLivreSelectionne(null);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getTooltipTitle = (livre) => {
    if (livre.statut_emprunt_utilisateur === EMPRUNT_STATUS.EN_ATTENTE) {
      return "Demande en attente";
    }
    if (livre.statut_emprunt_utilisateur === EMPRUNT_STATUS.VALIDE) {
      return "Livre déjà emprunté";
    }
    if (livre.nb_disponible === 0) {
      return "Aucun exemplaire disponible";
    }
    return "Demander emprunt";
  };

  const handleDemanderEmprunt = async ({ livre_id }) => {
    if (!livre_id) return;

    setLoadingDemande(true);

    try {
      await http.post(`/utilisateur/emprunts/${livre_id}`);

      fermerDemande();
      setRefreshKey((prev) => prev + 1);

      setSnackbar({
        open: true,
        message: "La demande d’emprunt a été envoyée avec succès.",
        severity: "success",
      });
    } catch (error) {
      const message =
        error?.response?.data?.detail ||
        "Erreur lors de la demande d’emprunt.";

      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    } finally {
      setLoadingDemande(false);
    }
  };

  return (
    <>
      <LivresListBase
        key={refreshKey}
        endpoint="/utilisateur/livres"
        cells={cells}
        renderHeader={({ title }) => <Header title={title} />}
        renderActions={(livre) => (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
            <Tooltip title="Détails">
              <IconButton color="primary" onClick={() => ouvrirDetails(livre)}>
                <VisibilityIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={getTooltipTitle(livre)}>
              <span>
                <IconButton
                  color="primary"
                  onClick={() => ouvrirDemande(livre)}
                  disabled={
                    livre.nb_disponible === 0 ||
                    livre.statut_emprunt_utilisateur ===
                      EMPRUNT_STATUS.EN_ATTENTE ||
                    livre.statut_emprunt_utilisateur ===
                      EMPRUNT_STATUS.VALIDE
                  }
                >
                  <MenuBookIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
      />

      <DetailsLivreDialog
        open={openDetails}
        livre={livreDetails}
        onClose={fermerDetails}
      />

      <DemanderEmpruntDialog
        open={openDemande}
        livre={livreSelectionne}
        loading={loadingDemande}
        onClose={fermerDemande}
        onSubmit={handleDemanderEmprunt}
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