import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import { TableUI } from "../TableUI/TableUI";
import { SearchBar } from "../SearchBar/SearchBar";
import { AppSnackbar } from "../AppSnackBar";
import { DetailsEmpruntDialog } from "../../pages/biblio/emprunts/DetailsEmpruntDialog";
import { EMPRUNT_STATUS_CONFIG } from "../../pages/biblio/utils";

export const EmpruntsListBase = ({
  endpoint,
  title = "Emprunts",
  searchFields = [],
  renderHeader,
  renderActions,
  extraDialogs,
  extraParams = {},
}) => {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedEmpruntDetails, setSelectedEmpruntDetails] = useState(null);

  const [refreshKey, setRefreshKey] = useState(0);

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
      key: "date_emprunt",
      name: "Date emprunt",
      render: (row) =>
        row.demande_le
          ? new Date(row.demande_le).toLocaleDateString("fr-FR")
          : "-",
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
      name: "Actions",
    },
  ];

  const charger = async () => {
    setLoading(true);

    try {
      const res = await http.get(endpoint, {
        params: {
          ...(q ? { q } : {}),
          ...(extraParams || {}),
          page: page + 1,
          page_size: rowsPerPage,
        },
      });

      setRows(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des emprunts.",
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
  }, [q, page, rowsPerPage, refreshKey, JSON.stringify(extraParams)]);

  const voirDetails = (row) => {
    setSelectedEmpruntDetails(row);
    setOpenDetails(true);
  };

  const closeDetails = () => {
    setOpenDetails(false);
    setSelectedEmpruntDetails(null);
  };

  const refresh = async () => {
    setRefreshKey((prev) => prev + 1);
  };

  const showSnackbar = ({ message, severity = "success" }) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const getColor = (data) => {
    return EMPRUNT_STATUS_CONFIG[data]?.color ?? "default";
  };

  const getLabel = (data) => {
    return EMPRUNT_STATUS_CONFIG[data]?.label ?? "-";
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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

  const headerNode = renderHeader?.({ title, loading }) ?? null;

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
        searchFields={searchFields}
      />

      <TableUI
        Header={headerNode}
        cells={cells}
        dataCells={rows}
        loading={loading}
        chipData={{ getColor, getLabel }}
        page={page}
        rowsPerPage={rowsPerPage}
        total={total}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        renderActions={(row) =>
          renderActions?.({
            row,
            voirDetails,
            refresh,
            showSnackbar,
          })
        }
      />

      <DetailsEmpruntDialog
        open={openDetails}
        emprunt={selectedEmpruntDetails}
        onClose={closeDetails}
      />

      {extraDialogs?.({
        refresh,
        showSnackbar,
      })}

      <AppSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};