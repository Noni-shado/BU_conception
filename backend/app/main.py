from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.models.bibliothecaire import Base
from app.db.session import engine
from app.routers.auth import router as auth_router
from app.routers.bibliothecaire import router as router_bibliothecaire
from app.routers.utilisateur import router as utilisateur_router
from app.routers.admin import router as admin_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="BU Auth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(router_bibliothecaire)
app.include_router(utilisateur_router)
app.include_router(admin_router)
