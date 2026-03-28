import React from "react";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Divider,
} from "@mui/material";

export default function Profile() {
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");

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
        {/* HEADER */}
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
          Mon profil
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* INFOS */}
        <Stack spacing={3}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {email || "-"}
            </Typography>
          </Box>

          <Box>
            <Typography variant="caption" color="text.secondary">
              Rôle
            </Typography>
            <Typography
              variant="body1"
              sx={{
                fontWeight: 600,
                textTransform: "capitalize",
              }}
            >
              {role?.toLowerCase() || "-"}
            </Typography>
          </Box>
        </Stack>
      </Paper>
  );
}