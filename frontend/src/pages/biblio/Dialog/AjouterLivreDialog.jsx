import React, { useState } from "react";
import { http } from "../../../api/http";
import {LivreDialogBase} from "./LivreDialogBase";

export const AjouterLivreDialog = ({ open, onClose, onSuccess })=> {
  const [loading, setLoading] = useState(false);

  const submit = async (form) => {
    setLoading(true);
    try {
      await http.post("/bibliothecaire/livres", {
        titre: form.titre.trim(),
        auteur: form.auteur.trim(),
        isbn: form.isbn.trim() ? form.isbn.trim() : null,
        description: form.description.trim(),
        nb_total: Number(form.nb_total) || 1,
      });

      onSuccess?.();
      onClose?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <LivreDialogBase
      open={open}
      onClose={onClose}
      onSubmit={submit}
      title="Ajouter un livre"
      submitLabel={loading ? "Ajout..." : "Ajouter"}
      loading={loading}
      isAdd
    />
  );
}