# Como ejecutamos tests?:
# 1: pytest tests/ test global
# 2: pytest tests/test_auth.py test especifico
# 3. pytest tests/test_auth.py::test_function_name para un test de una sola funcion
# Para ver un informe de cobertura: pytest --cov=app testing/

import pytest

from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database.database import get_session
from main import app
from models.modelUser import User, UserCreate


@pytest.fixture(name='session')
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")  
def client_fixture(session: Session):  
    def get_session_override():  
        return session

    app.dependency_overrides[get_session] = get_session_override  

    client = TestClient(app)  
    yield client  
    app.dependency_overrides.clear() 


# Creamos los tests

# test de register
def test_create_user(client: TestClient): # tienen que tener el mismo nombre que las fixtures
    response = client.post(
        "user/register", json={
            "username": "Pablo_test",
            "email": "test@gmail.com",
            "password": "123456test"
        }
    )

    app.dependency_overrides.clear()
    data = response.json()

    assert response.status_code == 200
    assert data['username'] == "Pablo_test"
    assert data['email'] == "test@gmail.com"
    assert data["is_super_user"] == 0
    assert data["is_active"] == 1


# Prueba para obtener el token de acceso mediante login
# Variable global para almacenar el refresh_token obtenido en la prueba de login
refresh_token = None

# Prueba para obtener el token de acceso mediante login y almacenar el refresh_token
def test_login_user(client: TestClient):
    # Registrar al usuario
    client.post(
        "/user/register",
        json={
            "username": "Pablo_test",
            "email": "test@gmail.com",
            "password": "123456test"
        }
    )

    # Solicitar el token de acceso
    response = client.post(
        "/user/token",
        data={"username": "test@gmail.com", "password": "123456test"}
    )
    data = response.json()
    assert response.status_code == 200
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"

    # Guardamos el refresh_token para usarlo en otras pruebas
    global refresh_token
    refresh_token = data["refresh_token"]


# Prueba para refrescar el token de acceso
def test_refresh_token(client: TestClient):
    # Llama primero a test_login_user para asegurarnos de que el refresh_token está configurado
    test_login_user(client)
    assert refresh_token is not None, "El refresh_token no se obtuvo correctamente."

    # Solicitar un nuevo token de acceso usando el refresh_token
    response = client.post(
        "/user/token/refresh",
        json={"refresh_token": refresh_token}  # Usamos el refresh_token guardado
    )
    data = response.json()
    assert response.status_code == 200
    assert "access_token" in data
    assert data["token_type"] == "bearer"



# Prueba de error para login con credenciales incorrectas
def test_login_user_invalid_credentials(client: TestClient):
    # Intentar iniciar sesión con credenciales incorrectas
    response = client.post(
        "user/token",
        data={"username": "wronguser@gmail.com", "password": "wrongpassword"}
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "User not found"} # esto debe coincidir con el mensaje de error de su status.code


# Prueba de error para refresh token inválido
def test_refresh_token_invalid(client: TestClient):
    # Intentar refrescar el token con un refresh_token inválido
    response = client.post(
        "user/token/refresh",
        json={"refresh_token": "invalid_refresh_token"}
    )
    assert response.status_code == 401
    assert response.json() == {"detail": "Invalid refresh token"}