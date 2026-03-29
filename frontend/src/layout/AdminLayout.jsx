import React from "react";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Header } from "../components/Header";
import DrawerLayout from "./DrawerLayout";

const items = [
  { label: "Comptes", path: "/admin", icon: <MenuBookIcon /> }

];

export default function AdminLayout() {
  return (
    <DrawerLayout
      renderHeader={(props) => (
        <Header {...props} title="Dashboard Admin" />
      )}
      items={items}
      subTitle="Admin"
    />
  );
}