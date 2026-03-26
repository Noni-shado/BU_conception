import React from "react";
import { Button, Stack, TextField } from "@mui/material";

export function SearchBar({
  value = "",
  onChange,
  onSubmit,
  loading = false,
  searchFields = [],
  label = "Rechercher",
  buttonLabel = "Rechercher",
  autoFocus = false,
}) {
  const placeholder =
    searchFields.length > 0
      ? `Rechercher par : ${searchFields.join(", ")}`
      : "Rechercher";

  return (
    <Stack
      component="form"
      onSubmit={onSubmit}
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      mb={2}
    >
      <TextField
        size="small"
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        fullWidth
        autoFocus={autoFocus}
      />

      <Button type="submit" variant="outlined" disabled={loading}>
        {buttonLabel}
      </Button>
    </Stack>
  );
}