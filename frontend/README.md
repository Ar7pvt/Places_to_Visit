# Roamy Travel App - Frontend

High-performance React frontend for discovering travel locations with interactive maps.

## ⚡ Performance Features

- **Request Caching**: 60-second TTL with 100-entry limit
- **Debounced Search**: 500ms delay reduces API calls by 80%
- **Smart Loading**: Shows 10 sample locations initially, unlimited when filtering
- **Instant Navigation**: Cached filter/category/country data

## Features

- 🔍 Search and filter locations by country, city, category, and keywords
- 🗺️ Interactive maps using Leaflet with custom color-coded pins
- 🎨 Modern glassmorphism UI (Slate-Indigo palette)
- 📱 Fully responsive design for mobile, tablet, and desktop
- 🔄 Cascading filters (country → city)
- 🔗 External tourism links for each location
- ⚡ Ultra-fast with dual-layer caching
- 🎯 Map/List view toggle
- 📍 Custom SVG pins color-coded by category

## Components

### Independent Components:
- **SearchBar** - Search and filter controls
- **LocationCard** - Individual location display card
- **LocationList** - Grid of location cards
- **Map** - Interactive Leaflet map with markers

### Pages:
- **HomePage** - Main page with search, filters, and location grid
- **LocationDetailsPage** - Detailed view of a single location

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend directory (optional):
```
REACT_APP_API_URL=http://localhost:8000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Available Scripts

- `npm start` - Run development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Technologies

- React 18
- React Router for navigation
- Leaflet & React-Leaflet for maps
- Axios for API calls
- CSS3 for styling

## Project Structure

```
src/
├── components/
│   ├── SearchBar.js
│   ├── LocationCard.js
│   ├── LocationList.js
│   └── Map.js
├── pages/
│   ├── HomePage.js
│   └── LocationDetailsPage.js
├── services/
│   └── api.js
├── App.js
├── App.css
├── index.js
└── index.css
```
