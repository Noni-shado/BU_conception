from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.db.models import Livre, Emprunt, StatutEmprunt
from app.schemas.livre import LivreCreate, LivreUpdate, LivreOut
from app.schemas.emprunt import EmpruntOut, ValiderEmpruntIn
from app.deps.roles import exiger_bibliothecaire

router = APIRouter(prefix="/bibliothecaire", tags=["bibliothecaire"])


# -----------------------
# LIVRES
# -----------------------
@router.get("/livres", response_model=list[LivreOut], dependencies=[Depends(exiger_bibliothecaire)])
def lister_livres(q: str | None = Query(default=None), db: Session = Depends(get_db)):
    requete = db.query(Livre)
    if q:
        like = f"%{q}%"
        requete = requete.filter(
            (Livre.titre.ilike(like)) | (Livre.auteur.ilike(like)) | (Livre.isbn.ilike(like))
        )
    return requete.order_by(Livre.id.desc()).all()


@router.get("/livres/{livre_id}", response_model=LivreOut, dependencies=[Depends(exiger_bibliothecaire)])
def obtenir_livre(livre_id: int, db: Session = Depends(get_db)):
    livre = db.query(Livre).get(livre_id)
    if not livre:
        raise HTTPException(404, "Livre introuvable")
    return livre


@router.post("/livres", response_model=LivreOut, dependencies=[Depends(exiger_bibliothecaire)])
def creer_livre(data: LivreCreate, db: Session = Depends(get_db)):
    livre = Livre(
        titre=data.titre,
        auteur=data.auteur,
        isbn=data.isbn,
        description=data.description,
        nb_total=data.nb_total,
        nb_disponible=data.nb_total,
    )
    db.add(livre)
    db.commit()
    db.refresh(livre)
    return livre


@router.put("/livres/{livre_id}", response_model=LivreOut, dependencies=[Depends(exiger_bibliothecaire)])
def modifier_livre(livre_id: int, data: LivreUpdate, db: Session = Depends(get_db)):
    livre = db.query(Livre).get(livre_id)
    if not livre:
        raise HTTPException(404, "Livre introuvable")

    champs = data.model_dump(exclude_unset=True)
    for cle, valeur in champs.items():
        setattr(livre, cle, valeur)

    # sécurité : nb_total ne doit pas être < nb_disponible
    if livre.nb_total < livre.nb_disponible:
        livre.nb_disponible = livre.nb_total

    db.commit()
    db.refresh(livre)
    return livre


@router.delete("/livres/{livre_id}", dependencies=[Depends(exiger_bibliothecaire)])
def supprimer_livre(livre_id: int, db: Session = Depends(get_db)):
    livre = db.query(Livre).get(livre_id)
    if not livre:
        raise HTTPException(404, "Livre introuvable")
    db.delete(livre)
    db.commit()
    return {"ok": True}


# -----------------------
# EMPRUNTS
# -----------------------
@router.get("/emprunts", response_model=list[EmpruntOut], dependencies=[Depends(exiger_bibliothecaire)])
def lister_emprunts(db: Session = Depends(get_db)):
    return db.query(Emprunt).order_by(Emprunt.id.desc()).all()


@router.post("/emprunts/{emprunt_id}/valider", response_model=EmpruntOut, dependencies=[Depends(exiger_bibliothecaire)])
def valider_emprunt(emprunt_id: int, data: ValiderEmpruntIn, db: Session = Depends(get_db)):
    emprunt = db.query(Emprunt).get(emprunt_id)
    if not emprunt:
        raise HTTPException(404, "Emprunt introuvable")

    if emprunt.statut != StatutEmprunt.EN_ATTENTE.value:
        raise HTTPException(400, "Cet emprunt n'est pas en attente")

    livre = db.query(Livre).get(emprunt.livre_id)
    if not livre:
        raise HTTPException(404, "Livre introuvable")

    if livre.nb_disponible <= 0:
        raise HTTPException(400, "Aucun exemplaire disponible")

    livre.nb_disponible -= 1
    emprunt.statut = StatutEmprunt.EMPRUNTE.value
    emprunt.valide_le = datetime.now(timezone.utc)
    emprunt.date_retour_prevue = data.date_retour_prevue

    db.commit()
    db.refresh(emprunt)
    return emprunt


# -----------------------
# RETOURS
# -----------------------
@router.get("/retours", response_model=list[EmpruntOut], dependencies=[Depends(exiger_bibliothecaire)])
def lister_retours(db: Session = Depends(get_db)):
    # Retours = emprunts avec retourne_le renseigné
    return db.query(Emprunt).filter(Emprunt.retourne_le.isnot(None)).order_by(Emprunt.id.desc()).all()


@router.post("/retours/{emprunt_id}/valider", response_model=EmpruntOut, dependencies=[Depends(exiger_bibliothecaire)])
def valider_retour(emprunt_id: int, db: Session = Depends(get_db)):
    emprunt = db.query(Emprunt).get(emprunt_id)
    if not emprunt:
        raise HTTPException(404, "Emprunt introuvable")

    if not emprunt.retourne_le:
        raise HTTPException(400, "Ce prêt n'a pas encore été marqué comme retourné")

    if emprunt.statut == StatutEmprunt.RETOURNE.value:
        return emprunt

    livre = db.query(Livre).get(emprunt.livre_id)
    if livre:
        livre.nb_disponible += 1

    emprunt.statut = StatutEmprunt.RETOURNE.value
    emprunt.retour_valide_le = datetime.now(timezone.utc)

    db.commit()
    db.refresh(emprunt)
    return emprunt
