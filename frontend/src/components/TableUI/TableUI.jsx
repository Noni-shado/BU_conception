import React from "react";
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
  TablePagination,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";

export const TableUI = ({
  cells,
  dataCells = [],
  renderActions,
  Header,
  chipData = {},
  filters = [],
  filterValues = {},
  onFilterChange,
  loading = false,

  page = 0,
  rowsPerPage = 5,
  total = 0,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const { getColor, getLabel } = chipData;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("fr-FR") : "-";

  const renderCellContent = (cel, data) => {
    if (cel.key === "actions" && renderActions) {
      return renderActions(data);
    }

    if (typeof cel.render === "function") {
      return cel.render(data);
    }

    if (cel.key === "statut") {
      return (
        <Chip
          label={getLabel?.(data[cel.key]) ?? "-"}
          variant="filled"
          color={getColor?.(data[cel.key]) ?? "default"}
          size="small"
          sx={{
            fontSize: "0.75rem",
            height: 28,
            fontWeight: 500,
          }}
        />
      );
    }
    
    return data[cel.key] ?? "-";
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: "1px solid #E6EAF2",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      {Header}

      {filters.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          mb={2}
          justifyContent="flex-end"
        >
          {filters.map((filter) => (
            <FormControl
              key={filter.key}
              size="small"
              sx={{ minWidth: filter.minWidth || 180 }}
              disabled={loading}
            >
              <InputLabel>{filter.label}</InputLabel>
              <Select
                value={filterValues[filter.key] ?? ""}
                label={filter.label}
                onChange={(e) => onFilterChange?.(filter.key, e.target.value)}
              >
                {(filter.options || []).map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </Stack>
      )}

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
                    color: "#111827",
                  }}
                >
                  {cel.name}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={cells.length} align="center" sx={{ py: 6 }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1.5,
                    }}
                  >
                    <CircularProgress size={32} />
                    <Typography color="text.secondary">
                      Chargement...
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : dataCells.length > 0 ? (
              dataCells.map((data) => (
                <TableRow
                  key={data.id}
                  hover
                  sx={{
                    "&:last-child td": { borderBottom: 0 },
                  }}
                >
                  {cells.map((cel) => (
                    <TableCell
                      key={cel.key}
                      align={cel.key === "actions" ? "center" : "left"}
                      sx={{
                        py: 0.5,
                        fontSize: "0.92rem",
                        verticalAlign: "middle",
                      }}
                    >
                      {renderCellContent(cel, data)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
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
        count={total}
        page={page}
        onPageChange={onPageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        rowsPerPageOptions={[5, 10, 25]}
        labelRowsPerPage="Lignes par page :"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`
        }
        disabled={loading}
        sx={{
          mt: 2,
          ".MuiTablePagination-toolbar": {
            px: 0,
          },
        }}
      />
    </Paper>
  );
};