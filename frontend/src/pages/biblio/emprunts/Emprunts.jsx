import React, { useEffect, useState } from "react";
import { http } from "../../../api/http";
import { Box, IconButton, Tooltip, Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { TableUI } from "../../../components/TableUI/TableUI";
import { Header } from "../../../components/TableUI/Header";
import { EMPRUNT_STATUS, EMPRUNT_STATUS_CONFIG } from "../utils";

export default function Emprunts() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

    const cells = [
       {key: "livre", name:"Livre"},
       {key: "utilisateur", name: "Utilisateur"},
       {key:"statut", name: "Statut"},
       {key:"date", name: "Date"},
       {key:"actions", name: "Actions"}
    ]

const dataCells = [
  {
    id: 1,
    livre: "Livre A",
    utilisateur: "User A",
    statut: "EN_ATTENTE",
    date:"2026-03-20",
    actions: null
  },
  {
    id: 2,
    livre: "Livre B",
    utilisateur: "User B",
    statut: "VALIDE",
    date:"2026-03-24",
    actions: null
  }
];

  useEffect(() => { charger(); }, []);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await http.get("/bibliothecaire/emprunts");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  const valider = async ({id}) => {
    await http.post(`/bibliothecaire/emprunts/${id}/valider`, { date_retour_prevue: null });
    await charger();
  };

  const decliner = (row) => {
  console.log("decliner", row);
};

const voirDetails = (row) => {
  console.log("details", row);
};




const getColor = (data)=>{

  return EMPRUNT_STATUS_CONFIG[data].color??"default"
}

const getLabel = (data)=>{

  return EMPRUNT_STATUS_CONFIG[data].label ?? "-"
}

const tableHeader = <Header 
      title="Emprunts"
      Action={
        <Button onClick={charger} disabled={loading} variant="outlined">
          Rafraîchir
        </Button>
      }
      />

return(

<TableUI
   Header={tableHeader}
   cells={cells}
   dataCells={dataCells}
   chipData={{getColor, getLabel}}
   renderActions={(row)=>(
    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
        <Tooltip title="Voir détails">
        <IconButton
          color="primary"
          onClick={() => voirDetails(row)}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title="Valider">
        <span>
          <IconButton
            color="success"
            disabled={row?.statut !== EMPRUNT_STATUS.EN_ATTENTE }
            onClick={() => valider(row)}
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
            onClick={() => decliner(row)}
          >
            <CancelIcon />
          </IconButton>
        </span>
      </Tooltip>

    </Box>
  )}
 />
  );
}
