from pydantic import BaseModel, EmailStr, Field
from typing import Optional

class UtilisateurCreate(BaseModel):
    email: EmailStr
    mot_de_passe: str = Field(min_length=6)
    nom_complet: str = ""
    role: str


class UtilisateurLogin(BaseModel):
    email: EmailStr
    mot_de_passe: str

class UtilisateurOut(BaseModel):
    id: int
    email: EmailStr
    nom_complet: str
    role: str
    actif: bool

    class Config:
        from_attributes = True

class UtilisateurUpdate(BaseModel):
    nom_complet: Optional[str] = None
    role: Optional[str] = None
    actif: Optional[bool] = None
