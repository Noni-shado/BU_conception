from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.models import User

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register")
def register(email: str, password: str, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == email).first():
        raise HTTPException(400, "Email exists")
    u = User(email=email, password=User.hash(password))
    db.add(u)
    db.commit()
    return {"ok": True}

@router.post("/login")
def login(email: str, password: str, db: Session = Depends(get_db)):
    u = db.query(User).filter(User.email == email).first()
    if not u or not u.verify(password):
        raise HTTPException(401, "Invalid credentials")
    return {"message": "login ok (JWT next step)"}