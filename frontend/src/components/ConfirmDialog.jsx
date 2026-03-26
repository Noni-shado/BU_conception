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
  children,
  confirmDisabled = false,
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
          borderRadius: 3,
          px: 2.5,
          py: 2.5,
        },
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Box
            sx={{
              width: 48,
              height: 48,
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

          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>

          {message && (
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: "#374151",
                lineHeight: 1.5,
                maxWidth: 340,
              }}
            >
              {message}
            </Typography>
          )}

          {children && (
            <Box sx={{ width: "100%", mt: 1 }}>
              {children}
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          justifyContent: "center",
          gap: 1.5,
          mt: 2,
        }}
      >
        <Button
          onClick={onCancel}
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          {cancelLabel}
        </Button>

        <Button
          onClick={onConfirm}
          variant="contained"
          color={current.confirmColor}
          disabled={loading || confirmDisabled}
          sx={{
            borderRadius: 999,
            px: 2.5,
            textTransform: "none",
            boxShadow: "none",
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}