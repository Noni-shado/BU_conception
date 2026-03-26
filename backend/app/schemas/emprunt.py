from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class UtilisateurEmpruntOut(BaseModel):
    id: int
    email: str
    nom_complet: Optional[str]
    role: str
    actif: bool

    class Config:
        from_attributes = True


class LivreEmpruntOut(BaseModel):
    id: int
    titre: str
    auteur: str
    isbn: str
    description: Optional[str]
    nb_total: int
    nb_disponible: int

    class Config:
        from_attributes = True


class RefuserEmpruntIn(BaseModel):
    motif_refus: str
    
class EmpruntOut(BaseModel):
    id: int
    utilisateur_id: int
    livre_id: int
    statut: str

    demande_le: datetime
    valide_le: Optional[datetime]
    date_retour_prevue: Optional[date]
    motif_refus: Optional[str] = None

    utilisateur: UtilisateurEmpruntOut
    livre: LivreEmpruntOut

    class Config:
        from_attributes = True


class ValiderEmpruntIn(BaseModel):
    date_retour_prevue: Optional[date] = None


