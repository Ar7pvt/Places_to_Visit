import React, { useState, useEffect } from 'react';
import { locationAPI } from '../services/api';
import './SearchBar.css';

const SearchBar = ({ onFilterChange }) => {
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFilters();
  }, []);

  // Debounce search input to reduce API calls
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onFilterChange({ 
        country: selectedCountry, 
        city: selectedCity, 
        category: selectedCategory, 
        search: searchTerm 
      });
    }, 500); // 500ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Only run when searchTerm changes

  const fetchFilters = async () => {
    try {
      const [countriesData, citiesData, categoriesData] = await Promise.all([
        locationAPI.getCountries(),
        locationAPI.getCities(),
        locationAPI.getCategories(),
      ]);
      setCountries(countriesData);
      setCities(citiesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };

  const handleCountryChange = async (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setSelectedCity(''); // Reset city when country changes
    
    // Fetch cities for selected country
    try {
      const citiesData = await locationAPI.getCities(country || null);
      setCities(citiesData);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
    
    onFilterChange({ country, city: '', category: selectedCategory, search: searchTerm });
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);
    onFilterChange({ country: selectedCountry, city, category: selectedCategory, search: searchTerm });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    onFilterChange({ country: selectedCountry, city: selectedCity, category, search: searchTerm });
  };

  const handleSearchChange = (e) => {
    const search = e.target.value;
    setSearchTerm(search);
    // Debounced via useEffect - no direct call to onFilterChange
  };

  const handleClearFilters = async () => {
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedCategory('');
    setSearchTerm('');
    
    // Reset to all cities
    try {
      const citiesData = await locationAPI.getCities();
      setCities(citiesData);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
    
    onFilterChange({ country: '', city: '', category: '', search: '' });
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          placeholder="Search destinations, cities, or attractions..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      <div className="filter-card">
        <div className="filters">
          <select
            value={selectedCountry}
            onChange={handleCountryChange}
            className="filter-select"
          >
            <option value="">🌍 All Countries</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={handleCityChange}
            className="filter-select"
          >
            <option value="">🏙️ All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          {(selectedCountry || selectedCity || selectedCategory || searchTerm) && (
            <button onClick={handleClearFilters} className="clear-button">
              ✕ Clear All
            </button>
          )}
        </div>

        {/* Category Chips */}
        <div className="category-chips-wrapper">
          <div className="category-chips">
            <button
              className={`category-chip ${selectedCategory === '' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('')}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {getCategoryIcon(category)} {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function for category icons
const getCategoryIcon = (category) => {
  const icons = {
    monument: '🏛️',
    museum: '🏛️',
    park: '🌳',
    restaurant: '🍽️',
    attraction: '🎡',
  };
  return icons[category.toLowerCase()] || '📍';
};

export default SearchBar;
