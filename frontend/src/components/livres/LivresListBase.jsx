import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import { TableUI } from "../TableUI/TableUI";
import { SearchBar } from "../SearchBar/SearchBar";
import { AppSnackbar } from "../AppSnackBar";

export function LivresListBase({
  endpoint,
  title = "Livres",
  cells,
  renderHeader,
  renderActions,
  searchFields = ["titre", "auteur", "ISBN"],
  extraParams = {},
}) {
  const [q, setQ] = useState("");
  const [livres, setLivres] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const charger = async (customPage = page) => {
    setLoading(true);
    try {
      const res = await http.get(endpoint, {
        params: {
          ...(q ? { q } : {}),
          ...extraParams,
          page: customPage + 1,
          page_size: rowsPerPage,
        },
      });

      setLivres(res.data.items ?? []);
      setTotal(res.data.total ?? 0);
    } catch (error) {
      setSnackbar({
        open: true,
        message:
          error?.response?.data?.detail ||
          "Erreur lors du chargement des livres.",
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
  }, [q, page, rowsPerPage, endpoint]);

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

  const handleCloseSnackbar = (_, reason) => {
    if (reason === "clickaway") return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const showSnackbar = ({ message, severity = "success" }) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const refresh = async () => {
    await charger();
  };

  const dataCells = livres.map((l) => ({
    ...l,
    isbn: l.isbn || "-",
    disponibilite:
      l.nb_disponible !== undefined && l.nb_total !== undefined
        ? `${l.nb_disponible}/${l.nb_total}`
        : "-",
  }));

  const helpers = {
    charger,
    refresh,
    showSnackbar,
    setSnackbar,
    setPage,
    setQ,
    livres,
    page,
    rowsPerPage,
    total,
    loading,
    q,
  };

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
        Header={renderHeader ? renderHeader({ title, helpers }) : null}
        cells={cells}
        dataCells={dataCells}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        total={total}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        renderActions={(livre) => renderActions?.(livre, helpers)}
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