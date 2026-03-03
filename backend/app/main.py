from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.auth import router as auth_router
from app.api.gyms import router as gyms_router
from app.api.bookings import router as bookings_router
from app.api.users import router as users_router
from app.api.partner import router as partner_router
from app.api.onboarding import router as onboarding_router
from app.api.promos import router as promos_router
from app.api.godeye import router as godeye_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "https://passfit.in", "https://www.passfit.in"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(gyms_router, prefix=f"{settings.API_V1_STR}/gyms", tags=["gyms"])
app.include_router(bookings_router, prefix=f"{settings.API_V1_STR}/bookings", tags=["bookings"])
app.include_router(users_router, prefix=f"{settings.API_V1_STR}/users", tags=["users"])
app.include_router(partner_router, prefix=f"{settings.API_V1_STR}/partner", tags=["partner"])
app.include_router(onboarding_router, prefix=f"{settings.API_V1_STR}/onboarding", tags=["onboarding"])
app.include_router(promos_router, prefix=f"{settings.API_V1_STR}/promos", tags=["promos"])
app.include_router(godeye_router, prefix=f"{settings.API_V1_STR}/godeye", tags=["godeye"])

@app.get("/")
def read_root():
    return {"message": "Welcome to Gym Marketplace API"}
