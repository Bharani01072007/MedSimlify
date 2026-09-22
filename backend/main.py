import sys
import os

# Ensure backend directory is in sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.openapi.docs import get_swagger_ui_html, get_redoc_html
from config.database import test_connection, engine, Base
from api.ai_routes import router as ai_router

try:
    from loguru import logger
except ImportError:
    import logging
    logging.basicConfig(level=logging.INFO)
    logger = logging.getLogger("medsimplify")

# Create FastAPI app with standard Swagger UI and ReDoc routes enabled
app = FastAPI(
    title="MedSimplify API",
    description="AI-powered medical report simplification & Healthcare App",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)



# CORS middleware
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

from fastapi import Request
from fastapi.responses import JSONResponse

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global API exception handler caught: {exc}")
    origin = request.headers.get("origin") or "http://localhost:8080"
    response = JSONResponse(
        status_code=500,
        content={"detail": str(exc), "status": 500}
    )
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    return response

# Mount Static Files directory for CSS/JS/images
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Test database connection on startup
@app.on_event("startup")
async def startup_db():
    logger.info("Starting up MedSimplify API...")
    test_connection()
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables verified on Supabase PostgreSQL!")

# Include AI Pipeline Router
app.include_router(ai_router, prefix="/api/ai", tags=["AI Pipeline"])
app.include_router(ai_router, prefix="/api/v1/ai", tags=["AI Pipeline V1"])

# Include domain-specific API routers under /api and /api/v1
from app.api.reports import router as reports_router
from app.api.auth import router as auth_router
from app.api.medicines import router as medicines_router
from app.api.appointments import router as appointments_router
from app.api.symptoms import router as symptoms_router
from app.api.chat import router as chat_router
from app.api.prescriptions import router as prescriptions_router
from app.api.family import router as family_router

domain_routers = [
    reports_router,
    auth_router,
    medicines_router,
    appointments_router,
    symptoms_router,
    chat_router,
    prescriptions_router,
    family_router
]

for r in domain_routers:
    app.include_router(r, prefix="/api")
    app.include_router(r, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    db_status = "connected" if test_connection() else "disconnected"
    return {
        "status": "healthy",
        "database": db_status,
        "ai_pipeline": "ready",
        "dbeaver": "localhost:5432/medsimplify"
    }

# Serve root Web Application index.html explicitly to prevent static wildcard delays
@app.get("/", include_in_schema=False)
async def serve_root_frontend():
    index_file = os.path.join(static_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "MedSimplify API is running!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

