import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LocationCard.css';

const LocationCard = ({ location }) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleClick = () => {
    navigate(`/location/${location.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
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
    return icons[category.toLowerCase()] || icons.default;
  };

  const renderRating = (rating) => {
    if (!rating) return null;
    return (
      <div className="rating-pill">
        ⭐ {rating.toFixed(1)}
      </div>
    );
  };

  const getPriceDisplay = (priceRange) => {
    if (!priceRange) return null;
    if (priceRange.toLowerCase() === 'free') {
      return <span className="price-free">Free</span>;
    }
    return <span className="price-paid">{priceRange}</span>;
  };

  return (
    <div className="location-card" onClick={handleClick}>
      <div className="card-image">
        {location.image_url ? (
          <img src={location.image_url} alt={location.name} />
        ) : (
          <div className="placeholder-image">
            <span className="placeholder-icon">
              {getCategoryIcon(location.category)}
            </span>
          </div>
        )}
        <div className="category-badge">
          {location.category}
        </div>
        {renderRating(location.rating)}
        <button 
          className={`favorite-button ${isFavorite ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Add to favorites"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
      
      <div className="card-content">
        <h3 className="location-name">{location.name}</h3>
        <p className="location-city">
          📍 {location.city}, {location.country}
        </p>
        <p className="location-description">{location.description}</p>
        
        <div className="card-footer">
          <div className="price-wrapper">
            {getPriceDisplay(location.price_range)}
          </div>
          <button className="explore-button">
            Explore
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationCard;
