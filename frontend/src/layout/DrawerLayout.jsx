import React from "react";
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
  Typography,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { styled, useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 260;

const DrawerHeader = styled("div")(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function DrawerLayout({ items, renderHeader, subTitle }) {
  const nav = useNavigate();
  const loc = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = React.useState(!isMobile);

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleItemClick = (path) => {
    nav(path);
    if (isMobile) {
      setOpen(false);
    }
  };

  const drawerContent = (
    <>
      <DrawerHeader>
        <Typography
          variant="h6"
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            fontWeight: 700,
            color: "#000",
            whiteSpace: "nowrap",
          }}
        >
          {subTitle}
        </Typography>

        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List sx={{ px: 1, py: 1, mt: 2 }}>
        {items.map((it) => {
          const selected = loc.pathname === it.path;

          return (
            <ListItemButton
              key={it.path}
              selected={selected}
              onClick={() => handleItemClick(it.path)}
              sx={{
                borderRadius: 3,
                my: 0.5,
                color: "#000",
                minHeight: 48,
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
                  sx: {
                    color: "#000",
                    fontWeight: 600,
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F5F7FB",
        overflowX: "hidden",
      }}
    >
      <CssBaseline />

      {renderHeader({
        toggleDrawer,
        open,
        isMobile,
        drawerWidth,
      })}

      {!isMobile && (
        <Box
          sx={{
            width: open ? `${drawerWidth}px` : 0,
            flexShrink: 0,
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.standard,
            }),
          }}
        />
      )}

      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: "1px solid #E6EAF2",
            bgcolor: "#F5F7FB",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          bgcolor: "#F5F7FB",
          width: "100%",
          overflowX: "hidden",
        }}
      >
        <Toolbar />
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}