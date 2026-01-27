import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import {
  Button, Paper, Stack, TextField, Typography,
  Table, TableBody, TableCell, TableHead, TableRow, Chip
} from "@mui/material";

export default function Livres() {
  const [q, setQ] = useState("");
  const [livres, setLivres] = useState([]);
  const [loading, setLoading] = useState(false);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await http.get("/bibliothecaire/livres", { params: q ? { q } : {} });
      setLivres(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { charger(); }, []);

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid #E6EAF2", borderRadius: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={900} sx={{ flex: 1 }}>
          Livres
        </Typography>
        <TextField
          size="small"
          label="Rechercher (titre / auteur / isbn)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Button variant="contained" onClick={charger} disabled={loading}>
          {loading ? "Chargement..." : "Rechercher"}
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Titre</TableCell>
            <TableCell>Auteur</TableCell>
            <TableCell>ISBN</TableCell>
            <TableCell>Disponibilité</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {livres.map((l) => (
            <TableRow key={l.id}>
              <TableCell>{l.id}</TableCell>
              <TableCell>{l.titre}</TableCell>
              <TableCell>{l.auteur}</TableCell>
              <TableCell>{l.isbn || "-"}</TableCell>
              <TableCell>
                <Chip
                  label={`${l.nb_disponible}/${l.nb_total}`}
                  variant="outlined"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
