from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from contextlib import asynccontextmanager

from routers import auth, task
from database.database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)

app.include_router(task.router)
app.include_router(auth.router)


# configurar el CORS para conectarlo a una aplicacion de react
origins = [
    "http://localhost:5173", # url del frontend en desarrollo
    # agregar otras url si fuera necesario
    "http://127.0.0.1:5173"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)