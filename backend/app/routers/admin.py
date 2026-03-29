from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Utilisateur
from app.schemas.utilisateur import (
    CompteCreate,
    CompteUpdate,
    CompteOut,
)
from app.schemas.commun import PaginatedResponse
from app.deps.roles import exiger_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get(
    "/comptes",
    response_model=PaginatedResponse[CompteOut],
    dependencies=[Depends(exiger_admin)],
)
def lister_comptes(
    q: str | None = Query(default=None),
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Utilisateur).order_by(Utilisateur.id.desc())

    if q:
        like = f"%{q}%"
        query = query.filter(Utilisateur.email.ilike(like))

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post(
    "/comptes",
    response_model=CompteOut,
    dependencies=[Depends(exiger_admin)],
)
def ajouter_compte(data: CompteCreate, db: Session = Depends(get_db)):
    existing = db.query(Utilisateur).filter_by(email=data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")


    user = Utilisateur(
    nom_complet=data.nom_complet,
    email=data.email,
    mot_de_passe=Utilisateur.hacher_mdp(data.mot_de_passe),
    role=data.role,
    actif=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.put(
    "/comptes/{id}",
    response_model=CompteOut,
    dependencies=[Depends(exiger_admin)],
)
def modifier_compte(id: int, data: CompteUpdate, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Compte non trouvé")

    if data.nom_complet is not None:
        user.nom_complet = data.nom_complet

    if data.email is not None:
        user.email = data.email

    if data.role is not None:
        user.role = data.role

    db.commit()
    db.refresh(user)

    return user


@router.delete(
    "/comptes/{id}",
    dependencies=[Depends(exiger_admin)],
)
def supprimer_compte(id: int, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Compte non trouvé")

    db.delete(user)
    db.commit()

    return {"message": "Compte supprimé"}


@router.post(
    "/comptes/{id}/bloquer",
    dependencies=[Depends(exiger_admin)],
)
def bloquer_compte(id: int, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Compte non trouvé")

    user.actif = False
    db.commit()

    return {"message": "Compte bloqué"}


@router.post(
    "/comptes/{id}/debloquer",
    dependencies=[Depends(exiger_admin)],
)
def debloquer_compte(id: int, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Compte non trouvé")

    user.actif = True
    db.commit()

    return {"message": "Compte débloqué"}


@router.get(
    "/comptes/{id}",
    response_model=CompteOut,
    dependencies=[Depends(exiger_admin)],
)
def details_compte(id: int, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == id).first()

    if not user:
        raise HTTPException(status_code=404, detail="Compte non trouvé")

    return user