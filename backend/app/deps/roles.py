from fastapi import Request, HTTPException, Depends


def get_current_user(request: Request):
    role = request.headers.get("x-role") or request.headers.get("X-ROLE")

    if not role:
        raise HTTPException(401, "Non authentifié")

    return {"role": role}


def exiger_admin(user=Depends(get_current_user)):
    if user["role"] != "ADMIN":   # ✅ correction ici
        raise HTTPException(403, "Accès réservé aux admins")
    return user


def exiger_bibliothecaire(user=Depends(get_current_user)):
    if user["role"] != "BIBLIOTHECAIRE":
        raise HTTPException(403, "Accès refusé")
    return user


def exiger_utilisateur(user=Depends(get_current_user)):
    if user["role"] != "UTILISATEUR":
        raise HTTPException(403, "Accès refusé")
    return user