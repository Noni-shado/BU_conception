from pydantic import BaseModel
from datetime import datetime, date
from typing import Optional

class EmpruntOut(BaseModel):
    id: int
    utilisateur_id: int
    livre_id: int
    statut: str

    demande_le: datetime
    valide_le: Optional[datetime]
    date_retour_prevue: Optional[date]

    retourne_le: Optional[datetime]
    retour_valide_le: Optional[datetime]

    class Config:
        from_attributes = True

class ValiderEmpruntIn(BaseModel):
    date_retour_prevue: Optional[date] = None
