
import React from "react"
import {
    AppBar,
    Button,
    Toolbar, Typography
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom";


export const Header = ({ title , toggleDrawer, anchorEl, open})=>{

    const drawerWidth = 260;
    const nav = useNavigate();

    const logout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("utilisateur_id");
    localStorage.removeItem("email");
    nav("/login");
  };


return(
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 , width: !open? "100%": `calc(100% - ${drawerWidth}px)`
}}>
        <Toolbar 
           sx={{ 
            display: "flex",
             gap: 2 ,     
            }} key={anchorEl}>
            {!open && <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>}
          <Typography variant="h6" fontWeight={900} sx={{ flex: 1 }}>
            {title}
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
            Déconnexion
          </Button>
        </Toolbar>
      </AppBar>
)
}