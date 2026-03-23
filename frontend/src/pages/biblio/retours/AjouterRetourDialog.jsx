import React, { useState } from "react";
import { http } from "../../../api/http";
import {RetourDialogBase} from "./RetourDialogBase";

const formatDateForApi = (date) => {
  if (!date) return null;

  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const AjouterRetourDialog = ({
  open,
  onClose,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const submit = async (form) => {
    setLoading(true);
    try {
      await http.post("/bibliothecaire/retours", {
  livre: form.livre,
  utilisateur: form.utilisateur,
  isbn: form.isbn?.trim() || null,
  description: form.description?.trim() || null,
  date_retour: formatDateForApi(form.date_retour),
      });

      onSuccess?.();
    } catch (e) {
      console.error(e);
      onError?.(
        e?.response?.data?.detail || "Erreur lors de l'ajout du retour."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RetourDialogBase
      open={open}
      onClose={onClose}
      onSubmit={submit}
      title="Ajouter un retour"
      submitLabel={loading ? "Ajout..." : "Ajouter"}
      loading={loading}
      isAdd
    />
  );
};