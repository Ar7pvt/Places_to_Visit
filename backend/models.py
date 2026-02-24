from pydantic import BaseModel, Field
from typing import List, Optional

class Coordinates(BaseModel):
    latitude: float
    longitude: float

class TourismLink(BaseModel):
    title: str
    url: str
    description: Optional[str] = None

class Location(BaseModel):
    id: int
    name: str
    description: str
    city: str
    country: str
    coordinates: Coordinates
    category: str  # e.g., "museum", "restaurant", "park", "monument"
    rating: Optional[float] = Field(None, ge=0, le=5)
    image_url: Optional[str] = None
    tourism_links: List[TourismLink] = []
    address: Optional[str] = None
    opening_hours: Optional[str] = None
    price_range: Optional[str] = None  # e.g., "$", "$$", "$$$"

class LocationCreate(BaseModel):
    name: str
    description: str
    city: str
    country: str
    coordinates: Coordinates
    category: str
    rating: Optional[float] = None
    image_url: Optional[str] = None
    tourism_links: List[TourismLink] = []
    address: Optional[str] = None
    opening_hours: Optional[str] = None
    price_range: Optional[str] = None

class CityQuery(BaseModel):
    city: str
    country: Optional[str] = None
    category: Optional[str] = None
