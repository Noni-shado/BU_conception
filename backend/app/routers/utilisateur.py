from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session, joinedload

from app.db.session import get_db
from app.db.models import Livre, Emprunt, StatutEmprunt, Notification
from app.schemas.utilisateur import LivreUserOut
from app.schemas.commun import PaginatedResponse
from app.schemas.livre import LivreOut
from app.schemas.emprunt import EmpruntOut
from app.schemas.notification import NotificationOut
from app.deps.roles import exiger_utilisateur

router = APIRouter(prefix="/utilisateur", tags=["utilisateur"])


# -----------------------
# 🔐 sécurité utilisateur
# -----------------------
def get_utilisateur_id(
    x_user_id: int | None = Header(default=None, alias="X-USER-ID")
):
    if x_user_id is None:
        raise HTTPException(status_code=400, detail="Utilisateur non identifié")
    return x_user_id


# -----------------------
# 📚 LIVRES
# -----------------------
@router.get(
    "/livres",
    response_model=PaginatedResponse[LivreUserOut],
    dependencies=[Depends(exiger_utilisateur)],
)
def lister_livres(
    q: str | None = Query(default=None),
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    utilisateur_id: int = Depends(get_utilisateur_id),
    db: Session = Depends(get_db),
):
    requete = db.query(Livre)

    if q:
        like = f"%{q}%"
        requete = requete.filter(
            (Livre.titre.ilike(like))
            | (Livre.auteur.ilike(like))
            | (Livre.isbn.ilike(like))
        )

    requete = requete.order_by(Livre.id.desc())

    total = requete.count()
    livres = requete.offset((page - 1) * page_size).limit(page_size).all()

    items = []
    for livre in livres:
        emprunt = (
            db.query(Emprunt)
            .filter(
                Emprunt.utilisateur_id == utilisateur_id,
                Emprunt.livre_id == livre.id,
                Emprunt.statut.in_(
                    [
                        StatutEmprunt.EN_ATTENTE.value,
                        StatutEmprunt.VALIDE.value,
                    ]
                ),
            )
            .order_by(Emprunt.id.desc())
            .first()
        )

        items.append(
            {
                "id": livre.id,
                "titre": livre.titre,
                "auteur": livre.auteur,
                "isbn": livre.isbn,
                "description": livre.description,
                "nb_total": livre.nb_total,
                "nb_disponible": livre.nb_disponible,
                "statut_emprunt_utilisateur": emprunt.statut if emprunt else None,
            }
        )

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get(
    "/livres/{livre_id}",
    response_model=LivreOut,
    dependencies=[Depends(exiger_utilisateur)],
)
def obtenir_livre(
    livre_id: int,
    db: Session = Depends(get_db),
):
    livre = db.get(Livre, livre_id)
    if not livre:
        raise HTTPException(status_code=404, detail="Livre introuvable")
    return livre


# -----------------------
# 📖 DEMANDER EMPRUNT
# -----------------------
@router.post(
    "/emprunts/{livre_id}",
    response_model=EmpruntOut,
    dependencies=[Depends(exiger_utilisateur)],
)
def demander_emprunt(
    livre_id: int,
    db: Session = Depends(get_db),
    utilisateur_id: int = Depends(get_utilisateur_id),
):
    livre = db.get(Livre, livre_id)
    if not livre:
        raise HTTPException(status_code=404, detail="Livre introuvable")

    emprunt_existant = (
        db.query(Emprunt)
        .filter(
            Emprunt.utilisateur_id == utilisateur_id,
            Emprunt.livre_id == livre_id,
            Emprunt.statut.in_(
                [
                    StatutEmprunt.EN_ATTENTE.value,
                    StatutEmprunt.VALIDE.value,
                ]
            ),
        )
        .first()
    )

    if emprunt_existant:
        raise HTTPException(
            status_code=400,
            detail="Vous avez déjà une demande en attente ou un emprunt validé pour ce livre",
        )

    maintenant = datetime.now(timezone.utc)

    nouvel_emprunt = Emprunt(
        utilisateur_id=utilisateur_id,
        livre_id=livre_id,
        statut=StatutEmprunt.EN_ATTENTE.value,
        demande_le=maintenant,
        date_retour_prevue=(maintenant + timedelta(days=15)).date(),
        motif_refus=None,
    )

    db.add(nouvel_emprunt)
    db.commit()
    db.refresh(nouvel_emprunt)

    emprunt = (
        db.query(Emprunt)
        .options(
            joinedload(Emprunt.utilisateur),
            joinedload(Emprunt.livre),
        )
        .filter(Emprunt.id == nouvel_emprunt.id)
        .first()
    )

    return emprunt


# -----------------------
# 📚 EMPRUNTS UTILISATEUR
# -----------------------
@router.get(
    "/emprunts",
    response_model=PaginatedResponse[EmpruntOut],
    dependencies=[Depends(exiger_utilisateur)],
)
def lister_mes_emprunts(
    q: str | None = Query(default=None),
    statut: str | None = Query(default=None),
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    utilisateur_id: int = Depends(get_utilisateur_id),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Emprunt)
        .options(
            joinedload(Emprunt.utilisateur),
            joinedload(Emprunt.livre),
        )
        .filter(Emprunt.utilisateur_id == utilisateur_id)
        .order_by(Emprunt.id.desc())
    )

    if q:
        like = f"%{q}%"
        query = query.join(Emprunt.livre).filter(
            (Livre.titre.ilike(like))
            | (Livre.auteur.ilike(like))
            | (Livre.isbn.ilike(like))
        )

    if statut:
        query = query.filter(Emprunt.statut == statut)

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get(
    "/emprunts/{emprunt_id}",
    response_model=EmpruntOut,
    dependencies=[Depends(exiger_utilisateur)],
)
def obtenir_mon_emprunt(
    emprunt_id: int,
    db: Session = Depends(get_db),
    utilisateur_id: int = Depends(get_utilisateur_id),
):
    emprunt = (
        db.query(Emprunt)
        .options(
            joinedload(Emprunt.utilisateur),
            joinedload(Emprunt.livre),
        )
        .filter(
            Emprunt.id == emprunt_id,
            Emprunt.utilisateur_id == utilisateur_id,
        )
        .first()
    )

    if not emprunt:
        raise HTTPException(status_code=404, detail="Emprunt introuvable")

    return emprunt


# -----------------------
# 🔔 NOTIFICATIONS UTILISATEUR
# -----------------------
@router.get(
    "/notifications",
    response_model=PaginatedResponse[NotificationOut],
    dependencies=[Depends(exiger_utilisateur)],
)
def lister_mes_notifications(
    page: int = Query(1, ge=1),
    page_size: int = Query(5, ge=1, le=100),
    utilisateur_id: int = Depends(get_utilisateur_id),
    db: Session = Depends(get_db),
):
    query = (
        db.query(Notification)
        .filter(Notification.utilisateur_id == utilisateur_id)
        .order_by(Notification.id.desc())
    )

    total = query.count()
    items = query.offset((page - 1) * page_size).limit(page_size).all()

    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
    }


@router.get(
    "/notifications/{notification_id}",
    response_model=NotificationOut,
    dependencies=[Depends(exiger_utilisateur)],
)
def obtenir_ma_notification(
    notification_id: int,
    utilisateur_id: int = Depends(get_utilisateur_id),
    db: Session = Depends(get_db),
):
    notification = (
        db.query(Notification)
        .filter(
            Notification.id == notification_id,
            Notification.utilisateur_id == utilisateur_id,
        )
        .first()
    )

    if not notification:
        raise HTTPException(status_code=404, detail="Notification introuvable")

    return notification