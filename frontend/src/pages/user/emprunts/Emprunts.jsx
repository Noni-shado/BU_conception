import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { Header } from "../../../components/TableUI/Header";
import  {EmpruntsListBase}  from "../../../components/emprunts/EmpruntListBase";

export default function EmpruntsUser() {
  return (
    <EmpruntsListBase
      endpoint="/utilisateur/emprunts"
      title="Mes emprunts"
      searchFields={["titre", "auteur"]}
      renderHeader={({ title }) => <Header title={title} />}
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