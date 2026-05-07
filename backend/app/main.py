from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="UBID & Active Business Intelligence API",
    description="API for Entity Resolution and Activity Classification of business records.",
    version="1.0.0"
)

# Configure CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],  # Vite default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api.endpoints import dashboard, review, search, export, audit
from app.core.database import engine, Base

# Create tables
Base.metadata.create_all(bind=engine)

app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(review.router, prefix="/api/review", tags=["review"])
app.include_router(search.router, prefix="/api/search", tags=["search"])
app.include_router(export.router, prefix="/api/export", tags=["export"])
app.include_router(audit.router, prefix="/api/audit", tags=["audit"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the UBID API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
