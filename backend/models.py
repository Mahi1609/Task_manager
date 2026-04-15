from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    assigned_to = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    status = Column(String, default="pending")
    due_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)