from fastapi import Header, HTTPException, status

def exiger_bibliothecaire(x_role: str | None = Header(default=None, alias="X-ROLE")):
    if x_role != "BIBLIOTHECAIRE":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Accès réservé au bibliothécaire"
        )
