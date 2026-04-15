from sqlalchemy.orm import Session
from datetime import datetime
from models import Task
from schema import TaskCreate
from typing import List, Optional
from utils.validators import is_overdue
from utils.validators import validate_status_transition



def create_task(db: Session, task_data: TaskCreate):
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        assigned_to=task_data.assigned_to,
        priority=task_data.priority,
        due_date=task_data.due_date,
        status="pending",  # default
        created_at=datetime.utcnow()
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)

    return new_task

def get_tasks(
    db: Session,
    status: Optional[str] = None,
    assigned_to: Optional[str] = None,
    overdue: Optional[bool] = None
):
    query = db.query(Task)

    # Filter by status
    if status:
        query = query.filter(Task.status == status)

    # Filter by assigned user
    if assigned_to:
        query = query.filter(Task.assigned_to == assigned_to)

    tasks = query.all()

    # Filter overdue in Python (since it's dynamic)
    if overdue:
        tasks = [task for task in tasks if is_overdue(task)]

    return tasks


def update_task(db: Session, task_id: int, updated_data):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return None

    for key, value in updated_data.dict(exclude_unset=True).items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)

    return task


def assign_task(db: Session, task_id: int, user: str):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return None

    task.assigned_to = user

    db.commit()
    db.refresh(task)

    return task


def update_status(db: Session, task_id: int, new_status: str):
    task = db.query(Task).filter(Task.id == task_id).first()

    if not task:
        return None

    # 🔥 Apply rule
    validate_status_transition(task.status, new_status)

    task.status = new_status

    db.commit()
    db.refresh(task)

    return task