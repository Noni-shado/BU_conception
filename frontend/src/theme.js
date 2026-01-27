import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: { main: "#2F5BEA" },
        background: { default: "#F5F7FB" },
    },
    shape: { borderRadius: 16 },
    typography: {
        fontFamily: ["Inter", "system-ui", "Arial"].join(","),
    },
});
