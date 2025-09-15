from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import documents

app = FastAPI(title="DocSlayer Backend")

# Allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(documents.router, prefix="/documents", tags=["Documents"])


@app.get("/")
def root():
    return {"message": "DocSlayer API is running 🚀"}
