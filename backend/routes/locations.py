from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from models import Location, LocationCreate
from services.location_service import LocationService

router = APIRouter()
location_service = LocationService()

@router.get("/locations", response_model=List[Location])
async def get_locations(
    city: Optional[str] = Query(None, description="Filter by city name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    country: Optional[str] = Query(None, description="Filter by country"),
    limit: Optional[int] = Query(None, description="Limit number of results", ge=1),
    offset: Optional[int] = Query(None, description="Offset for pagination", ge=0)
):
    """Get all locations with optional filters for city, category, country, and pagination"""
    return location_service.get_locations(
        city=city, 
        category=category, 
        country=country, 
        limit=limit,
        offset=offset
    )

@router.get("/locations/count", response_model=dict)
async def get_locations_count(
    city: Optional[str] = Query(None, description="Filter by city name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    country: Optional[str] = Query(None, description="Filter by country")
):
    """Get total count of locations matching filters"""
    count = location_service.get_total_count(city=city, category=category, country=country)
    return {"count": count}

@router.get("/locations/{location_id}", response_model=Location)
async def get_location(location_id: int):
    """Get a specific location by ID"""
    location = location_service.get_location_by_id(location_id)
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

@router.post("/locations", response_model=Location, status_code=201)
async def create_location(location: LocationCreate):
    """Create a new location"""
    return location_service.create_location(location)

@router.get("/cities", response_model=List[str])
async def get_cities(country: Optional[str] = Query(None, description="Filter cities by country")):
    """Get list of all available cities, optionally filtered by country"""
    return location_service.get_all_cities(country=country)

@router.get("/categories", response_model=List[str])
async def get_categories():
    """Get list of all available categories"""
    return location_service.get_all_categories()

@router.get("/countries", response_model=List[str])
async def get_countries():
    """Get list of all available countries"""
    return location_service.get_all_countries()
