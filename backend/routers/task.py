from typing import Annotated

from fastapi import APIRouter, Depends, Query, HTTPException,status
from sqlmodel import select

from database.database import SessionDep
from models.modelsTask import Task, TaskCreate, TaskUpdate, TaskPublic
from dependencies.auth import get_current_user
from models.modelUser import User


router = APIRouter(
    prefix="/task",
    tags=["task"],
    dependencies=[Depends(get_current_user)],
    responses={404: {"description": "Not found"}}
)


@router.post("/", response_model=TaskPublic)
async def create_task(task: TaskCreate, session: SessionDep, current_user: User = Depends(get_current_user)):
    db_task = Task(**task.model_dump(), user_id=current_user.id)
    # el id se crea automaticamente pq es una clave primaria

    session.add(db_task)
    session.commit()
    session.refresh(db_task)

    task_public = TaskPublic(
        id=db_task.id,
        title=db_task.title,
        deadline=db_task.deadline,
        completed=db_task.completed,
        subject=db_task.subject
    )

    return task_public


@router.get("/", response_model=list[TaskPublic])
async def read_tasks(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
    current_user: User = Depends(get_current_user)
):
    tasks = session.exec(
        select(Task).where(Task.user_id == current_user.id).offset(offset).limit(limit)
    ).all()

    # Crear una lista de TaskPublic, excluyendo user_id
    tasks_public = [
        TaskPublic(
            id=task.id,
            title=task.title,
            deadline=task.deadline,
            completed=task.completed,
            subject=task.subject
        )
        for task in tasks
    ]

    return tasks_public


@router.get("/{id}", response_model=TaskPublic)
async def read_task(id: int, session: SessionDep, current_user: User = Depends(get_current_user)):
    task = session.get(Task, id)

    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    
    # Convertir Task a TaskPublic excluyendo user_id
    task_public = TaskPublic(
        id=task.id,
        title=task.title,
        deadline=task.deadline,
        completed=task.completed,
        subject=task.subject
    )

    return task_public


@router.delete("/{id}")
async def delete_task(id: int, session: SessionDep, current_user: User = Depends(get_current_user)):
    task = session.get(Task, id)

    if not task or task.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="task not found")
    
    session.delete(task)
    session.commit()
    
    return {"Response": f"tarea '{task.title}' eliminada"}


@router.patch("/{id}", response_model=TaskPublic)
async def update_task(id: int, task: TaskUpdate, session: SessionDep, current_user: User = Depends(get_current_user)):
    task_db = session.get(Task, id)
    
    if not task_db or task_db.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    task_data = task.model_dump(exclude_unset=True)
    task_db.sqlmodel_update(task_data)
    session.add(task_db)
    session.commit()
    session.refresh(task_db)
    
    # Convertir Task actualizado a TaskPublic excluyendo user_id
    task_public = TaskPublic(
        id=task_db.id,
        title=task_db.title,
        deadline=task_db.deadline,
        completed=task_db.completed,
        subject=task_db.subject
    )
    return task_public