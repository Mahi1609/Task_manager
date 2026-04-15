
from pydantic import BaseModel, Field, validator
from datetime import datetime, timezone
from typing import Optional
from enum import Enum


class PriorityEnum(str, Enum):
    low = "low"
    medium = "medium"
    high = "high"


class StatusEnum(str, Enum):
    pending = "pending"
    in_progress = "in-progress"
    completed = "completed"


# Base schema (shared fields)
class TaskBase(BaseModel):
    title: str = Field(..., min_length=3)
    description: str = Field(..., min_length=5)
    assigned_to: str
    priority: PriorityEnum
    due_date: datetime


from datetime import datetime, timezone
from pydantic import BaseModel, validator

class TaskCreate(TaskBase):
    @validator("due_date")
    def validate_due_date(cls, value):
        now = datetime.now(timezone.utc)

        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)

        if value < now:
            raise ValueError("Due date cannot be in the past")

        return value


# Create Task (request)
class TaskCreate(TaskBase):
    pass


# Response schema
class TaskResponse(TaskBase):
    id: int
    status: StatusEnum
    created_at: datetime

    class Config:
        from_attributes = True  # IMPORTANT for SQLAlchemy


class TaskUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    priority: Optional[str]
    due_date: Optional[datetime]



