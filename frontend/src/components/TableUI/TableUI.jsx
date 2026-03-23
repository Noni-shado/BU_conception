import React, { useMemo, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  TablePagination
} from "@mui/material";

export const TableUI = ({
  cells,
  dataCells = [],
  renderActions,
  Header,
  chipData = {}
}) => {
  const { getColor, getLabel } = chipData;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("fr-FR") : "-";

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = useMemo(() => {
    const start = page * rowsPerPage;
    const end = start + rowsPerPage;
    return dataCells.slice(start, end);
  }, [dataCells, page, rowsPerPage]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #E6EAF2",
        borderRadius: 1,
        overflow: "hidden"
      }}
    >
      {Header}

      <TableContainer sx={{ overflowX: "auto" }}>
        <Table sx={{ minWidth: 900 }}>
          <TableHead>
            <TableRow>
              {cells.map((cel) => (
                <TableCell
                  key={cel.key}
                  align={cel.key === "actions" ? "center" : "left"}
                  sx={{
                    fontWeight: 700,
                    fontSize: "1rem",
                    color: "#111827"
                  }}
                >
                  {cel.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {paginatedRows.map((data) => (
              <TableRow
                key={data.id}
                hover
                sx={{
                  "&:last-child td": { borderBottom: 0 }
                }}
              >
                {cells.map((cel) => (
                  <TableCell
                    key={cel.key}
                    align={cel.key === "actions" ? "center" : "left"}
                   sx={{
  py: 0.5, // réduit hauteur
  fontSize: "0.92rem", // un peu plus compact
  verticalAlign: "middle"
}}
                  >
                    {cel.key === "actions" && renderActions ? (
                      renderActions(data)
                    ) : cel.key === "statut" ? (
                      <Chip
                        label={getLabel?.(data[cel.key]) ?? "-"}
                        variant="filled"
                        color={getColor?.(data[cel.key]) ?? "default"}
                        size="small"
                        sx={{
                          fontSize: "0.75rem",
                          height: 28,
                          fontWeight: 500
                        }}
                      />
                    ) : cel.key === "date" ? (
                      formatDate(data[cel.key])
                    ) : (
                      data[cel.key] ?? "-"
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}

            {dataCells.length === 0 && (
              <TableRow>
                <TableCell colSpan={cells.length} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    Aucune donnée trouvée.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={dataCells.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Lignes par page :"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
        }
        sx={{
          mt: 2,
          ".MuiTablePagination-toolbar": {
            px: 0
          }
        }}
      />
    </Paper>
  );
};