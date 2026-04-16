from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routes import task_routes

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



Base.metadata.create_all(bind=engine)

# Include routes
app.include_router(task_routes.router)


@app.get("/")
def root():
    return {"message": "Task Manager API Running 🚀"}


@app.head("/")
def root_head():
    return {}