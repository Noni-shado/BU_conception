import React, { useEffect, useState } from "react";
import { http } from "../../../api/http";
import { Box, IconButton, Tooltip, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { TableUI } from "../../../components/TableUI/TableUI";
import { Header } from "../../../components/TableUI/Header";
import { EMPRUNT_STATUS_CONFIG } from "../utils";

export default function Retours() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filterValues, setFilterValues] = useState({
    statut: "",
    ordre_livre: "",
  });

  const cells = [
    { key: "livre", name: "Livre" },
    { key: "utilisateur", name: "Utilisateur" },
    { key: "retournee", name: "Retourné" },
    { key: "statut", name: "Statut" },
    { key: "date_retour", name: "Date de retour" },
    { key: "actions", name: "Action" },
  ];

  const filters = [
    {
      key: "statut",
      label: "Filtrer par statut",
      options: [
        { value: "", label: "Tous" },
        { value: "EN_ATTENTE", label: "En attente" },
        { value: "RETOURNE", label: "Retourné" },
      ],
    }
  ];

  const charger = async (customFilters = filterValues) => {
    setLoading(true);
    try {
      const params = {};

      if (customFilters.statut) {
        params.statut = customFilters.statut;
      }

      if (customFilters.ordre_livre) {
        params.ordre_livre = customFilters.ordre_livre;
      }

      const res = await http.get("/bibliothecaire/retours", { params });
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = {
      ...filterValues,
      [key]: value,
    };

    setFilterValues(newFilters);
    charger(newFilters);
  };

  const getColor = (data) => {
    return EMPRUNT_STATUS_CONFIG[data]?.color ?? "default";
  };

  const getLabel = (data) => {
    return EMPRUNT_STATUS_CONFIG[data]?.label ?? "-";
  };

  const voirDetails = (row) => {
    console.log("details", row);
  };

  const tableHeader = (
    <Header
      title="Retours"
      Action={
        <Button variant="contained" startIcon={<AddIcon />}>
          Ajouter
        </Button>
      }
    />
  );

  return (
    <TableUI
      Header={tableHeader}
      cells={cells}
      dataCells={rows}
      chipData={{ getColor, getLabel }}
      filters={filters}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
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
  );
}