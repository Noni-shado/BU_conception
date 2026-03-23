export const EMPRUNT_STATUS = {
    EN_ATTENTE: "EN_ATTENTE",
    VALIDE: "VALIDE",
    RETOURNE: "RETOURNE",
    EN_RETARD: "EN_RETARD",
};

export const EMPRUNT_STATUS_CONFIG = {
    EN_ATTENTE: { label: "En attente", color: "warning" },
    VALIDE: { label: "Validé", color: "success" },
    RETOURNE: { label: "Retourné", color: "info" },
    EN_RETARD: { label: "En retard", color: "error" },
};

export const RETOUR_STATUS = {
    EN_ATTENTE: "EN_ATTENTE",
    RETOURNE: "RETOURNE",
    REFUSE: "REFUSE",
};

export const RETOUR_STATUS_CONFIG = {
    [RETOUR_STATUS.EN_ATTENTE]: {
        label: "En attente",
        color: "warning",
    },
    [RETOUR_STATUS.RETOURNE]: {
        label: "Retourné",
        color: "success",
    },
    [RETOUR_STATUS.REFUSE]: {
        label: "Refusé",
        color: "error",
    },
};