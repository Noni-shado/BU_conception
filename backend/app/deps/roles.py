from fastapi import Header, HTTPException, status

def exiger_bibliothecaire(x_role: str | None = Header(default=None, alias="X-ROLE")):
    if x_role != "BIBLIOTHECAIRE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé au bibliothécaire"
        )
def exiger_utilisateur(x_role: str | None = Header(default=None, alias="X-ROLE")):
    if x_role != "UTILISATEUR":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé à l'utilisateur"
        )
