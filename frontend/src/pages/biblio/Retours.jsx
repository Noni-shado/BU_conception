import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import { TableUI } from "../../components/TableUI/TableUI";
import { Header } from "../../components/TableUI/Header";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { RETOUR_STATUS, RETOUR_STATUS_CONFIG } from "./utils";

export default function Retours() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const cells = [
    { key: "livre_id", name: "Livre" },
    { key: "utilisateur_id", name: "Utilisateur" },
    { key: "retournee", name: "Retourné" },
    { key: "statut", name: "Statut" },
    { key: "actions", name: "Action" },
  ];

  const dataCells = [
  {
    id: 1,
    livre_id: 10,
    utilisateur_id: 5,
    retournee: "non",
    statut: "EN_ATTENTE"
  },
  {
    id: 2,
    livre_id: 12,
    utilisateur_id: 7,
    retournee: "oui",
    statut: "RETOURNE"
  }
]

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

  const valider = async (id) => {
    await http.post(`/bibliothecaire/retours/${id}/valider`);
    await charger();
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
    console.log("details retour", row);
  };




  const tableHeader = (
    <Header
      title="Retours"
      Action={
        <Button onClick={charger} disabled={loading} variant="outlined">
          Rafraîchir
        </Button>
      }
    />
  );

  return (
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

          <Tooltip title="Valider retour">
            <span>
              <IconButton
                color="success"
                disabled={!row.retournee || row.statut === RETOUR_STATUS.RETOURNE}
                onClick={() => valider(row.id)}
              >
                <CheckCircleIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      )}
    />
  );
}