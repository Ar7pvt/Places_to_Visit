import React from 'react';
import LocationCard from './LocationCard';
import './LocationList.css';

const LocationList = ({ locations, loading }) => {
  if (loading) {
    return <div className="loading">Loading locations...</div>;
  }

  if (!locations || locations.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🔍</div>
        <h3>No locations found</h3>
        <p>Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="location-list">
      {locations.map((location) => (
        <LocationCard key={location.id} location={location} />
      ))}
    </div>
  );
};

export default LocationList;
