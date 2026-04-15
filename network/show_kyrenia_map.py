"""Display Kyrenia city center map from OpenStreetMap."""

import os
import folium

# Kyrenia city center coordinates
KYRENIA_CENTER = (35.3360, 33.3180)  # Lat, Lon

# Bounding box for Kyrenia center
BOUNDS = [
    [35.3200, 33.3000],  # SW corner
    [35.3450, 33.3350]   # NE corner
]

# Create map
kyrenia_map = folium.Map(
    location=KYRENIA_CENTER,
    zoom_start=14,
    tiles="OpenStreetMap"
)

# Add bounding box
folium.Rectangle(
    bounds=BOUNDS,
    color="red",
    weight=2,
    fill=False,
    popup="Kyrenia Center Study Area"
).add_to(kyrenia_map)

# Add markers for key locations
locations = [
    {
        "coords": [35.3365, 33.3170],
        "name": "Kyrenia Harbor",
        "icon": folium.Icon(color="blue", icon="anchor", prefix="fa")
    },
    {
        "coords": [35.3370, 33.3220],
        "name": "Kyrenia Castle",
        "icon": folium.Icon(color="green", icon="tree-conifer", prefix="fa")
    },
    {
        "coords": [35.3350, 33.3150],
        "name": "Coastal Road (Main Artery)",
        "icon": folium.Icon(color="red", icon="road", prefix="fa")
    },
    {
        "coords": [35.3340, 33.3200],
        "name": "City Center / Downtown",
        "icon": folium.Icon(color="orange", icon="building", prefix="fa")
    },
]

for loc in locations:
    folium.Marker(
        location=loc["coords"],
        popup=loc["name"],
        icon=loc["icon"]
    ).add_to(kyrenia_map)

# Add fit bounds
kyrenia_map.fit_bounds(BOUNDS)

# Save map
pythonoutput_path = os.path.join(os.path.dirname(__file__), 'kyrenia_map.html')
kyrenia_map.save(pythonoutput_path)
print(f"Map saved to: {pythonoutput_path}")
print(f"\nOpen in browser: {pythonoutput_path}")
print(f"\nBounding Box: {BOUNDS}")
print(f"Center: {KYRENIA_CENTER}")
