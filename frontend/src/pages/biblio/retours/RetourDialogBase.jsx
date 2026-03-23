import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { fr } from "date-fns/locale";

export const RetourDialogBase = ({
  open,
  onClose,
  onSubmit,
  title,
  submitLabel,
  loading = false,
  retour = null,
  isAdd = false,
  isDetails = false,
}) => {
  const [livre, setLivre] = useState("");
  const [utilisateur, setUtilisateur] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [dateRetour, setDateRetour] = useState(null);

  const [errors, setErrors] = useState({
    livre: "",
    utilisateur: "",
    dateRetour: "",
  });

  const livreRef = useRef(null);
  const disabled = isDetails;

  useEffect(() => {
    if (!open) return;

    if (isAdd) {
      setLivre("");
      setUtilisateur("");
      setIsbn("");
      setDescription("");
      setDateRetour(new Date());
    } else if (retour) {
      setLivre(retour.livre ?? "");
      setUtilisateur(retour.utilisateur ?? "");
      setIsbn(retour.isbn ?? "");
      setDescription(retour.description ?? "");
      setDateRetour(retour.date ? new Date(retour.date) : null);
    }

    setErrors({
      livre: "",
      utilisateur: "",
      dateRetour: "",
    });
  }, [open, retour, isAdd]);

  useEffect(() => {
    if (!open || isDetails) return;

    const timer = setTimeout(() => {
      livreRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [open, isDetails]);

  const initialValues = useMemo(() => {
    if (isAdd) {
      return {
        livre: "",
        utilisateur: "",
        isbn: "",
        description: "",
        dateRetour: null,
      };
    }

    return {
      livre: retour?.livre ?? "",
      utilisateur: retour?.utilisateur ?? "",
      isbn: retour?.isbn ?? "",
      description: retour?.description ?? "",
      dateRetour: retour?.date_retour ? new Date(retour.date_retour) : null,
    };
  }, [isAdd, retour]);

  const normalizeDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };

  const isDirty = isDetails
    ? false
    : livre !== initialValues.livre ||
      utilisateur !== initialValues.utilisateur ||
      isbn !== initialValues.isbn ||
      description !== initialValues.description ||
      normalizeDate(dateRetour) !== normalizeDate(initialValues.dateRetour);

  const validateField = (name, value) => {
    switch (name) {
      case "livre":
        return String(value).trim() ? "" : "Ce champ est requis";
      case "utilisateur":
        return String(value).trim() ? "" : "Ce champ est requis";
      case "dateRetour":
        return value ? "" : "Ce champ est requis";
      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      livre: validateField("livre", livre),
      utilisateur: validateField("utilisateur", utilisateur),
      dateRetour: validateField("dateRetour", dateRetour),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const isFormValid = isDetails
    ? true
    : String(livre).trim() !== "" &&
      String(utilisateur).trim() !== "" &&
      !!dateRetour;

  const handleSubmit = () => {
    if (isDetails) {
      onClose?.();
      return;
    }

    const valid = validateForm();
    if (!valid) return;

    onSubmit?.({
      livre: livre.trim(),
      utilisateur: utilisateur.trim(),
      isbn: isbn.trim(),
      description: description.trim(),
      date_retour: dateRetour,
    });
  };

  const commonTextFieldSx = {
    "& .MuiFormLabel-asterisk": {
      color: "error.main",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#111827",
      color: "#111827",
    },
    "& .MuiInputLabel-root.Mui-disabled": {
      color: "#374151",
    },
    "& .MuiInputBase-root.Mui-disabled": {
      backgroundColor: "#fff",
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="md"
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 2,
            width: "100%",
            maxWidth: 900
          },
        }}
      >
        <DialogTitle>{title}</DialogTitle>

        <DialogContent
          sx={{
            pt: 1
          }}
        >
          <Stack spacing={2} sx={{ mt: 1, pb: 1 }}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                inputRef={livreRef}
                label="Livre"
                value={livre}
                onChange={(e) => {
                  const value = e.target.value;
                  setLivre(value);
                  if (errors.livre) {
                    setErrors((prev) => ({
                      ...prev,
                      livre: validateField("livre", value),
                    }));
                  }
                }}
                onBlur={() => {
                  setErrors((prev) => ({
                    ...prev,
                    livre: validateField("livre", livre),
                  }));
                }}
                required={!isDetails}
                fullWidth
                disabled={disabled}
                error={!!errors.livre}
                helperText={errors.livre}
                sx={commonTextFieldSx}
              />

              
              <DatePicker
                label="Date de retour"
                value={dateRetour}
                onChange={(newValue) => {
                  setDateRetour(newValue);
                  if (errors.dateRetour) {
                    setErrors((prev) => ({
                      ...prev,
                      dateRetour: validateField("dateRetour", newValue),
                    }));
                  }
                }}
                disabled={disabled}
                slotProps={{
                     popper: {
      placement: "bottom", 
    },
                  textField: {
                    fullWidth: true,
                    required: !isDetails,
                    error: !!errors.dateRetour,
                    helperText: errors.dateRetour,
                    onBlur: () => {
                      setErrors((prev) => ({
                        ...prev,
                        dateRetour: validateField("dateRetour", dateRetour),
                      }));
                    },
                    sx: commonTextFieldSx,
                  },
                }}
              />

   
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>

                         <TextField
                label="Utilisateur"
                value={utilisateur}
                onChange={(e) => {
                  const value = e.target.value;
                  setUtilisateur(value);
                  if (errors.utilisateur) {
                    setErrors((prev) => ({
                      ...prev,
                      utilisateur: validateField("utilisateur", value),
                    }));
                  }
                }}
                onBlur={() => {
                  setErrors((prev) => ({
                    ...prev,
                    utilisateur: validateField("utilisateur", utilisateur),
                  }));
                }}
                required={!isDetails}
                fullWidth
                disabled={disabled}
                error={!!errors.utilisateur}
                helperText={errors.utilisateur}
                sx={commonTextFieldSx}
              />

                            <TextField
                label="ISBN"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                fullWidth
                disabled={disabled}
                sx={commonTextFieldSx}
              />

            </Stack>

            <TextField
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={2}
              fullWidth
              disabled={disabled}
              sx={commonTextFieldSx}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose}>
            {isDetails ? "Fermer" : "Annuler"}
          </Button>

          {!isDetails && (
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={loading || !isDirty || !isFormValid}
            >
              {submitLabel}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};