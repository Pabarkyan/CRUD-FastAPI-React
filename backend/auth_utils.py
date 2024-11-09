from datetime import timedelta, timezone, datetime

from fastapi import HTTPException, status
from passlib.context import CryptContext
from jose import jwt
from sqlmodel import select

from config import REFRESH_TOKEN_EXPIRE_DAYS, ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from database.database import SessionDep
from models.modelUser import User


# encriptador del register para la contraseña
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") # esto no debe estar hardcoedado

# Funcion para crear y acceder al token jwt
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta # hora actual mas el tiempo pasado por parametro
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire}) # añadimos una clave al diccionario de valores
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

    return encoded_jwt # devolvemos el token


# funcion que crea un refresh token
def create_refresh_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta 
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS) # expira en 7 dias
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt

# verificar que la contraseña que introduce el usuario es la misma que la hasheada en la base de datos
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# obtenemos el usuario de la base de datos por el email, no podemos usar solo .get() porque el email no es una clave primaria
def get_user(session: SessionDep, email: str) -> User:
    condition = select(User).where(User.email == email)
    user = session.exec(condition).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return user


# autenticamos el usuario comprobando la contraseña y el email que introduce el usuario con su contraseña en la base de datos
def authenticate_user(session: SessionDep, email: str, password: str) -> User:
    user = get_user(session, email)
    if not verify_password(password, user.hashed_password):
        return False
    return user.email # mejor no devoler el user entero con la contraseña haseada
    # ya que solo vamos a usar el email para crear el token, una vez este todo autenticado claro

def get_password_hash(password): # hasear contraseña
    return pwd_context.hash(password)