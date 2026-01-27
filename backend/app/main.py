from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.models import Base
from app.db.session import engine
from app.routers.auth import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BU Auth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)