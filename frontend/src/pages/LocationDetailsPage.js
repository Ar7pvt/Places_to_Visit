import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Map from '../components/Map';
import { locationAPI } from '../services/api';
import './LocationDetailsPage.css';

const LocationDetailsPage = () => {
  const { id } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLocationDetails();
  }, [id]);

  const fetchLocationDetails = async () => {
    try {
      setLoading(true);
      const data = await locationAPI.getLocationById(id);
      setLocation(data);
      setError(null);
    } catch (err) {
      setError('Failed to load location details. Please try again later.');
      console.error('Error fetching location details:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      museum: '🏛️',
      monument: '🗿',
      park: '🌳',
      restaurant: '🍽️',
      attraction: '⭐',
      default: '📍',
    };
    return icons[category?.toLowerCase()] || icons.default;
  };

  const renderRating = (rating) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const stars = '⭐'.repeat(fullStars);
    return (
      <div className="detail-rating">
        <span className="stars">{stars}</span>
        <span className="rating-value">{rating.toFixed(1)} / 5.0</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="location-details-page">
        <header className="app-header">
          <h1>🌍 Roamy</h1>
        </header>
        <div className="container">
          <div className="loading">Loading location details...</div>
        </div>
      </div>
    );
  }

  if (error || !location) {
    return (
      <div className="location-details-page">
        <header className="app-header">
          <h1>🌍 Roamy</h1>
        </header>
        <div className="container">
          <div className="error">{error || 'Location not found'}</div>
          <Link to="/" className="back-button">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="location-details-page">
      <header className="app-header">
        <h1>🌍 Roamy</h1>
        <p>Travel destination details</p>
      </header>

      <div className="container">
        <Link to="/" className="back-button">
          ← Back to All Locations
        </Link>

        <div className="details-container">
          {/* Hero Image Section */}
          <div className="hero-image">
            {location.image_url ? (
              <img src={location.image_url} alt={location.name} />
            ) : (
              <div className="placeholder-hero">
                <span className="hero-icon">
                  {getCategoryIcon(location.category)}
                </span>
              </div>
            )}
            <div className="hero-overlay">
              <div className="category-badge">
                {getCategoryIcon(location.category)} {location.category}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="details-content">
            <div className="content-header">
              <h1 className="location-title">{location.name}</h1>
              <p className="location-location">
                📍 {location.city}, {location.country}
              </p>
            </div>

            {/* Key Information */}
            <div className="info-grid">
              {location.rating && (
                <div className="info-card">
                  <h3>Rating</h3>
                  {renderRating(location.rating)}
                </div>
              )}

              {location.price_range && (
                <div className="info-card">
                  <h3>Price Range</h3>
                  <p className="price-value">{location.price_range}</p>
                </div>
              )}

              {location.opening_hours && (
                <div className="info-card">
                  <h3>Opening Hours</h3>
                  <p>🕒 {location.opening_hours}</p>
                </div>
              )}

              {location.address && (
                <div className="info-card">
                  <h3>Address</h3>
                  <p>📮 {location.address}</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="description-section">
              <h2>About</h2>
              <p className="description-text">{location.description}</p>
            </div>

            {/* Map */}
            <div className="map-section">
              <h2>Location on Map</h2>
              <Map
                locations={[location]}
                center={[location.coordinates.latitude, location.coordinates.longitude]}
                zoom={15}
                height="400px"
              />
            </div>

            {/* Tourism Links */}
            {location.tourism_links && location.tourism_links.length > 0 && (
              <div className="links-section">
                <h2>Useful Links</h2>
                <div className="links-grid">
                  {location.tourism_links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-card"
                    >
                      <h3>🔗 {link.title}</h3>
                      {link.description && <p>{link.description}</p>}
                      <span className="external-link-icon">↗</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationDetailsPage;
