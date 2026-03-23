import React from "react";
import { Button, Stack, Typography } from "@mui/material";


export const Header = ({title, Action})=>{

    return(
        <Stack direction="row" alignItems="center" mb={2} pl={1}>
        <Typography variant="h5" fontWeight={900} sx={{ flex: 1 }}>
          {title}
        </Typography>
         {Action}
        </Stack>
    )
}