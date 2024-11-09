from sqlmodel import SQLModel, Field, Relationship

from typing import Optional, List

# from models.modelsTask import Task # esto quita la alerta pero daa error
# parece que no podemos importar sin mas las mismas variables entre si, podemos comentar esta
# y comentar User en modelTask y pasaria lo mismo

class UserBase(SQLModel):
    username: str = Field(index=True)
    email: str = Field(unique=True)
    is_active: bool = True
    is_super_user: bool = False

class User(UserBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    hashed_password: str
    tasks: List["Task"] = Relationship(back_populates="user") # esto solo establece relaciones, no incorpora columnas en la base de datos
    # para que esta linea funciones "from models.modelTask import Task" debe estar importado localmente
    # es decir, estar en el archivo donde este modelo se utiliza

class UserCreate(UserBase):
    password: str
