from typing import List, Optional, Dict, Tuple
import csv
import os
from collections import defaultdict
from functools import lru_cache
from models import Location, LocationCreate, Coordinates, TourismLink

class LocationService:
    def __init__(self):
        # Load data from CSV file
        self.locations = []
        # Indexes for fast lookups (lists for maintaining order)
        self.by_country = defaultdict(list)
        self.by_city = defaultdict(list)
        self.by_category = defaultdict(list)
        self.by_id = {}
        
        # Set-based indexes for fast intersection operations
        self.id_sets_by_country = defaultdict(set)
        self.id_sets_by_city = defaultdict(set)
        self.id_sets_by_category = defaultdict(set)
        
        # Query result cache
        self._query_cache = {}
        self._cache_max_size = 1000
        
        self._load_locations_from_csv()
        self.next_id = len(self.locations) + 1
    
    def _load_locations_from_csv(self):
        """Load locations from CSV dataset"""
        csv_path = r"E:\Roamy\DATA\locations_dataset_500.csv"
        
        if not os.path.exists(csv_path):
            print(f"Warning: CSV file not found at {csv_path}")
            return
        
        try:
            with open(csv_path, 'r', encoding='utf-8') as file:
                csv_reader = csv.DictReader(file)
                
                for row in csv_reader:
                    # Parse tourism links
                    tourism_links = []
                    if row.get('Tourism Links'):
                        # Format: "Title: URL" or multiple separated by |
                        link_parts = row['Tourism Links'].split('|')
                        for link_part in link_parts:
                            if ':' in link_part:
                                parts = link_part.split(':', 1)
                                title = parts[0].strip()
                                url = parts[1].strip() if len(parts) > 1 else ""
                                tourism_links.append(
                                    TourismLink(
                                        title=title,
                                        url=url,
                                        description=f"Visit {title}"
                                    )
                                )
                    
                    # Create Location object
                    location = Location(
                        id=int(row['ID']),
                        name=row['Name'],
                        description=row['Description'],
                        city=row['City'],
                        country=row['Country'],
                        category=row['Category'].lower(),
                        coordinates=Coordinates(
                            latitude=float(row['Latitude']),
                            longitude=float(row['Longitude'])
                        ),
                        rating=float(row['Rating']),
                        price_range=row['Price Range'],
                        image_url=row['Image URL'],
                        address=row.get('Address', ''),
                        opening_hours=row.get('Opening Hours', ''),
                        tourism_links=tourism_links
                    )
                    
                    self.locations.append(location)
                    
                    # Build indexes for fast lookups
                    country_key = location.country.lower()
                    city_key = location.city.lower()
                    category_key = location.category.lower()
                    
                    self.by_country[country_key].append(location)
                    self.by_city[city_key].append(location)
                    self.by_category[category_key].append(location)
                    self.by_id[location.id] = location
                    
                    # Build set-based indexes for fast intersection
                    self.id_sets_by_country[country_key].add(location.id)
                    self.id_sets_by_city[city_key].add(location.id)
                    self.id_sets_by_category[category_key].add(location.id)
            
            print(f"✅ Loaded {len(self.locations)} locations from CSV")
            print(f"📊 Indexed: {len(self.by_country)} countries, {len(self.by_city)} cities, {len(self.by_category)} categories")
            print(f"🚀 Set-based indexes built for fast multi-filter queries")
            
        except Exception as e:
            print(f"❌ Error loading CSV: {e}")
            # Fallback to empty list
            self.locations = []

    def _get_cache_key(self, city: Optional[str], category: Optional[str], 
                       country: Optional[str], limit: Optional[int], offset: Optional[int]) -> str:
        """Generate cache key for query"""
        return f"{country or ''}:{city or ''}:{category or ''}:{limit or ''}:{offset or ''}"
    
    def _clear_cache_if_needed(self):
        """Clear cache if it exceeds max size"""
        if len(self._query_cache) > self._cache_max_size:
            # Clear half of the cache (simple LRU-like behavior)
            keys_to_remove = list(self._query_cache.keys())[:self._cache_max_size // 2]
            for key in keys_to_remove:
                del self._query_cache[key]

    def get_locations(
        self, 
        city: Optional[str] = None, 
        category: Optional[str] = None,
        country: Optional[str] = None,
        limit: Optional[int] = None,
        offset: Optional[int] = None
    ) -> List[Location]:
        """Get all locations with optional filters, limit, and offset for pagination
        Uses set intersection for multi-filter queries and caching for performance"""
        
        # Check cache first (only cache queries with filters)
        if city or category or country:
            cache_key = self._get_cache_key(city, category, country, limit, offset)
            if cache_key in self._query_cache:
                return self._query_cache[cache_key]
        
        # Use set intersection for multi-filter queries (much faster)
        result_ids = None
        
        if city:
            result_ids = self.id_sets_by_city.get(city.lower(), set()).copy()
        
        if country:
            country_ids = self.id_sets_by_country.get(country.lower(), set())
            result_ids = country_ids if result_ids is None else result_ids & country_ids
        
        if category:
            category_ids = self.id_sets_by_category.get(category.lower(), set())
            result_ids = category_ids if result_ids is None else result_ids & category_ids
        
        # Convert IDs back to Location objects
        if result_ids is not None:
            # Get locations in original order
            filtered_locations = [self.by_id[loc_id] for loc_id in result_ids if loc_id in self.by_id]
        else:
            filtered_locations = self.locations
        
        # Apply offset for pagination
        if offset is not None and offset > 0:
            filtered_locations = filtered_locations[offset:]
        
        # Apply limit if specified
        if limit is not None and limit > 0:
            filtered_locations = filtered_locations[:limit]
        
        # Cache the result (if using filters)
        if city or category or country:
            self._clear_cache_if_needed()
            cache_key = self._get_cache_key(city, category, country, limit, offset)
            self._query_cache[cache_key] = filtered_locations
        
        return filtered_locations

    def get_location_by_id(self, location_id: int) -> Optional[Location]:
        """Get a specific location by ID using index for O(1) lookup"""
        return self.by_id.get(location_id)
    
    def get_total_count(
        self,
        city: Optional[str] = None,
        category: Optional[str] = None,
        country: Optional[str] = None
    ) -> int:
        """Get total count of locations matching filters (for pagination)
        Uses set intersection for fast counting"""
        
        # Use set intersection for multi-filter counting (much faster)
        result_ids = None
        
        if city:
            result_ids = self.id_sets_by_city.get(city.lower(), set()).copy()
        
        if country:
            country_ids = self.id_sets_by_country.get(country.lower(), set())
            result_ids = country_ids if result_ids is None else result_ids & country_ids
        
        if category:
            category_ids = self.id_sets_by_category.get(category.lower(), set())
            result_ids = category_ids if result_ids is None else result_ids & category_ids
        
        if result_ids is not None:
            return len(result_ids)
        
        return len(self.locations)

    def create_location(self, location_data: LocationCreate) -> Location:
        """Create a new location"""
        new_location = Location(
            id=self.next_id,
            **location_data.model_dump()
        )
        self.locations.append(new_location)
        self.next_id += 1
        return new_location

    def get_all_cities(self, country: Optional[str] = None) -> List[str]:
        """Get list of unique cities, optionally filtered by country"""
        locations = self.locations
        if country:
            locations = [loc for loc in locations if loc.country.lower() == country.lower()]
        cities = list(set(loc.city for loc in locations))
        return sorted(cities)

    def get_all_categories(self) -> List[str]:
        """Get list of unique categories"""
        categories = list(set(loc.category for loc in self.locations))
        return sorted(categories)
    
    def get_all_countries(self) -> List[str]:
        """Get list of unique countries"""
        countries = list(set(loc.country for loc in self.locations))
        return sorted(countries)
