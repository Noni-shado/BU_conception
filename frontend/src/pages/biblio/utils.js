export const EMPRUNT_STATUS = {
    EN_ATTENTE: "EN_ATTENTE",
    VALIDE: "VALIDE",
    REFUSE: "REFUSE"
};

export const EMPRUNT_STATUS_CONFIG = {
    EN_ATTENTE: { label: "En attente", color: "warning" },
    VALIDE: { label: "Validé", color: "success" },
    REFUSE: { label: "Refusé", color: "error" }
};



export const RETOUR_STATUS = {
    EN_ATTENTE: "EN_ATTENTE",
    EN_RETARD: "EN_RETARD",
    RETOURNE: "RETOURNE",
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
    [RETOUR_STATUS.EN_RETARD]: {
        label: "En retard",
        color: "error",
    }
};