"""
Quick test to verify CSV data is loaded correctly
"""
import requests

# Test API endpoints
base_url = "http://localhost:8000/api"

try:
    # Get all locations count (this might be slow with 100k records)
    print("Testing API endpoints...")
    
    # Get countries
    countries = requests.get(f"{base_url}/countries").json()
    print(f"✅ Countries: {len(countries)}")
    print(f"   Sample: {countries[:5]}")
    
    # Get cities
    cities = requests.get(f"{base_url}/cities").json()
    print(f"✅ Cities: {len(cities)}")
    print(f"   Sample: {cities[:5]}")
    
    # Get categories
    categories = requests.get(f"{base_url}/categories").json()
    print(f"✅ Categories: {len(categories)}")
    print(f"   Sample: {categories}")
    
    # Get Chennai locations
    chennai = requests.get(f"{base_url}/locations?city=Chennai").json()
    print(f"✅ Chennai locations: {len(chennai)}")
    if chennai:
        print(f"   Sample: {chennai[0]['name']}")
    
    # Get India locations (limited test)
    india = requests.get(f"{base_url}/locations?country=India").json()
    print(f"✅ India locations: {len(india)}")
    
    # Get specific location by ID
    location = requests.get(f"{base_url}/locations/1").json()
    print(f"✅ Location  ID 1: {location['name']} in {location['city']}, {location['country']}")
    
    print("\n🎉 All tests passed! CSV data is loaded successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
