from pydantic import BaseModel
from typing import Optional

class LivreCreate(BaseModel):
    titre: str
    auteur: str
    isbn: Optional[str] = None
    description: str = ""
    nb_total: int = 1

class LivreUpdate(BaseModel):
    titre: Optional[str] = None
    auteur: Optional[str] = None
    isbn: Optional[str] = None
    description: Optional[str] = None
    nb_total: Optional[int] = None
    nb_disponible: Optional[int] = None

class LivreOut(BaseModel):
    id: int
    titre: str
    auteur: str
    isbn: Optional[str]
    description: str
    nb_total: int
    nb_disponible: int
    

    class Config:
        from_attributes = True
