import React from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
  Box,
} from "@mui/material";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export function ConfirmDialog({
  open,
  title = "Confirmation",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  loading = false,
  type = "warning",
}) {
  const config = {
    warning: {
      icon: <WarningAmberIcon />,
      color: "#f59e0b",
      confirmColor: "error",
    },
    info: {
      icon: <InfoOutlinedIcon />,
      color: "#3b82f6",
      confirmColor: "primary",
    },
    success: {
      icon: <CheckCircleOutlineIcon />,
      color: "#10b981",
      confirmColor: "success",
    },
    error: {
      icon: <ErrorOutlineIcon />,
      color: "#ef4444",
      confirmColor: "error",
    },
  };

  const current = config[type] || config.warning;

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          px: 3,
          py: 3,
        },
      }}
    >
      <DialogContent>
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          {/* 🔥 ICON CIRCLE */}
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              backgroundColor: `${current.color}20`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: current.color,
            }}
          >
            {current.icon}
          </Box>

          {/* TITLE */}
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>

          {/* MESSAGE */}
          <Typography color="text.secondary">
            {message}
          </Typography>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 2,
          mt: 1,
        }}
      >
        <Button onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          color={current.confirmColor}
          disabled={loading}
          sx={{
            borderRadius: 999,
            px: 3,
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}