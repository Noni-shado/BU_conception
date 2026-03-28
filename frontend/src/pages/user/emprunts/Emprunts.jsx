import React, { useState } from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { Header } from "../../../components/TableUI/Header";
import { TableFilter } from "../../../components/TableUI/TableFilter";
import { EmpruntsListBase } from "../../../components/emprunts/EmpruntListBase";

import { EMPRUNT_STATUS } from "../../biblio/utils";

export default function EmpruntsUser() {
  const [filtersState, setFiltersState] = useState({
    statut: "",
  });

  const statutOptions = [
    { value: "", label: "Tous" },
    { value: EMPRUNT_STATUS.EN_ATTENTE, label: "En attente" },
    { value: EMPRUNT_STATUS.VALIDE, label: "Validé" },
    { value: EMPRUNT_STATUS.REFUSE, label: "Refusé" },
  ];

  return (
    <EmpruntsListBase
      endpoint="/utilisateur/emprunts"
      title="Mes emprunts"
      searchFields={["titre", "auteur"]}

      // 🔥 filtre envoyé au backend
      extraParams={{
        ...(filtersState.statut ? { statut: filtersState.statut } : {}),
      }}

      // 🔥 header avec filtre
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
        </Box>
      )}
    />
  );
}