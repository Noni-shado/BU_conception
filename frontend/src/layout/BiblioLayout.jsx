import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar, Box, CssBaseline, Divider, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Typography, Button
} from "@mui/material";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 260;

const items = [
  { label: "Livres (Accueil)", path: "/biblio", icon: <MenuBookIcon /> },
  { label: "Emprunts", path: "/biblio/emprunts", icon: <AssignmentIcon /> },
  { label: "Retours", path: "/biblio/retours", icon: <AssignmentTurnedInIcon /> },
];

export default function BiblioLayout() {
  const nav = useNavigate();
  const loc = useLocation();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("utilisateur_id");
    localStorage.removeItem("email");
    nav("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", gap: 2 }}>
          <Typography variant="h6" fontWeight={900} sx={{ flex: 1 }}>
            Dashboard Bibliothécaire
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #E6EAF2",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ px: 2, py: 2 }}>
          <Typography fontWeight={900}>BU</Typography>
          <Typography variant="body2" color="text.secondary">
            Bibliothécaire
          </Typography>
        </Box>
        <Divider />

        <List sx={{ px: 1, py: 1 }}>
          {items.map((it) => {
            const selected = loc.pathname === it.path;
            return (
              <ListItemButton
                key={it.path}
                selected={selected}
                onClick={() => nav(it.path)}
                sx={{ borderRadius: 2, my: 0.5 }}
              >
                <ListItemIcon>{it.icon}</ListItemIcon>
                <ListItemText primary={it.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: "#F5F7FB", minHeight: "100vh" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
