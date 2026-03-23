import React from "react";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Header } from "../components/Header";
import DrawerLayout from "./DrawerLayout";

const items = [
  { label: "Livres", path: "/biblio", icon: <MenuBookIcon /> },
  { label: "Emprunts", path: "/biblio/emprunts", icon: <AssignmentIcon /> },
  { label: "Retours", path: "/biblio/retours", icon: <AssignmentTurnedInIcon /> },
];

export default function BiblioLayout() {
  return (
    <DrawerLayout
      renderHeader={(props) => (
        <Header {...props} title="Dashboard Bibliothécaire" />
      )}
      items={items}
      subTitle="Bibliothécaire"
    />
  );
}