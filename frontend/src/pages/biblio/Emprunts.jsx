import React, { useEffect, useState } from "react";
import { http } from "../../api/http";
import {
  Button, Paper, Stack, Typography,
  Table, TableBody, TableCell, TableHead, TableRow
} from "@mui/material";

export default function Emprunts() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  const charger = async () => {
    setLoading(true);
    try {
      const res = await http.get("/bibliothecaire/emprunts");
      setRows(res.data);
    } finally {
      setLoading(false);
    }
  };

  const valider = async (id) => {
    await http.post(`/bibliothecaire/emprunts/${id}/valider`, { date_retour_prevue: null });
    await charger();
  };

  useEffect(() => { charger(); }, []);

  return (
    <Paper elevation={0} sx={{ p: 3, border: "1px solid #E6EAF2", borderRadius: 3 }}>
      <Stack direction="row" alignItems="center" mb={2}>
        <Typography variant="h5" fontWeight={900} sx={{ flex: 1 }}>
          Emprunts
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
            <TableCell>Statut</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((e) => (
            <TableRow key={e.id}>
              <TableCell>{e.id}</TableCell>
              <TableCell>{e.livre_id}</TableCell>
              <TableCell>{e.utilisateur_id}</TableCell>
              <TableCell>{e.statut}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  size="small"
                  disabled={e.statut !== "EN_ATTENTE"}
                  onClick={() => valider(e.id)}
                >
                  Valider
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
