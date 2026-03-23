import React from "react";
import {
  AppBar,
  Button,
  Toolbar,
  Typography,
  IconButton,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";

export const Header = ({ title, toggleDrawer, open, isMobile, drawerWidth }) => {
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("utilisateur_id");
    localStorage.removeItem("email");
    nav("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        width:
          !isMobile && open
            ? `calc(100% - ${drawerWidth}px)`
            : "100%",
        ml: !isMobile && open ? `${drawerWidth}px` : 0,
        transition: (theme) =>
          theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.standard,
          }),
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          gap: 1,
          minHeight: { xs: 64, sm: 64 },
          px: { xs: 1.5, sm: 2 },
        }}
      >
        {(isMobile || !open) && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: 900,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            fontSize: { xs: "1rem", sm: "1.25rem" },
          }}
        >
          {title}
        </Typography>

        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={logout}
          sx={{
            minWidth: "auto",
            whiteSpace: "nowrap",
          }}
        >
          <Typography
            component="span"
            sx={{ display: { xs: "none", sm: "inline" } }}
          >
            Déconnexion
          </Typography>
        </Button>
      </Toolbar>
    </AppBar>
  );
};