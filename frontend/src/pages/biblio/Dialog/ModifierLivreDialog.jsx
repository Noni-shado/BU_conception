import React, { useState } from "react";
import { http } from "../../../api/http";
import { LivreDialogBase } from "./LivreDialogBase";

export const ModifierLivreDialog = ({
  open,
  onClose,
  onSuccess,
  onError,
  livre,
}) => {
  const [loading, setLoading] = useState(false);

  const submit = async (form) => {
    if (!livre?.id) return;

    setLoading(true);
    try {
      await http.put(`/bibliothecaire/livres/${livre.id}`, {
        titre: form.titre.trim(),
        auteur: form.auteur.trim(),
        isbn: form.isbn.trim() ? form.isbn.trim() : null,
        description: form.description.trim(),
        nb_total: Number(form.nb_total) || 1,
        nb_disponible: Number(form.nb_disponible) || 0,
      });

      onSuccess?.();
    } catch (e) {
      console.error(e);
      onError?.(
        e?.response?.data?.detail || "Erreur lors de la modification du livre."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <LivreDialogBase
      open={open}
      onClose={onClose}
      onSubmit={submit}
      title="Modifier le livre"
      submitLabel={loading ? "Sauvegarde..." : "Enregistrer"}
      loading={loading}
      livre={livre}
      isEdit
    />
  );
};