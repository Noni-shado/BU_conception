import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Header } from "../components/Header";
import DrawerLayout from "./DrawerLayout";

const items = [
  { label: "Livres", path: "/user", icon: <MenuBookIcon /> },
  { label: "Emprunts", path: "/user/emprunts", icon: <AssignmentIcon /> },
  { label: "Notifs", path: "/user/notifs", icon: <NotificationsIcon /> },
];

export default function UserLayout() {
  return (
    <DrawerLayout
      renderHeader={(props) => (
        <Header {...props} title="Dashboard Utilisateur" />
      )}
      items={items}
      subTitle="Utilisateur"
    />
  );
}