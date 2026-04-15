from datetime import datetime


def is_overdue(task):
    return task.due_date < datetime.utcnow() and task.status != "completed"

def validate_status_transition(old_status: str, new_status: str):
    if old_status == "completed" and new_status == "in-progress":
        raise ValueError("Completed task cannot move back to in-progress")