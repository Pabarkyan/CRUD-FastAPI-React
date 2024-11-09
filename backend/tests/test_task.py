import pytest
from datetime import datetime

from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool

from database.database import get_session
from main import app
from models.modelsTask import Task, TaskPublic

@pytest.fixture(name="session")
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


# Tests ----

def test_create_task(client: TestClient): # cada funcion debe empezar por test_
    # Registrar usuario y obtener el token
    client.post("/user/register", json={"username": "testuser", "email": "testuser@example.com", "password": "testpass"})
    login_response = client.post("/user/token", data={"username": "testuser@example.com", "password": "testpass"})
    access_token = login_response.json()["access_token"]
    
    response = client.post(
        "task/", json={
            "title": "Sparring",
            "deadline": "2024-10-25T15:30:00",
            "completed": False,
            "subject": "Muay Thai"
        },
        headers={"Authorization": f"Bearer {access_token}"}
    )
    data = response.json()

    assert response.status_code == 200
    assert data["title"] == "Sparring"
    assert data["deadline"] == "2024-10-25T15:30:00"
    assert data["completed"] == False
    assert data["subject"] == "Muay Thai"


def test_read_tasks(client: TestClient, session: Session):  
    # Registrar usuario y obtener el token
    client.post("/user/register", json={"username": "testuser", "email": "testuser@example.com", "password": "testpass"})
    login_response = client.post("/user/token", data={"username": "testuser@example.com", "password": "testpass"})
    access_token = login_response.json()["access_token"]
    
    deadline = datetime.fromisoformat("2024-10-25T15:30:00")

    task_1 = Task(id=1, user_id=1, subject="Muay Thai", title="sparring", deadline=deadline, completed=True)
    task_2 = Task(id=2, user_id=1, subject="Muay Thai", title="sparring", deadline=deadline, completed=False)
    session.add(task_1)
    session.add(task_2)
    session.commit()

    response = client.get(
        "/task/",
        headers={"Authorization": f"Bearer {access_token}"}
        )
    data = response.json()

    assert response.status_code == 200

    assert len(data) == 2
    

    # Comprobación de los datos de la primera tarea
    assert data[0]["id"] == 1
    assert data[0]["subject"] == "Muay Thai"
    assert data[0]["title"] == "sparring"
    assert data[0]["deadline"] == "2024-10-25T15:30:00"  # Verifica el formato de fecha y hora en ISO
    assert data[0]["completed"] is True

    # Comprobación de los datos de la segunda tarea
    assert data[1]["id"] == 2
    assert data[1]["subject"] == "Muay Thai"
    assert data[1]["title"] == "sparring"
    assert data[1]["deadline"] == "2024-10-25T15:30:00"
    assert data[1]["completed"] is False

    # Verificar los tipos de datos para asegurar consistencia
    for task in data:
        assert isinstance(task["id"], int)
        assert isinstance(task["subject"], str)
        assert isinstance(task["title"], str)
        assert isinstance(task["deadline"], str)
        assert isinstance(task["completed"], bool)


def test_read_task(client: TestClient, session: Session):  
    # Registrar usuario y obtener el token
    client.post("/user/register", json={"username": "testuser", "email": "testuser@example.com", "password": "testpass"})
    login_response = client.post("/user/token", data={"username": "testuser@example.com", "password": "testpass"})
    access_token = login_response.json()["access_token"]

    # Crear una fecha específica para la tarea
    deadline = datetime.fromisoformat("2024-10-25T15:30:00")

    # Crear una tarea y añadirla a la sesión
    task = Task(user_id=1, subject="Muay Thai", title="Test Task", deadline=deadline, completed=False)
    session.add(task)
    session.commit()
    session.refresh(task)  # Refresca para obtener el ID de la tarea

    # Intentar obtener la tarea específica
    response = client.get(
        f"/task/{task.id}",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    data = response.json()

    # Verificación de respuesta correcta
    assert response.status_code == 200
    assert data["id"] == task.id
    assert data["subject"] == "Muay Thai"
    assert data["title"] == "Test Task"
    assert data["deadline"] == "2024-10-25T15:30:00"
    assert data["completed"] is False

    # Intentar acceder a una tarea inexistente
    response = client.get(
        "/task/9999",  # ID que no existe
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "task not found"}


def test_delete_task(client: TestClient, session: Session):  
    # Registrar usuario y obtener el token
    client.post("/user/register", json={"username": "testuser", "email": "testuser@example.com", "password": "testpass"})
    login_response = client.post("/user/token", data={"username": "testuser@example.com", "password": "testpass"})
    access_token = login_response.json()["access_token"]

    # Crear una fecha específica para la tarea
    deadline = datetime.fromisoformat("2024-10-25T15:30:00")

    # Crear una tarea y añadirla a la sesión
    task = Task(user_id=1, subject="Muay Thai", title="Task to Delete", deadline=deadline, completed=False)
    session.add(task)
    session.commit()
    session.refresh(task)  # Refresca para obtener el ID de la tarea

    # Intentar eliminar la tarea específica
    response = client.delete(
        f"/task/{task.id}",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    data = response.json()

    # Verificación de respuesta correcta
    assert response.status_code == 200
    assert data == {"Response": f"tarea '{task.title}' eliminada"}

    # Intentar acceder a la tarea eliminada debería dar un 404
    response = client.get(
        f"/task/{task.id}",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "task not found"}

    # Intentar eliminar una tarea inexistente
    response = client.delete(
        "/task/9999",  # ID que no existe
        headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 404
    assert response.json() == {"detail": "task not found"}
