from app.database import supabase

def sign_up(email: str, password: str):
    try:
        res = supabase.auth.sign_up({"email": email, "password": password})
        return {"success": True, "user": res.user}
    except Exception as e:
        return {"success": False, "error": str(e)}

def sign_in(email: str, password: str):
    try:
        res = supabase.auth.sign_in_with_password({"email": email, "password": password})
        return {"success": True, "user": res.user, "session": res.session}
    except Exception as e:
        return {"success": False, "error": str(e)}

def sign_out(jwt: str):
    try:
        supabase.auth.sign_out()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}