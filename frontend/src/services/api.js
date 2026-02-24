import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Simple request cache to prevent redundant API calls
const requestCache = new Map();
const CACHE_DURATION = 60000; // 1 minute in milliseconds

const getCacheKey = (url) => url;

const getCachedData = (key) => {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

const setCachedData = (key, data) => {
  requestCache.set(key, {
    data,
    timestamp: Date.now()
  });
  
  // Limit cache size to 100 entries
  if (requestCache.size > 100) {
    const firstKey = requestCache.keys().next().value;
    requestCache.delete(firstKey);
  }
};

export const locationAPI = {
  // Get all locations with optional filters
  getLocations: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.category) params.append('category', filters.category);
    if (filters.country) params.append('country', filters.country);
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    
    const url = `/locations?${params.toString()}`;
    const cacheKey = getCacheKey(url);
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const response = await api.get(url);
    setCachedData(cacheKey, response.data);
    return response.data;
  },

  // Get count of locations matching filters
  getLocationsCount: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.city) params.append('city', filters.city);
    if (filters.category) params.append('category', filters.category);
    if (filters.country) params.append('country', filters.country);
    
    const url = `/locations/count?${params.toString()}`;
    const cacheKey = getCacheKey(url);
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData !== null) {
      return cachedData;
    }
    
    const response = await api.get(url);
    setCachedData(cacheKey, response.data.count);
    return response.data.count;
  },

  // Get single location by ID
  getLocationById: async (id) => {
    const response = await api.get(`/locations/${id}`);
    return response.data;
  },

  // Create new location
  createLocation: async (locationData) => {
    const response = await api.post('/locations', locationData);
    return response.data;
  },

  // Get all cities, optionally filtered by country
  getCities: async (country = null) => {
    const params = country ? `?country=${encodeURIComponent(country)}` : '';
    const url = `/cities${params}`;
    const cacheKey = getCacheKey(url);
    
    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const response = await api.get(url);
    setCachedData(cacheKey, response.data);
    return response.data;
  },

  // Get all categories
  getCategories: async () => {
    const url = '/categories';
    const cacheKey = getCacheKey(url);
    
    // Check cache first (categories rarely change)
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const response = await api.get(url);
    setCachedData(cacheKey, response.data);
    return response.data;
  },

  // Get all countries
  getCountries: async () => {
    const url = '/countries';
    const cacheKey = getCacheKey(url);
    
    // Check cache first (countries rarely change)
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }
    
    const response = await api.get(url);
    setCachedData(cacheKey, response.data);
    return response.data;
  },
  
  // Clear cache utility
  clearCache: () => {
    requestCache.clear();
  }
};

export default api;
