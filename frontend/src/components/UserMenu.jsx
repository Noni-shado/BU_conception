import React, { useState } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

import { useNavigate } from "react-router-dom";

export const UserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const nav = useNavigate();

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

const goToProfile = () => {
  handleClose();

  const role = localStorage.getItem("role");

  if (role === "BIBLIOTHECAIRE") {
    nav("/biblio/profile");
  } else if (role === "UTILISATEUR") {
    nav("/user/profile");
  }  else if (role === "ADMIN") {
    nav("/admin/profile");
  } else {
    nav("/login");
  }
};

  const logout = () => {
    handleClose();
    localStorage.removeItem("role");
    localStorage.removeItem("utilisateur_id");
    localStorage.removeItem("email");
    nav("/login");
  };

  return (
    <>
    <IconButton
  color="inherit"
  onClick={handleOpen}
  sx={{
    pr: 2,        // paddingRight
  }}
>
  <AccountCircleIcon sx={{ fontSize: 34 }} />
</IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          elevation: 3,
          sx: {
            mt: 1,
            borderRadius: 1,
            minWidth: 180,
          },
        }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={goToProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Profil" />
        </MenuItem>

        <Divider />

        <MenuItem onClick={logout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </MenuItem>
      </Menu>
    </>
  );
};