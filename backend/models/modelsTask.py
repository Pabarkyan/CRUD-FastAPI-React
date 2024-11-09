from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime

from models.modelUser import User

from typing import Optional

## Modelos tareas

class TaskBase(SQLModel):
    title: str = Field(index=True)
    deadline: datetime = Field(index=True) # 2024-10-25T15:30:00
    completed: bool

class Task(TaskBase, table=True):
    id: Optional[int] = Field(primary_key=True, default=None)
    user_id: int = Field(foreign_key="user.id")
    user: Optional["User"] = Relationship(back_populates="tasks")
    subject: str

class TaskPublic(TaskBase):
    id: int
    subject: str

class TaskCreate(TaskBase):
    subject: str

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    deadline: Optional[datetime] = None
    subject: Optional[str] = None
    completed: Optional[bool] = None