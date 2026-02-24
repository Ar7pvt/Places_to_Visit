import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import './Map.css';

// Custom pin icon with glassmorphic style
const createCustomIcon = (category) => {
  const categoryColors = {
    monument: '#4f46e5',
    museum: '#7c3aed',
    park: '#10b981',
    restaurant: '#f59e0b',
    attraction: '#ec4899',
    default: '#4f46e5'
  };

  const color = categoryColors[category?.toLowerCase()] || categoryColors.default;

  const svgIcon = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
          <feOffset dx="0" dy="2" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <path d="M16 0C7.163 0 0 7.163 0 16c0 8.837 16 26 16 26s16-17.163 16-26C32 7.163 24.837 0 16 0z" 
            fill="${color}" filter="url(#shadow)"/>
      <circle cx="16" cy="16" r="6" fill="white" opacity="0.9"/>
    </svg>
  `;

  return L.divIcon({
    className: 'custom-pin-icon',
    html: svgIcon,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -42]
  });
};

const Map = ({ locations, center, zoom = 12, height = '500px' }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && locations && locations.length > 0) {
      const map = mapRef.current;
      const bounds = L.latLngBounds(
        locations.map(loc => [loc.coordinates.latitude, loc.coordinates.longitude])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [locations]);

  const defaultCenter = center || [20.5937, 78.9629]; // India center as default

  return (
    <div className="map-wrapper">
      {/* Floating Map Info Card */}
      <div className="map-info-card">
        <div className="map-info-icon">📍</div>
        <div className="map-info-content">
          <div className="map-info-count">{locations?.length || 0}</div>
          <div className="map-info-label">Location{locations?.length !== 1 ? 's' : ''}</div>
        </div>
      </div>

      <div className="map-container" style={{ height }}>
        <MapContainer
          center={defaultCenter}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {locations && locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.coordinates.latitude, location.coordinates.longitude]}
              icon={createCustomIcon(location.category)}
            >
              <Popup className="glassmorphic-popup">
                <div className="map-popup">
                  <h3>{location.name}</h3>
                  <p className="popup-location">📍 {location.city}, {location.country}</p>
                  <div className="popup-details">
                    <span className="popup-category">{location.category}</span>
                    {location.rating && (
                      <span className="popup-rating">⭐ {location.rating.toFixed(1)}</span>
                    )}
                  </div>
                  {location.price_range && (
                    <p className="popup-price">
                      {location.price_range.toLowerCase() === 'free' ? 
                        <span className="price-free">Free Entry</span> : 
                        <span className="price-paid">{location.price_range}</span>
                      }
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;
