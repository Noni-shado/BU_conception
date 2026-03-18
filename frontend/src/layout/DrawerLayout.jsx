import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography
} from "@mui/material";
import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import IconButton from "@mui/material/IconButton";

const drawerWidth = 260;

export default function DrawerLayout({ items, renderHeader, title, subTitle }) {
  const nav = useNavigate();
  const loc = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const DrawerHeader = styled("div")(({ theme }) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  }));

  const handleDrawerClose = () => {
    setAnchorEl(null);
  };

  const toggleDrawer = (event) => {
    if (anchorEl) {
      setAnchorEl(null);
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {renderHeader({ toggleDrawer, open, anchorEl })}

      <Drawer
        variant={open ? "permanent" : "temporary"}
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #E6EAF2",
            bgcolor: "#F5F7FB",
          },
        }}
      >
        <DrawerHeader>
          <Typography
            variant="h6"
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              fontWeight: 500,
              color: "#000",
            }}
          >
            {subTitle}
          </Typography>

          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List sx={{ px: 1, py: 1, mt:2 }}>
          {items.map((it) => {
            const selected = loc.pathname === it.path;
            return (
              <ListItemButton
                key={it.path}
                selected={selected}
                onClick={() => nav(it.path)}
                sx={{
                  borderRadius: 3,
                  my: 0.5,
                  color: "#000",
                  "& .MuiListItemIcon-root": {
                    color: "#6B7280",
                    minWidth: 40,
                  },
                  "&.Mui-selected": {
                    bgcolor: "#E9EDF7",
                  },
                  "&.Mui-selected:hover": {
                    bgcolor: "#E9EDF7",
                  },
                }}
              >
                <ListItemIcon>{it.icon}</ListItemIcon>
                <ListItemText
                  primary={it.label}
                  primaryTypographyProps={{
                    sx: { color: "#000", fontWeight: 500 },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#F5F7FB",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}