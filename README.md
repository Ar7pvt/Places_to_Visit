# 🌍 BHRAMAN - Travel Locations Webapp

A high-performance full-stack web application for discovering and exploring travel destinations around the world with interactive maps and rich location information.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![Tech Stack](https://img.shields.io/badge/FastAPI-0.109-green)
![Tech Stack](https://img.shields.io/badge/Python-3.9+-yellow)
![Locations](https://img.shields.io/badge/Locations-500-brightgreen)
![Performance](https://img.shields.io/badge/Cache-98%25_faster-orange)

## 🎯 Features

- **🔍 Advanced Search & Filter**: Find locations by country, city, category, or search term
- **🗺️ Interactive Maps**: Leaflet-powered maps with custom color-coded pins
- **📍 500 Locations**: Curated dataset across 18 countries and 30 cities
- **⚡ Ultra-Fast Queries**: Set-based indexing and dual-layer caching (98.3% faster)
- **🎨 Modern UI**: Glassmorphism design with Slate-Indigo color palette
- **🔄 Cascading Filters**: Smart country→city filtering
- **📱 Responsive Design**: Optimized for desktop, tablet, and mobile
- **🔀 Map/List Toggle**: Switch between map view and grid view
- **🔗 Tourism Links**: Direct links to official websites and travel resources
- **⏱️ Debounced Search**: Smooth searching with 500ms debounce
- **📄 Pagination**: Efficient data loading with limit/offset support

## 🏗️ Project Structure

```
BHRAMAN/
├── backend/              # FastAPI Python backend
│   ├── main.py          # Application entry point
│   ├── models.py        # Pydantic data models
│   ├── routes/          # API route handlers
│   │   └── locations.py
│   ├── services/        # Business logic
│   │   └── location_service.py
│   └── requirements.txt
│
└── frontend/            # React frontend
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/  # Reusable components
    │   │   ├── SearchBar.js
    │   │   ├── LocationCard.js
    │   │   ├── LocationList.js
    │   │   └── Map.js
    │   ├── pages/       # Page components
    │   │   ├── HomePage.js
    │   │   └── LocationDetailsPage.js
    │   ├── services/    # API integration
    │   │   └── api.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Python 3.9 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the FastAPI server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`
- Swagger docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📋 API Endpoints

| Method | Endpoint | Description | Performance |
|--------|----------|-------------|-------------|
| GET | `/api/locations` | Get all locations (with optional filters) | ⚡ Cached |
| GET | `/api/locations/count` | Get count of locations matching filters | ⚡ Instant |
| GET | `/api/locations/{id}` | Get specific location by ID | ⚡ O(1) |
| POST | `/api/locations` | Create new location | - |
| GET | `/api/cities` | Get list of all cities | ⚡ Cached |
| GET | `/api/cities?country={name}` | Get cities filtered by country | ⚡ Cached |
| GET | `/api/categories` | Get list of all categories | ⚡ Cached |
| GET | `/api/countries` | Get list of all countries | ⚡ Cached |

### Query Parameters

**For `/api/locations`:**
- `city`: Filter locations by city name
- `category`: Filter by category (museum, monument, park, restaurant, etc.)
- `country`: Filter by country name
- `limit`: Limit number of results (pagination)
- `offset`: Skip N results (pagination)

**Performance Features:**
- ⚡ Set-based indexing for O(1) multi-filter queries
- 💾 Backend caching (1000 entry LRU cache)
- 🌐 Frontend caching (60-second TTL)
- 📊 98.3% faster repeated queries

## 🧩 Components Overview

### Frontend Components

#### SearchBar
- Search input with real-time filtering
- City and category dropdown filters
- Clear filters functionality

#### LocationCard
- Displays location preview with image
- Shows rating, category, and price range
- Click to navigate to details page

#### LocationList
- Grid layout of location cards
- Responsive design
- Empty state handling

#### Map
- Interactive Leaflet map
- Custom markers for each location
- Popup with location information
- Auto-fit bounds to show all locations

### Pages

#### HomePage
- Main landing page
- Search and filter controls
- Toggle between map and list view
- Grid of location cards

#### LocationDetailsPage
- Hero image section
- Comprehensive location information
- Embedded map
- Tourism links with external references
- Back navigation

## 🎨 Technologies Used

### Backend
- **FastAPI 0.109.0**: Modern, fast web framework for building APIs
- **Pydantic 2.6.0**: Data validation using Python type annotations
- **Uvicorn 0.27.0**: ASGI server for FastAPI
- **Python CSV**: High-performance data loading from CSV
- **Set-based Indexing**: O(1) multi-filter query performance
- **LRU Caching**: 1000-entry query result cache

### Frontend
- **React 18.2.0**: UI library for building user interfaces
- **React Router 6.21.3**: Client-side routing
- **Leaflet 1.9.4**: Open-source JavaScript library for maps
- **React-Leaflet 4.2.1**: React components for Leaflet maps
- **Axios 1.6.5**: Promise-based HTTP client
- **Request Caching**: 60-second TTL, 100-entry cache

### Data
- **Dataset**: 100000 locations from CSV file
- **Coverage**: 18 countries, 30 cities, 16 categories
- **Fields**: ID, Name, Description, City, Country, Category, Coordinates, Rating, Price Range, Image URL, Address, Hours, Tourism Links

## ⚡ Performance Optimizations

### Backend
- **Set-based Indexing**: Multi-filter queries using set intersection (O(1) lookup)
- **Triple Indexing**: Locations indexed by country, city, and category
- **ID Hash Map**: Instant location lookup by ID
- **Query Result Caching**: 1000-entry LRU cache for repeated queries
- **Count Optimization**: Set-based counting (30-70ms)

### Frontend
- **Request Caching**: 60-second TTL cache for API responses
- **Debounced Search**: 500ms delay reduces API calls by 80%
- **Smart Initial Load**: Shows 10 locations on first load, unlimited when filtering
- **Cached Metadata**: Countries, cities, categories cached after first load

### Performance Metrics
| Query Type | First Request | Cached Request | Improvement |
|------------|---------------|----------------|-------------|
| Multi-filter | 2064ms | 35ms | **98.3%** |
| Single filter | 50-700ms | 30-60ms | **50-95%** |
| Count queries | 30-70ms | 30-70ms | Instant |

📊 **See [PERFORMANCE_IMPROVEMENTS.md](PERFORMANCE_IMPROVEMENTS.md) for detailed analysis**

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:8000/api
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (< 768px)

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Development

### Data Source
Locations are loaded from: `E:\BHRAMAN\DATA\locations_dataset_500.csv`

To add new locations:
1. Add rows to the CSV file with the required columns
2. Restart the backend server to reload data
3. Or use the POST `/api/locations` endpoint for dynamic additions

### CSV Format
```
ID,Name,Description,City,Country,Category,Latitude,Longitude,Rating,Price Range,Image URL,Address,Opening Hours,Tourism Links
```

### Sample API Request
```json
{
  "name": "Location Name",
  "description": "Detailed description",
  "city": "City Name",
  "country": "Country",
  "coordinates": {
    "latitude": 40.7128,
    "longitude": -74.0060
  },
  "category": "museum",
  "rating": 4.5,
  "image_url": "https://example.com/image.jpg",
  "tourism_links": [
    {
      "title": "Official Website",
      "url": "https://example.com",
      "description": "Visit the official website"
    }
  ],
  "address": "123 Main St",
  "opening_hours": "9:00 AM - 5:00 PM",
  "price_range": "$$"
}
```

## Future Integration
Integrating AIML model to find Best and Sortest Root to visit
## 🎉 Happy Traveling!

Explore the world with BHRAMAN! 🌍✈️
