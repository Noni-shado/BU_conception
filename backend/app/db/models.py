import enum
from datetime import datetime, date

from sqlalchemy import (
    String, Boolean, DateTime, Integer, ForeignKey, Text
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from passlib.context import CryptContext

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")


class Base(DeclarativeBase):
    pass


# -----------------------------
# UTILISATEUR (auth existante)
# -----------------------------
class Utilisateur(Base):
    __tablename__ = "utilisateurs"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    mot_de_passe: Mapped[str] = mapped_column(String(255), nullable=False)

    nom_complet: Mapped[str] = mapped_column(String(255), default="")
    role: Mapped[str] = mapped_column(String(30), default="UTILISATEUR")  # UTILISATEUR / BIBLIOTHECAIRE / ADMIN
    actif: Mapped[bool] = mapped_column(Boolean, default=True)

    @staticmethod
    def hacher_mdp(mdp: str) -> str:
        return pwd.hash(mdp)

    def verifier_mdp(self, mdp: str) -> bool:
        return pwd.verify(mdp, self.mot_de_passe)


# -----------------------------
# LIVRE
# -----------------------------
class Livre(Base):
    __tablename__ = "livres"

    id: Mapped[int] = mapped_column(primary_key=True)
    titre: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    auteur: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    isbn: Mapped[str | None] = mapped_column(String(32), unique=True, index=True, nullable=True)
    description: Mapped[str] = mapped_column(Text, default="")

    nb_total: Mapped[int] = mapped_column(Integer, default=1)
    nb_disponible: Mapped[int] = mapped_column(Integer, default=1)

    cree_le: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


# -----------------------------
# EMPRUNT
# -----------------------------
class StatutEmprunt(str, enum.Enum):
    EN_ATTENTE = "EN_ATTENTE"
    EMPRUNTE = "EMPRUNTE"
    RETOURNE = "RETOURNE"
    ANNULE = "ANNULE"


class Emprunt(Base):
    __tablename__ = "emprunts"

    id: Mapped[int] = mapped_column(primary_key=True)

    utilisateur_id: Mapped[int] = mapped_column(ForeignKey("utilisateurs.id"), nullable=False)
    livre_id: Mapped[int] = mapped_column(ForeignKey("livres.id"), nullable=False)

    statut: Mapped[str] = mapped_column(String(20), default=StatutEmprunt.EN_ATTENTE.value, index=True)

    demande_le: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    valide_le: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    date_retour_prevue: Mapped[date | None] = mapped_column(nullable=True)

    retourne_le: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    retour_valide_le: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    utilisateur = relationship("Utilisateur")
    livre = relationship("Livre")
