# models/utilisateur.py

from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from passlib.context import CryptContext
from .base import Base

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    mot_de_passe: Mapped[str] = mapped_column(String(255), nullable=False)

    nom_complet: Mapped[str] = mapped_column(String(255), default="")
    role: Mapped[str] = mapped_column(String(30), default="UTILISATEUR")
    actif: Mapped[bool] = mapped_column(Boolean, default=True)

    @staticmethod
    def hacher_mdp(mdp: str) -> str:
        return pwd.hash(mdp)

    def verifier_mdp(self, mdp: str) -> bool:
        return pwd.verify(mdp, self.mot_de_passe)