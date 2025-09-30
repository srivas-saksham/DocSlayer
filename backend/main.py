import uvicorn
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import documents

app = FastAPI(title="DocSlayer Backend")

# Production CORS with your specific domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://localhost:3000",
        "https://srivas-saksham.github.io",      
        "https://docslayer.vercel.app",         # ✅ correct domain
        "https://docslayer-git-main-srivas-saksham.vercel.app",  # preview builds
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/documents", tags=["Documents"])

@app.get("/")
def root():
    return {
        "message": "DocSlayer API is running on Render",
        "frontend_urls": [
            "https://srivas-saksham.github.io/DocSlayer",
            "https://docslayer.vercel.app"
        ],
        "repository": "https://github.com/srivas-saksham/DocSlayer"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy", 
        "service": "DocSlayer Backend",
        "cors_origins": [
            "https://srivas-saksham.github.io",
            "https://docslayer.vercel.app"
        ]
    }

# For Render deployment
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port)