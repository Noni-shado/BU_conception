from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.db.models import (
    Utilisateur,
    Livre,
    Emprunt,
    StatutEmprunt,
    Retour,
    StatutRetour,
    Notification,
)
from app.schemas.commun import PaginatedResponse
from app.schemas.livre import LivreCreate, LivreUpdate, LivreOut
from app.schemas.emprunt import EmpruntOut, RefuserEmpruntIn
from app.schemas.retour import RetourOut
from app.deps.roles import exiger_bibliothecaire

router = APIRouter(prefix="/bibliothecaire", tags=["bibliothecaire"])


# -----------------------
# LIVRES
# -----------------------
@router.get(
    "/livres",
    response_model=PaginatedResponse[LivreOut],
    dependencies=[Depends(exiger_bibliothecaire)],
)
def lister_livres(
    q: str | None = Query(default=None),
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    db: Session = Depends(get_db),
):
    requete = db.query(Livre)

    if q:
        like = f"%{q}%"
        requete = requete.filter(
            (Livre.titre.ilike(like)) |
            (Livre.auteur.ilike(like)) |
            (Livre.isbn.ilike(like))
        )

    requete = requete.order_by(Livre.id.desc())

    total = requete.count()
    items = requete.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get(
    "/livres/{livre_id}",
    response_model=LivreOut,
    dependencies=[Depends(exiger_bibliothecaire)],
)
def obtenir_livre(livre_id: int, db: Session = Depends(get_db)):
    livre = db.query(Livre).get(livre_id)
    if not livre:
        raise HTTPException(404, "Livre introuvable")
    return livre


@router.post(
    "/livres",
    response_model=LivreOut,
    dependencies=[Depends(exiger_bibliothecaire)],
)
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


@router.put(
    "/livres/{livre_id}",
    response_model=LivreOut,
    dependencies=[Depends(exiger_bibliothecaire)],
)
def modifier_livre(livre_id: int, data: LivreUpdate, db: Session = Depends(get_db)):
    livre = db.query(Livre).get(livre_id)
    if not livre:
        raise HTTPException(404, "Livre introuvable")

    champs = data.model_dump(exclude_unset=True)
    for cle, valeur in champs.items():
        setattr(livre, cle, valeur)

    if livre.nb_total < livre.nb_disponible:
        livre.nb_disponible = livre.nb_total

    db.commit()
    db.refresh(livre)
    return livre


@router.delete(
    "/livres/{livre_id}",
    dependencies=[Depends(exiger_bibliothecaire)],
)
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
@router.get(
    "/emprunts",
    response_model=PaginatedResponse[EmpruntOut],
    dependencies=[Depends(exiger_bibliothecaire)],
)
def lister_emprunts(
    q: str | None = Query(default=None),
    statut: str | None = Query(default=None),
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Emprunt)
        .join(Emprunt.utilisateur)
        .options(
            joinedload(Emprunt.utilisateur),
            joinedload(Emprunt.livre),
        )
        .order_by(Emprunt.id.desc())
    )

    # 🔍 recherche par email utilisateur
    if q:
        like = f"%{q}%"
        query = query.filter(Utilisateur.email.ilike(like))

    # 🎯 filtre par statut
    if statut:
        query = query.filter(Emprunt.statut == statut)

    total = query.count()

    items = (
        query
        .offset((page - 1) * page_size)
        .limit(page_size)
        .all()
    )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.post(
    "/emprunts/{emprunt_id}/valider",
    response_model=EmpruntOut,
    dependencies=[Depends(exiger_bibliothecaire)],
)
def valider_emprunt(emprunt_id: int, db: Session = Depends(get_db)):
    emprunt = (
        db.query(Emprunt)
        .options(
            joinedload(Emprunt.utilisateur),
            joinedload(Emprunt.livre),
        )
        .get(emprunt_id)
    )

    if not emprunt:
        raise HTTPException(404, "Emprunt introuvable")

    if emprunt.statut != StatutEmprunt.EN_ATTENTE.value:
        raise HTTPException(400, "Cet emprunt n'est pas en attente")

    livre = db.query(Livre).get(emprunt.livre_id)
    if not livre:
        raise HTTPException(404, "Livre introuvable")

    if livre.nb_disponible <= 0:
        raise HTTPException(400, "Aucun exemplaire disponible")

    # 📚 mise à jour stock
    livre.nb_disponible -= 1

    # 📌 validation emprunt
    emprunt.statut = StatutEmprunt.VALIDE.value
    emprunt.valide_le = datetime.now(timezone.utc)

    demande_reference = emprunt.demande_le or datetime.now(timezone.utc)
    emprunt.date_retour_prevue = (demande_reference + timedelta(days=15)).date()

    # CRÉATION DU RETOUR
    retour = Retour(
        emprunt_id=emprunt.id,
        utilisateur_id=emprunt.utilisateur_id,
        livre_id=emprunt.livre_id,
        date_retour_prevue=emprunt.date_retour_prevue,
        statut=StatutRetour.EN_ATTENTE.value,  # optionnel
    )

    db.add(retour)

    db.commit()
    db.refresh(emprunt)

    return emprunt


@router.post(
    "/emprunts/{emprunt_id}/decliner",
    response_model=EmpruntOut,
    dependencies=[Depends(exiger_bibliothecaire)],
)
def decliner_emprunt(
    emprunt_id: int,
    data: RefuserEmpruntIn,
    db: Session = Depends(get_db),
):
    emprunt = (
        db.query(Emprunt)
        .options(
            joinedload(Emprunt.utilisateur),
            joinedload(Emprunt.livre),
        )
        .get(emprunt_id)
    )

    if not emprunt:
        raise HTTPException(404, "Emprunt introuvable")

    if emprunt.statut != StatutEmprunt.EN_ATTENTE.value:
        raise HTTPException(400, "Cet emprunt n'est pas en attente")

    emprunt.statut = StatutEmprunt.REFUSE.value
    emprunt.motif_refus = data.motif_refus.strip()

    db.commit()
    db.refresh(emprunt)
    return emprunt


# -----------------------
# RETOURS
# -----------------------
@router.get(
    "/retours",
    response_model=PaginatedResponse[RetourOut],
    dependencies=[Depends(exiger_bibliothecaire)],
)
def lister_retours(
    q: str | None = Query(default=None),
    statut: str | None = Query(default=None),
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Retour)
        .join(Retour.utilisateur)
        .options(
            joinedload(Retour.utilisateur),
            joinedload(Retour.livre),
        )
        .order_by(Retour.id.desc())
    )

    if q:
        like = f"%{q}%"
        query = query.filter(Utilisateur.email.ilike(like))

    retours = query.all()
    today = datetime.now(timezone.utc).date()

    items_filtres = []

    for retour in retours:
        if retour.retourne_le:
            if retour.retourne_le.date() > retour.date_retour_prevue:
                retour.statut = StatutRetour.EN_RETARD.value
            else:
                retour.statut = StatutRetour.RETOURNE.value
        else:
            if today > retour.date_retour_prevue:
                retour.statut = StatutRetour.EN_RETARD.value
            else:
                retour.statut = StatutRetour.EN_ATTENTE.value

        if statut and retour.statut != statut:
            continue

        items_filtres.append(retour)

    total = len(items_filtres)
    start = (page - 1) * page_size
    end = start + page_size
    items = items_filtres[start:end]

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get(
    "/retours/{retour_id}",
    response_model=RetourOut,
    dependencies=[Depends(exiger_bibliothecaire)],
)
def obtenir_retour(retour_id: int, db: Session = Depends(get_db)):
    retour = (
        db.query(Retour)
        .options(
            joinedload(Retour.utilisateur),
            joinedload(Retour.livre),
        )
        .get(retour_id)
    )

    if not retour:
        raise HTTPException(404, "Retour introuvable")

    today = datetime.now(timezone.utc).date()

    if retour.retourne_le:
        if retour.retourne_le.date() > retour.date_retour_prevue:
            retour.statut = StatutRetour.EN_RETARD.value
        else:
            retour.statut = StatutRetour.RETOURNE.value
    else:
        if today > retour.date_retour_prevue:
            retour.statut = StatutRetour.EN_RETARD.value
        else:
            retour.statut = StatutRetour.EN_ATTENTE.value

    return retour


@router.post(
    "/retours/{retour_id}/valider",
    response_model=RetourOut,
    dependencies=[Depends(exiger_bibliothecaire)],
)
def valider_retour(retour_id: int, db: Session = Depends(get_db)):
    retour = (
        db.query(Retour)
        .options(
            joinedload(Retour.utilisateur),
            joinedload(Retour.livre),
        )
        .get(retour_id)
    )

    if not retour:
        raise HTTPException(404, "Retour introuvable")

    if retour.retourne_le:
        return retour

    retour.retourne_le = datetime.now(timezone.utc)

    livre = db.query(Livre).get(retour.livre_id)
    if livre:
        livre.nb_disponible += 1

    db.commit()
    db.refresh(retour)
    return retour


@router.post(
    "/retours/{retour_id}/notifier",
    dependencies=[Depends(exiger_bibliothecaire)],
)
def notifier_retard(retour_id: int, db: Session = Depends(get_db)):
    retour = (
        db.query(Retour)
        .options(
            joinedload(Retour.livre),
            joinedload(Retour.utilisateur),
        )
        .get(retour_id)
    )

    if not retour:
        raise HTTPException(404, "Retour introuvable")

    today = datetime.now(timezone.utc).date()

    is_retard = (
        retour.retourne_le is not None and
        retour.retourne_le.date() > retour.date_retour_prevue
    ) or (
        retour.retourne_le is None and
        today > retour.date_retour_prevue
    )

    if not is_retard:
        raise HTTPException(400, "Ce retour n'est pas en retard")

    message = (
        f"Vous êtes en retard pour le livre '{retour.livre.titre}'. "
        f"Merci de le retourner dès que possible."
    )

    notif = Notification(
        utilisateur_id=retour.utilisateur_id,
        retour_id=retour.id,
        message=message,
    )

    db.add(notif)
    db.commit()

    return {"message": "Notification envoyée avec succès"}