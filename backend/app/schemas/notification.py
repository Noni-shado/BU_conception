from datetime import datetime
from pydantic import BaseModel

class NotificationOut(BaseModel):
    id: int
    utilisateur_id: int
    retour_id: int | None = None
    message: str
    cree_le: datetime

    model_config = {"from_attributes": True}