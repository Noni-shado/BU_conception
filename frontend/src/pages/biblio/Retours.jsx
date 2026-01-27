import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import {
  Button, Paper, Stack, Typography,
  Table, TableBody, TableCell, TableHead, TableRow
} from "@mui/material";

export default function Retours() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await http.get("/bibliothecaire/retours");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  const valider = async (id) => {
    await http.post(`/bibliothecaire/retours/${id}/valider`);
    await charger();
  };

  useEffect(() => { charger(); }, []);

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid #E6EAF2", borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={900} sx={{ flex: 1 }}>
          Retours
        </Typography>
        <Button onClick={charger} disabled={loading}>
          Rafraîchir
        </Button>
      </Stack>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Livre</TableCell>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Retourné ?</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>{r.id}</TableCell>
              <TableCell>{r.livre_id}</TableCell>
              <TableCell>{r.utilisateur_id}</TableCell>
              <TableCell>{r.retourne_le ? "Oui" : "Non"}</TableCell>
              <TableCell>{r.statut}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  disabled={!r.retourne_le || r.statut === "RETOURNE"}
                  onClick={() => valider(r.id)}
                >
                  Valider retour
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
