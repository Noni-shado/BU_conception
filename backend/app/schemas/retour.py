from datetime import datetime, date
from pydantic import BaseModel


class UtilisateurMini(BaseModel):
    id: int
    email: str
    nom_complet: str | None = None

    class Config:
        from_attributes = True


class LivreMini(BaseModel):
    id: int
    titre: str

    class Config:
        from_attributes = True


class RetourOut(BaseModel):
    id: int

    utilisateur_id: int
    livre_id: int
    emprunt_id: int

    date_retour_prevue: date
    retourne_le: datetime | None = None

    statut: str

    utilisateur: UtilisateurMini | None = None
    livre: LivreMini | None = None

    class Config:
        from_attributes = True