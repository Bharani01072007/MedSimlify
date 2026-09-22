import sys
import os

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config.database import engine, Base, test_connection
from app.core.config import settings
from app.api import auth, reports, medicines, symptoms, prescriptions, chat

try:
    from loguru import logger
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("medsimplify")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="MedSimplify API - AI-Powered Medical Report Simplification & Healthcare App Backend"
)

# CORS middleware for React Native Expo and Web
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db():
    logger.info("Starting up MedSimplify API...")
    test_connection()
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables verified!")

# Include Routers under /api
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(reports.router, prefix=settings.API_V1_STR)
app.include_router(medicines.router, prefix=settings.API_V1_STR)
app.include_router(symptoms.router, prefix=settings.API_V1_STR)
app.include_router(prescriptions.router, prefix=settings.API_V1_STR)
app.include_router(chat.router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    db_status = "connected" if test_connection() else "disconnected"
    return {
        "status": "healthy",
        "database": db_status,
        "dbeaver": "localhost:5432/medsimplify"
    }

from fastapi.responses import HTMLResponse

@app.get("/", response_class=HTMLResponse)
def root():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>MedSimplify API Backend</title>
        <meta http-equiv="refresh" content="3;url=http://localhost:8080/" />
        <style>
            body { font-family: system-ui, -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; text-align: center; }
            .card { background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); max-width: 440px; }
            .btn { display: inline-block; background: #4f46e5; color: white; padding: 0.75rem 1.5rem; text-decoration: none; border-radius: 0.5rem; font-weight: 600; margin-top: 1rem; }
            .btn-alt { background: #e0e7ff; color: #3730a3; margin-left: 0.5rem; }
        </style>
    </head>
    <body>
        <div class="card">
            <h2 style="margin-top:0; color:#1e293b;">🩺 MedSimplify API Backend</h2>
            <p style="color:#475569; font-size:0.95rem;">You are connected to the FastAPI backend service.</p>
            <p style="color:#64748b; font-size:0.85rem;">Redirecting to the Web App in 3 seconds...</p>
            <div style="margin-top:1.5rem;">
                <a href="http://localhost:8080/" class="btn">🚀 Open Web App</a>
                <a href="/docs" class="btn btn-alt">📚 API Swagger Docs</a>
            </div>
        </div>
    </body>
    </html>
    """

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
