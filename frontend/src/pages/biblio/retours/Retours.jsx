import React, { useEffect, useState } from "react";
import { http } from "../../../api/http";
import { Box, IconButton, Tooltip, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import { TableUI } from "../../../components/TableUI/TableUI";
import { Header } from "../../../components/TableUI/Header";
import { SearchBar } from "../../../components/SearchBar/SearchBar";
import { RETOUR_STATUS_CONFIG } from "../utils";

export default function Retours() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const cells = [
    {
      key: "livre",
      name: "Livre",
      render: (row) => row.livre?.titre ?? "-",
    },
    {
      key: "utilisateur",
      name: "Utilisateur",
      render: (row) => row.utilisateur?.nom_complet || row.utilisateur?.email || "-",
    },
    {
      key: "statut",
      name: "Statut",
    },
    {
      key: "date_retour_prevue",
      name: "Date retour prevue",
      render: (row) =>
        row.date_retour_prevue
          ? new Date(row.date_retour_prevue).toLocaleDateString("fr-FR")
          : "-",
    },
    {
      key: "actions",
      name: "Action",
    },
  ];

  const charger = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        ...(q ? { q } : {}),
      };

      const res = await http.get("/bibliothecaire/retours", { params });

      setRows(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch (error) {
      console.error("Erreur chargement retours :", error);
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

  const getColor = (data) => {
    return RETOUR_STATUS_CONFIG[data]?.color ?? "default";
  };

  const getLabel = (data) => {
    return RETOUR_STATUS_CONFIG[data]?.label ?? "-";
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
          </Box>
        )}
      />
    </>
  );
}