from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt, JWTError

from datetime import timedelta
from typing import Annotated

from config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, SECRET_KEY
from auth_utils import authenticate_user, create_access_token, create_refresh_token, get_password_hash
from database.database import SessionDep
from models.modelUser import User, UserCreate
from models.modelAuth import RefreshTokenRequest

# el nombre correcto para este archivo seria auth auntes que users, users podria utilizarse para opciones de configuracion
# del usuario, como cambio de nombre, foto de perfil (si la hay), etc...


router = APIRouter(
    prefix="/user",
    tags=["user"],
    responses={404: {"description": "user not found"}}
)


@router.post("/register")
def register_user(user: UserCreate, session: SessionDep):
    
    # Crear el usuario en la base de datos
    hashed_password = get_password_hash(user.password)
    userdb = User( # no ponemos isactive ni issuperuser porque tienen valor por defecto
        username=user.username,
        email=user.email,
        hashed_password=hashed_password)

    session.add(userdb)
    session.commit()
    session.refresh(userdb)

    # Generar tokens después de crear el usuario
    access_token = create_access_token(data={"sub": userdb.email})
    refresh_token = create_refresh_token(data={"sub": userdb.email})

    # Retornar el token de acceso y el refresh token
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# Creamos una funcion de login
@router.post("/token")
async def login(session: SessionDep, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    email = authenticate_user(session, form_data.username, form_data.password) # aunque ponga username, podemos poner lo que queramos
    # en nuestro caso hemosp puesto el correo, ya que .username es solo, por asi decir, la clave del formulario, lo mismo con password
    # pero se le tiene que enviar como form obligatoriamente
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"} # Informa al cliente que necesita proporcionar un Bearer Token (access token) para autenticar la solicitud.
        )
    
    access_token = create_access_token(data={"sub": email}) # comprobar esto de "sub"
    # usamos el email para crear el token
    refresh_token = create_refresh_token(data={"sub": email}) # aunque parezca que crea el mismo 

    return {"access_token": access_token, 
            "refresh_token": refresh_token,
            "token_type": "bearer"} # es necesario el token_type?  => es una buena practica
    

@router.post("/token/refresh")
async def refresh_token(request: RefreshTokenRequest): # enviamos el token como un body json
    try:
        # decodificamos el refresh token
        refresh_token = request.refresh_token
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")

        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid refresh token"
            )
        
        # Aquí puedes agregar lógica para verificar si el refresh token es válido, 
        # por ejemplo, buscando al usuario en la base de datos.
        
        # Generar un nuevo access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        new_access_token = create_access_token(
            data={"sub": email}, expires_delta=access_token_expires
        )

        return {
            "access_token": new_access_token,
            "refresh_token": refresh_token, # pasamos el mismo token?? Mirar abajo
            "token_type": "bearer"
            }
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
"""
    El hecho de pasar otra vez el mismo refresh token es cuestion de seguridad y eleccion, existen varios enfoques
    - 1. Mantener el mismo refresh token (Enfoque comun): utilizar el mismo refresh token todo
        el rato hasta que expire o sea renovado en el login
    - 2. Rotacion de refresh tokens (Enfoque mas seguro): consiste en que cada vez que el usuario utiliza el refresh
        token para generar un nuevo token de acceso se crea otro refresh token y el cliente debe almacenar este nuevo token

    Si el refresh token expira o reutiliza uno invalido (en caso de usar rotacion de tokens), el backend obligara al usuario 
    a logearse de nuevo

    la renovacion del access token y la ejecucion del path ("/token/refresh") sera ejecutado por el frontend o cliente, es decir
    el frontend debera guardar el access y el refresh token con sus respectivos tiempos de expiracion en alguna parte y es este el
    que se encarga de calcular cuando expiran ambos token y ejecutar las peticiones al backend pertinentes
"""



# error handling de toda la app 
# evitar que el codigo este hardcoedado (paths y mensajes de error mayoritariamente)
# migrar a sql  