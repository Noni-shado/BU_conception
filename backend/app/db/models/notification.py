from datetime import datetime, timezone
from sqlalchemy import ForeignKey, Text, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .base import Base

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    utilisateur_id: Mapped[int] = mapped_column(ForeignKey("utilisateurs.id"), nullable=False)
    retour_id: Mapped[int | None] = mapped_column(ForeignKey("retours.id"), nullable=True)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    cree_le: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    utilisateur = relationship("Utilisateur")
    retour = relationship("Retour")