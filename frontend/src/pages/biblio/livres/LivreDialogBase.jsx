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

export const LivreDialogBase = ({
  open,
  onClose,
  onSubmit,
  title,
  submitLabel,
  loading = false,
  livre = null,
  isAdd = false,
  isEdit = false,
  isDetails = false,
}) => {
  const [titre, setTitre] = useState("");
  const [auteur, setAuteur] = useState("");
  const [isbn, setIsbn] = useState("");
  const [description, setDescription] = useState("");
  const [nbTotal, setNbTotal] = useState(1);
  const [nbDisponible, setNbDisponible] = useState(1);

  const [errors, setErrors] = useState({
    titre: "",
    auteur: "",
    nbTotal: "",
    nbDisponible: "",
  });

  const titreRef = useRef(null);
  const disabled = isDetails;

  useEffect(() => {
    if (!open) return;

    if (isAdd) {
      setTitre("");
      setAuteur("");
      setIsbn("");
      setDescription("");
      setNbTotal(1);
      setNbDisponible(1);
    } else if (livre) {
      setTitre(livre.titre ?? "");
      setAuteur(livre.auteur ?? "");
      setIsbn(livre.isbn ?? "");
      setDescription(livre.description ?? "");
      setNbTotal(livre.nb_total ?? 1);
      setNbDisponible(livre.nb_disponible ?? 1);
    }

    setErrors({
      titre: "",
      auteur: "",
      nbTotal: "",
      nbDisponible: "",
    });
  }, [open, livre, isAdd]);

  useEffect(() => {
    if (!open || isDetails) return;

    const timer = setTimeout(() => {
      titreRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, [open, isDetails]);

  const initialValues = useMemo(() => {
    if (isAdd) {
      return {
        titre: "",
        auteur: "",
        isbn: "",
        description: "",
        nbTotal: 1,
        nbDisponible: 1,
      };
    }

    return {
      titre: livre?.titre ?? "",
      auteur: livre?.auteur ?? "",
      isbn: livre?.isbn ?? "",
      description: livre?.description ?? "",
      nbTotal: livre?.nb_total ?? 1,
      nbDisponible: livre?.nb_disponible ?? 1,
    };
  }, [isAdd, livre]);

  const isDirty =
    titre !== initialValues.titre ||
    auteur !== initialValues.auteur ||
    isbn !== initialValues.isbn ||
    description !== initialValues.description ||
    Number(nbTotal) !== Number(initialValues.nbTotal) ||
    Number(nbDisponible) !== Number(initialValues.nbDisponible);

  const validateField = (name, value) => {
    switch (name) {
      case "titre":
        if (!String(value).trim()) return "Ce champ est requis";
        return "";

      case "auteur":
        if (!String(value).trim()) return "Ce champ est requis";
        return "";

      case "nbTotal":
        if (value === "" || value === null || value === undefined) {
          return "Ce champ est requis";
        }
        if (Number(value) < 0) {
          return "La valeur doit être supérieure ou égale à 0";
        }
        return "";

      case "nbDisponible":
        if (isEdit || isDetails) {
          if (value === "" || value === null || value === undefined) {
            return "Ce champ est requis";
          }
          if (Number(value) < 0) {
            return "La valeur doit être supérieure ou égale à 0";
          }
          if (Number(value) > Number(nbTotal)) {
            return "Le nombre disponible ne doit pas dépasser le nombre total";
          }
        }
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      titre: validateField("titre", titre),
      auteur: validateField("auteur", auteur),
      nbTotal: validateField("nbTotal", nbTotal),
      nbDisponible: validateField("nbDisponible", nbDisponible),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some(Boolean);
  };

  const isFormValid = useMemo(() => {
    const titreValid = String(titre).trim() !== "";
    const auteurValid = String(auteur).trim() !== "";
    const nbTotalValid =
      nbTotal !== "" &&
      nbTotal !== null &&
      nbTotal !== undefined &&
      Number(nbTotal) >= 0;

    const nbDisponibleValid =
      !isEdit ||
      (nbDisponible !== "" &&
        nbDisponible !== null &&
        nbDisponible !== undefined &&
        Number(nbDisponible) >= 0 &&
        Number(nbDisponible) <= Number(nbTotal));

    return titreValid && auteurValid && nbTotalValid && nbDisponibleValid;
  }, [titre, auteur, nbTotal, nbDisponible, isEdit]);

  const handleSubmit = () => {
    if (isDetails) {
      onClose?.();
      return;
    }

    const valid = validateForm();
    if (!valid) return;

    onSubmit?.({
      titre: titre.trim(),
      auteur: auteur.trim(),
      isbn: isbn.trim(),
      description: description.trim(),
      nb_total: Number(nbTotal),
      nb_disponible: Number(nbDisponible),
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
          maxWidth: 900,
        },
      }}
    >
      <DialogTitle>{title}</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              inputRef={titreRef}
              label="Titre"
              value={titre}
              onChange={(e) => {
                const value = e.target.value;
                setTitre(value);
                if (errors.titre) {
                  setErrors((prev) => ({
                    ...prev,
                    titre: validateField("titre", value),
                  }));
                }
              }}
              onBlur={() => {
                setErrors((prev) => ({
                  ...prev,
                  titre: validateField("titre", titre),
                }));
              }}
              required={!isDetails}
              fullWidth
              disabled={disabled}
              error={!!errors.titre}
              helperText={errors.titre}
              sx={commonTextFieldSx}
            />

            <TextField
              label="Auteur"
              value={auteur}
              onChange={(e) => {
                const value = e.target.value;
                setAuteur(value);
                if (errors.auteur) {
                  setErrors((prev) => ({
                    ...prev,
                    auteur: validateField("auteur", value),
                  }));
                }
              }}
              onBlur={() => {
                setErrors((prev) => ({
                  ...prev,
                  auteur: validateField("auteur", auteur),
                }));
              }}
              required={!isDetails}
              fullWidth
              disabled={disabled}
              error={!!errors.auteur}
              helperText={errors.auteur}
              sx={commonTextFieldSx}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="ISBN (optionnel)"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              fullWidth
              disabled={disabled}
              sx={commonTextFieldSx}
            />

            <TextField
              label="Nombre total d'exemplaires"
              type="number"
              value={nbTotal}
              onChange={(e) => {
                const value = e.target.value;
                setNbTotal(value);

                setErrors((prev) => ({
                  ...prev,
                  nbTotal: prev.nbTotal ? validateField("nbTotal", value) : "",
                  nbDisponible:
                    isEdit && prev.nbDisponible
                      ? validateField("nbDisponible", nbDisponible)
                      : prev.nbDisponible,
                }));
              }}
              onBlur={() => {
                setErrors((prev) => ({
                  ...prev,
                  nbTotal: validateField("nbTotal", nbTotal),
                  nbDisponible:
                    isEdit || isDetails
                      ? validateField("nbDisponible", nbDisponible)
                      : prev.nbDisponible,
                }));
              }}
              inputProps={{ min: 0 }}
              required={!isDetails}
              fullWidth
              disabled={disabled}
              error={!!errors.nbTotal}
              helperText={errors.nbTotal}
              sx={commonTextFieldSx}
            />
          </Stack>

          {(isEdit || isDetails) && (
            <TextField
              label="Nombre disponible"
              type="number"
              value={nbDisponible}
              onChange={(e) => {
                const value = e.target.value;
                setNbDisponible(value);
                if (errors.nbDisponible) {
                  setErrors((prev) => ({
                    ...prev,
                    nbDisponible: validateField("nbDisponible", value),
                  }));
                }
              }}
              onBlur={() => {
                setErrors((prev) => ({
                  ...prev,
                  nbDisponible: validateField("nbDisponible", nbDisponible),
                }));
              }}
              inputProps={{ min: 0 }}
              required={!isDetails}
              fullWidth
              disabled={disabled}
              error={!!errors.nbDisponible}
              helperText={
                errors.nbDisponible ||
                (isEdit ? "nb_disponible ne doit pas dépasser nb_total" : "")
              }
              sx={commonTextFieldSx}
            />
          )}

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
  );
};