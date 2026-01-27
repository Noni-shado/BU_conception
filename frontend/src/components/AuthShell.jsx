import React from "react";
import { Box, Container, Paper, Typography } from "@mui/material";

export default function AuthShell({ title, subtitle, children }) {
    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            {/* Bandeau */}
            <Box sx={{ bgcolor: "primary.main", color: "white", py: 6 }}>
                <Container maxWidth="sm">
                    <Typography variant="overline" sx={{ opacity: 0.9 }}>
                        Bibliothèque Universitaire
                    </Typography>
                    <Typography variant="h4" fontWeight={800} sx={{ mt: 0.5 }}>
                        {title}
                    </Typography>
                    {subtitle ? (
                        <Typography sx={{ mt: 1, opacity: 0.9 }}>{subtitle}</Typography>
                    ) : null}
                </Container>
            </Box>

            {/* Card */}
            <Container maxWidth="sm" sx={{ mt: -5, pb: 6 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2.5, sm: 3 },
                        border: "1px solid #E6EAF2",
                        boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
                    }}
                >
                    {children}
                </Paper>
            </Container>
        </Box>
    );
}
