from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schema import TaskCreate, TaskResponse, TaskUpdate, StatusEnum
from services.task_service import (
    assign_task,
    create_task,
    get_tasks,
    update_task,
    update_status
)
from typing import List, Optional
from models import Task

router = APIRouter()

# ✅ CREATE TASK (THIS WAS MISSING 🔥)
@router.post("/tasks", response_model=TaskResponse)
def create_new_task(task: TaskCreate, db: Session = Depends(get_db)):
    return create_task(db, task)


# ✅ GET TASKS
@router.get("/tasks", response_model=List[TaskResponse])
def list_tasks(
    status: Optional[str] = Query(None),
    assigned_to: Optional[str] = Query(None),
    overdue: Optional[bool] = Query(None),
    limit: int = Query(10),
    offset: int = Query(0),
    db: Session = Depends(get_db)
):
    tasks = get_tasks(db, status, assigned_to, overdue)
    return tasks[offset: offset + limit]


# ✅ UPDATE TASK
@router.put("/tasks/{task_id}", response_model=TaskResponse)
def update_existing_task(
    task_id: int,
    task: TaskUpdate,
    db: Session = Depends(get_db)
):
    updated = update_task(db, task_id, task)

    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")

    return updated


# ✅ ASSIGN TASK
@router.patch("/tasks/{task_id}/assign", response_model=TaskResponse)
def assign_task_to_user(
    task_id: int,
    assigned_to: str,
    db: Session = Depends(get_db)
):
    task = assign_task(db, task_id, assigned_to)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    return task


# ✅ UPDATE STATUS
@router.patch("/tasks/{task_id}/status", response_model=TaskResponse)
def update_task_status(
    task_id: int,
    status: StatusEnum,
    db: Session = Depends(get_db)
):
    try:
        task = update_status(db, task_id, status.value)

        if not task:
            raise HTTPException(status_code=404, detail="Task not found")

        return task

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    

@router.delete("/tasks/{task_id}")
def delete_task_api(task_id: int, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db.delete(task)
    db.commit()

    return {"message": "Task deleted successfully"}