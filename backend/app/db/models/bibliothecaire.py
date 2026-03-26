# models/bibliothecaire.py

import enum
from datetime import datetime, date
from sqlalchemy import String, DateTime, Integer, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from sqlalchemy import Boolean
from .base import Base
from .utilisateur import Utilisateur


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
    VALIDE = "VALIDE"
    REFUSE = "REFUSE"


class Emprunt(Base):
    __tablename__ = "emprunts"

    id: Mapped[int] = mapped_column(primary_key=True)

    utilisateur_id: Mapped[int] = mapped_column(ForeignKey("utilisateurs.id"), nullable=False)
    livre_id: Mapped[int] = mapped_column(ForeignKey("livres.id"), nullable=False)

    statut: Mapped[str] = mapped_column(
        String(20),
        default=StatutEmprunt.EN_ATTENTE.value,
        index=True
    )

    demande_le: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )
    valide_le: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )
    date_retour_prevue: Mapped[date | None] = mapped_column(nullable=True)

    motif_refus: Mapped[str | None] = mapped_column(Text, nullable=True)

    utilisateur = relationship("Utilisateur")
    livre = relationship("Livre")

# -----------------------------
# RETOUR
# -----------------------------
class StatutRetour(str, enum.Enum):
    EN_ATTENTE = "EN_ATTENTE"
    EN_RETARD = "EN_RETARD"
    RETOURNE = "RETOURNE"

class Retour(Base):
    __tablename__ = "retours"

    id: Mapped[int] = mapped_column(primary_key=True)

    emprunt_id: Mapped[int] = mapped_column(
        ForeignKey("emprunts.id"),
        nullable=False
    )

    utilisateur_id: Mapped[int] = mapped_column(
        ForeignKey("utilisateurs.id"),
        nullable=False
    )

    livre_id: Mapped[int] = mapped_column(
        ForeignKey("livres.id"),
        nullable=False
    )

    date_retour_prevue: Mapped[date] = mapped_column(nullable=False)

    retourne_le: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    statut: Mapped[str] = mapped_column(
        String(20),
        default=StatutRetour.EN_ATTENTE.value,
        index=True
    )

    cree_le: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # relations
    utilisateur = relationship("Utilisateur")
    livre = relationship("Livre")
    emprunt = relationship("Emprunt")



# -----------------------------
# NOTIF
# -----------------------------

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True)

    utilisateur_id: Mapped[int] = mapped_column(
        ForeignKey("utilisateurs.id"),
        nullable=False
    )

    retour_id: Mapped[int] = mapped_column(
        ForeignKey("retours.id"),
        nullable=True
    )

    message: Mapped[str] = mapped_column(Text, nullable=False)

    cree_le: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    utilisateur = relationship("Utilisateur")
    retour = relationship("Retour")