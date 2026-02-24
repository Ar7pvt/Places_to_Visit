from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import locations

app = FastAPI(title="Roamy Travel API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(locations.router, prefix="/api", tags=["locations"])

@app.get("/")
async def root():
    return {"message": "Welcome to Roamy Travel API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
