import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export const TableFilter = ({
  label = "Filtre",
  value = "",
  options = [],
  onChange,
  minWidth = 220,
  size = "small",
  disabled = false,
}) => {
  return (
    <FormControl size={size} sx={{ minWidth }} disabled={disabled}>
      <InputLabel>{label}</InputLabel>
      <Select
        value={value}
        label={label}
        onChange={(e) => onChange?.(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};