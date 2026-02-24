import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import LocationList from '../components/LocationList';
import Map from '../components/Map';
import { locationAPI } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      // Fetch only 10 sample locations for initial display
      const data = await locationAPI.getLocations({ limit: 10 });
      setFilteredLocations(data);
      setError(null);
    } catch (err) {
      setError('Failed to load locations. Please try again later.');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async ({ country, city, category, search }) => {
    try {
      setLoading(true);
      
      // Fetch from API with filters (no limit when filters are applied)
      const filters = {};
      if (country) filters.country = country;
      if (city) filters.city = city;
      if (category) filters.category = category;
      
      // If no filters are applied, show only 10 sample locations
      if (!country && !city && !category && !search) {
        filters.limit = 10;
      }
      
      const data = await locationAPI.getLocations(filters);
      
      // Apply search filter locally (backend doesn't support search yet)
      let filtered = data;
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = data.filter(
          (loc) =>
            loc.name.toLowerCase().includes(searchLower) ||
            loc.description.toLowerCase().includes(searchLower) ||
            loc.city.toLowerCase().includes(searchLower) ||
            loc.country.toLowerCase().includes(searchLower)
        );
      }
      
      setFilteredLocations(filtered);
      setError(null);
    } catch (err) {
      setError('Failed to filter locations. Please try again.');
      console.error('Error filtering locations:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      <header className="app-header">
        <h1>🌍 BHRAMAN</h1>
        <p>Discover amazing travel destinations around the world</p>
      </header>

      <div className="container">
        {error && <div className="error">{error}</div>}

        <SearchBar onFilterChange={handleFilterChange} />

        <div className="view-toggle">
          <button
            className={`toggle-button ${showMap ? 'active' : ''}`}
            onClick={() => setShowMap(true)}
          >
            🗺️ Map View
          </button>
          <button
            className={`toggle-button ${!showMap ? 'active' : ''}`}
            onClick={() => setShowMap(false)}
          >
            📋 List View
          </button>
        </div>

        {showMap ? (
          <>
            {filteredLocations.length > 0 ? (
              <Map locations={filteredLocations} height="600px" />
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🗺️</div>
                <h3>No Locations to Display</h3>
                <p>Adjust your filters to see locations on the map</p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="results-header">
              <h2>
                {filteredLocations.length} Location{filteredLocations.length !== 1 ? 's' : ''} Found
              </h2>
            </div>
            <LocationList locations={filteredLocations} loading={loading} />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
