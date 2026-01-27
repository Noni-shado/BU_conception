from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Utilisateur
from app.schemas.utilisateur import UtilisateurCreate, UtilisateurLogin, UtilisateurOut

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UtilisateurOut)
def inscription(data: UtilisateurCreate, db: Session = Depends(get_db)):
    existe = db.query(Utilisateur).filter(Utilisateur.email == data.email).first()
    if existe:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")

    u = Utilisateur(
        email=data.email,
        mot_de_passe=Utilisateur.hacher_mdp(data.mot_de_passe),
        nom_complet=data.nom_complet,
        role=data.role,
        actif=True
    )
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

@router.post("/login")
def connexion(data: UtilisateurLogin, db: Session = Depends(get_db)):
    u = db.query(Utilisateur).filter(Utilisateur.email == data.email).first()
    if not u or not u.verifier_mdp(data.mot_de_passe):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    return {"ok": True, "id": u.id, "role": u.role, "email": u.email}
