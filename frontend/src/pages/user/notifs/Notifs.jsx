import React, { useEffect, useState } from "react";
import { http } from "../../../api/http";
import { Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { TableUI } from "../../../components/TableUI/TableUI";
import { Header } from "../../../components/TableUI/Header";
import { AppSnackbar } from "../../../components/AppSnackBar";

import { DetailsNotificationDialog } from "./DetailsNotificationDialog";

export default function Notifications() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const cells = [
    {
      key: "message",
      name: "Message",
      render: (row) => row.message ?? "-",
    },
    {
      key: "cree_le",
      name: "Date",
      render: (row) =>
        row.cree_le
          ? new Date(row.cree_le).toLocaleDateString("fr-FR")
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
      };

      const res = await http.get("/utilisateur/notifications", { params });

      setRows(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement des notifications.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    charger();
  }, [page, rowsPerPage]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const voirDetails = async (row) => {
    try {
      const res = await http.get(`/utilisateur/notifications/${row.id}`);
      setSelectedNotification(res.data);
      setOpenDetails(true);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Erreur lors du chargement du détail de la notification.",
        severity: "error",
      });
    }
  };

  const handleCloseDetails = () => {
    setOpenDetails(false);
    setSelectedNotification(null);
  };

  const tableHeader = <Header title="Notifications" />;

  return (
    <>
      <TableUI
        Header={tableHeader}
        cells={cells}
        dataCells={rows}
        loading={loading}
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

      <DetailsNotificationDialog
        open={openDetails}
        onClose={handleCloseDetails}
        notification={selectedNotification}
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