import React from "react";
import {LivreDialogBase} from "./LivreDialogBase";

export const  DetailsLivreDialog = ({ open, onClose, livre })=>{
  return (
    <LivreDialogBase
      open={open}
      onClose={onClose}
      title="Détails du livre"
      livre={livre}
      isDetails
    />
  );
}