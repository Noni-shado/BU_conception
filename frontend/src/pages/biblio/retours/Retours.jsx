import React, { useEffect, useState } from "react";
import { http } from "../../../api/http";
import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import NotificationsIcon from "@mui/icons-material/Notifications";

import { TableUI } from "../../../components/TableUI/TableUI";
import { Header } from "../../../components/TableUI/Header";
import { TableFilter } from "../../../components/TableUI/TableFilter";
import { SearchBar } from "../../../components/SearchBar/SearchBar";
import { AppSnackbar } from "../../../components/AppSnackBar";

import { RETOUR_STATUS, RETOUR_STATUS_CONFIG } from "../utils";
import { DetailsRetourDialog } from "./DetailsRetourDialog";
import { NotifierRetourDialog } from "./NotifierRetourDialog";

export default function Retours() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [filtersState, setFiltersState] = useState({
    statut: "",
  });

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedRetour, setSelectedRetour] = useState(null);

  const [openNotifier, setOpenNotifier] = useState(false);
  const [selectedRetourNotifier, setSelectedRetourNotifier] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const cells = [
    {
      key: "livre",
      name: "Livre",
      render: (row) => row.livre?.titre ?? "-",
    },
    {
      key: "utilisateur",
      name: "Utilisateur",
      render: (row) =>
        row.utilisateur?.nom_complet || row.utilisateur?.email || "-",
    },
    {
      key: "statut",
      name: "Statut",
    },
    {
      key: "date_retour_prevue",
      name: "Date retour prévue",
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

  const statutOptions = [
    { value: "", label: "Tous" },
    { value: RETOUR_STATUS.EN_ATTENTE, label: "En attente" },
    { value: RETOUR_STATUS.EN_RETARD, label: "En retard" },
    { value: RETOUR_STATUS.RETOURNE, label: "Retourné" },
  ];

  const charger = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        page_size: rowsPerPage,
        ...(q ? { q } : {}),
        ...(filtersState.statut ? { statut: filtersState.statut } : {}),
      };

      const res = await http.get("/bibliothecaire/retours", { params });

      setRows(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des retours.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      charger();
    }, 500);

    return () => clearTimeout(delay);
  }, [q, page, rowsPerPage, filtersState.statut]);

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

  const handleFilterChange = (value) => {
    setFiltersState((prev) => ({
      ...prev,
      statut: value,
    }));
    setPage(0);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const getColor = (data) => {
    return RETOUR_STATUS_CONFIG[data]?.color ?? "default";
  };

  const getLabel = (data) => {
    return RETOUR_STATUS_CONFIG[data]?.label ?? "-";
  };

  const voirDetails = (row) => {
    setSelectedRetour(row);
    setOpenDetails(true);
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedRetour(null);
  };

  const notifier = (row) => {
    setSelectedRetourNotifier(row);
    setOpenNotifier(true);
  };

  const handleCloseNotifier = () => {
    setOpenNotifier(false);
    setSelectedRetourNotifier(null);
  };

  const tableHeader = (
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
      <Header title="Retours" />

      <TableFilter
        label="Statut"
        value={filtersState.statut}
        options={statutOptions}
        onChange={handleFilterChange}
        disabled={loading}
      />
    </Box>
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

            <Tooltip
              title={
                row.statut === RETOUR_STATUS.EN_RETARD
                  ? "Notifier l'utilisateur"
                  : "Disponible uniquement pour les retards"
              }
            >
              <span>
                <IconButton
                  color="warning"
                  disabled={row.statut !== RETOUR_STATUS.EN_RETARD}
                  onClick={() => notifier(row)}
                >
                  <NotificationsIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        )}
      />

      <DetailsRetourDialog
        open={openDetails}
        onClose={handleCloseDetails}
        retour={selectedRetour}
      />

      <NotifierRetourDialog
        open={openNotifier}
        onClose={handleCloseNotifier}
        retour={selectedRetourNotifier}
        onSuccess={async () => {
          handleCloseNotifier();
          await charger();
          setSnackbar({
            open: true,
            message: "La notification a été envoyée avec succès.",
            severity: "success",
          });
        }}
        onError={(message) => {
          setSnackbar({
            open: true,
            message: message || "Erreur lors de l'envoi de la notification.",
            severity: "error",
          });
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