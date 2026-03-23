import React, { useEffect, useState } from "react";
import { http } from "../../../api/http";
import { TableUI } from "../../../components/TableUI/TableUI";
import { Header } from "../../../components/TableUI/Header";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import {AjouterRetourDialog}  from "./AjouterRetourDialog";
import {AppSnackbar} from "../../../components/AppSnackBar";
import { RETOUR_STATUS, RETOUR_STATUS_CONFIG } from "../utils";
import {RetourDialogBase} from './RetourDialogBase';

export default function Retours() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRetour, setSelectedRetour] = useState(null);

  const cells = [
    { key: "livre", name: "Livre" },
    { key: "utilisateur", name: "Utilisateur" },
    { key: "retournee", name: "Retourné" },
    { key: "statut", name: "Statut" },
    {key :"date", name: "date_retour"},
    { key: "actions", name: "Action" }
  ];

 const dataCells = [
  {
    id: 1,
    livre_id: 10,
    utilisateur_id: 5,
    livre: "Le Petit Prince",          // ✅ important
    utilisateur: "Alice Dupont",       // ✅ important
    retournee: "non",
    statut: "EN_ATTENTE",
    date: null,
    isbn: "123456789",
    description: "Retour en attente",
  },
  {
    id: 2,
    livre_id: 12,
    utilisateur_id: 7,
    livre: "1984",
    utilisateur: "Mohamed Ali",
    retournee: "oui",
    statut: "RETOURNE",
    date: "2026-03-23",
    isbn: "987654321",
    description: "Livre retourné en bon état",
  },
];

const [snackbar, setSnackbar] = useState({
  open: false,
  message: "",
  severity: "success",
});

  useEffect(() => {
    charger();
  }, []);


  const charger = async () => {
    setLoading(true);
    try {
      const res = await http.get("/bibliothecaire/retours");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };


  const getColor = (data)=>{
      console.log({data, d: RETOUR_STATUS[data] })

    return RETOUR_STATUS_CONFIG[data].color ?? "default"
  }
  
  const getLabel = (data)=>{
    console.log({data, d: RETOUR_STATUS[data] })
  
    return RETOUR_STATUS_CONFIG[data].label ?? "-"
  }

  const voirDetails = (row) => {
    console.log({row})
  setSelectedRetour(row);
  setOpenDetails(true);
};



    const tableHeader = (
    <Header
      title="Retours"
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
        </Box>
      )}
    />
    <AjouterRetourDialog
  open={openAdd}
  onClose={() => setOpenAdd(false)}
  onSuccess={async () => {
    setOpenAdd(false);
    await charger();
    setSnackbar({
      open: true,
      message: "Le retour a été ajouté avec succès.",
      severity: "success",
    });
  }}
  onError={(message) => {
    setSnackbar({
      open: true,
      message: message || "Erreur lors de l'ajout du retour.",
      severity: "error",
    });
  }}
/>

<RetourDialogBase
  open={openDetails}
  onClose={() => {
    setOpenDetails(false);
    setSelectedRetour(null);
  }}
  title="Détails du retour"
  retour={selectedRetour}
  isDetails
/>

<AppSnackbar
  open={snackbar.open}
  onClose={(_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }}
  message={snackbar.message}
  severity={snackbar.severity}
/>

</>
  );
}