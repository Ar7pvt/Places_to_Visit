# BHRAMAN Travel API - Backend

High-performance FastAPI backend for the BHRAMAN travel locations webapp.

## ⚡ Performance Features

- **Set-based Indexing**: O(1) multi-filter queries using set intersection
- **Backend Caching**: 1000-entry LRU cache for query results
- **98.3% Faster**: Cached queries (2064ms → 35ms)
- **500 Locations**: Loaded from CSV with full indexing
- **Instant Counts**: Set-based counting (30-70ms)

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the development server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Endpoints

### Locations
- `GET /api/locations` - Get all locations
  - Query params: `city`, `category`, `country`, `limit`, `offset`
  - Performance: Cached, set-based filtering
- `GET /api/locations/count` - Get count of locations matching filters
  - Query params: `city`, `category`, `country`
  - Performance: Instant (30-70ms)
- `GET /api/locations/{id}` - Get specific location by ID
  - Performance: O(1) hash lookup
- `POST /api/locations` - Create new location

### Metadata
- `GET /api/cities` - Get list of all cities
  - Optional param: `country` (cascading filter)
- `GET /api/categories` - Get list of all categories
- `GET /api/countries` - Get list of all countries

## Data Source

**File**: `E:\BHRAMAN\DATA\locations_dataset_500.csv`  
**Format**: ID, Name, Description, City, Country, Category, Latitude, Longitude, Rating, Price Range, Image URL, Address, Opening Hours, Tourism Links  
**Indexing**: Triple-indexed (country, city, category) + ID hash map + set-based indexes
