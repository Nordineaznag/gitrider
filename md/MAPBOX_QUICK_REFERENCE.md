# Mapbox Quick Reference Guide

## 🚀 Quick Setup (3 Minutes)

### 1. Get Access Token
```bash
# Visit: https://account.mapbox.com/
# Sign up (free)
# Go to: Access Tokens
# Create token with all scopes
```

### 2. Add to `.env.local`
```bash
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4In0.xxx
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Test
Navigate to: `http://localhost:3000/map-demo`

---

## 📦 Components Usage

### Basic Map
```tsx
import { MapComponent } from '@/components/map/map-component';

<MapComponent
  center={{ lat: 40.7128, lng: -74.0060 }}
  markers={[
    { lat: 40.7128, lng: -74.0060, label: 'A', title: 'Location' }
  ]}
  zoom={13}
  className="h-[400px]"
/>
```

### Location Picker (Search + Map)
```tsx
import { LocationPicker } from '@/components/map/location-picker';

<LocationPicker
  onLocationSelect={(location) => {
    console.log(location.lat, location.lng, location.address);
  }}
  label="Select Location"
/>
```

### Route with Directions
```tsx
import { RideRouteMap } from '@/components/map/ride-route-map';

<RideRouteMap
  pickup={{ lat: 40.7128, lng: -74.0060, address: "Times Square" }}
  destination={{ lat: 40.7589, lng: -73.9851, address: "Central Park" }}
  showDetails={true}
/>
```

---

## 🔧 Props Reference

### MapComponent Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `{lat, lng}` | NYC | Map center point |
| `markers` | `Array` | `[]` | Markers to display |
| `zoom` | `number` | `13` | Zoom level (0-22) |
| `showDirections` | `boolean` | `false` | Show route |
| `origin` | `{lat, lng}` | - | Route start point |
| `destination` | `{lat, lng}` | - | Route end point |
| `onLocationSelect` | `function` | - | Click handler |
| `className` | `string` | - | CSS classes |

### LocationPicker Props
| Prop | Type | Description |
|------|------|-------------|
| `onLocationSelect` | `(location) => void` | Callback with selected location |
| `initialLocation` | `{lat, lng}` | Starting location |
| `label` | `string` | Input label |
| `placeholder` | `string` | Input placeholder |

### RideRouteMap Props
| Prop | Type | Description |
|------|------|-------------|
| `pickup` | `{lat, lng, address?}` | Pickup location |
| `destination` | `{lat, lng, address?}` | Destination |
| `showDetails` | `boolean` | Show distance/duration |
| `className` | `string` | CSS classes |

---

## 💡 Common Use Cases

### 1. Select Pickup Location
```tsx
const [pickup, setPickup] = useState(null);

<LocationPicker
  label="Where should we pick you up?"
  onLocationSelect={setPickup}
/>
```

### 2. Show Ride Route
```tsx
{pickup && destination && (
  <RideRouteMap
    pickup={pickup}
    destination={destination}
  />
)}
```

### 3. Track Driver Location
```tsx
<MapComponent
  center={driverLocation}
  markers={[
    { ...driverLocation, label: '🚗', title: 'Driver' },
    { ...pickupLocation, label: 'A', title: 'Pickup' }
  ]}
  zoom={15}
/>
```

### 4. Get Current Location
```tsx
const handleUseCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    setPickup(location);
  });
};
```

---

## 🎨 Map Styles

Available pre-built styles:

```tsx
// In MapComponent, change style property:
"mapbox://styles/mapbox/streets-v12"           // Streets (default)
"mapbox://styles/mapbox/light-v11"             // Light
"mapbox://styles/mapbox/dark-v11"              // Dark
"mapbox://styles/mapbox/outdoors-v12"          // Outdoors
"mapbox://styles/mapbox/satellite-v9"          // Satellite
"mapbox://styles/mapbox/satellite-streets-v12" // Hybrid
"mapbox://styles/mapbox/navigation-day-v1"     // Navigation Day
"mapbox://styles/mapbox/navigation-night-v1"   // Navigation Night
```

### Custom Style
```tsx
// Create in Mapbox Studio: https://studio.mapbox.com/
"mapbox://styles/your-username/your-style-id"
```

---

## 🐛 Troubleshooting

### Map Not Loading
```bash
✓ Check .env.local has access token
✓ Token starts with 'pk.'
✓ Restart dev server: npm run dev
✓ Clear browser cache
✓ Check browser console for errors
```

### "Unauthorized" Error
```bash
✓ Token is valid and not expired
✓ Token copied completely
✓ Create new token in Mapbox dashboard
```

### Search Not Working
```bash
✓ Wait for debounce (300ms)
✓ Type at least 3 characters
✓ Check network tab for API errors
✓ Verify token has proper scopes
```

### Directions Not Showing
```bash
✓ Both origin and destination provided
✓ Set showDirections={true}
✓ Points are routable (not in ocean)
✓ Check console for errors
```

---

## 💰 Free Tier Limits

**Monthly free usage:**
- **50,000** map loads (web)
- **100,000** geocoding requests
- **Unlimited** directions (non-commercial)
- **Unlimited** static maps

**This is MORE generous than Google Maps!**

After free tier:
- Map loads: $5 per 1,000
- Geocoding: $0.50 per 1,000
- Directions: $5 per 1,000

[View pricing →](https://www.mapbox.com/pricing)

---

## 🔒 Security Checklist

- [ ] Access token added to `.env.local` (not `.env`)
- [ ] `.env.local` in `.gitignore`
- [ ] URL restrictions set (production only)
- [ ] Monitor usage in dashboard
- [ ] Different tokens for dev/staging/production

---

## 🎨 Customization Examples

### Dark Mode Toggle
```tsx
const mapStyle = theme === 'dark' 
  ? 'mapbox://styles/mapbox/dark-v11'
  : 'mapbox://styles/mapbox/light-v11';

<MapComponent
  center={center}
  // Pass style to map initialization
/>
```

### Custom Marker
```tsx
const el = document.createElement('div');
el.innerHTML = '🚗';
el.style.fontSize = '32px';

const marker = new mapboxgl.Marker(el)
  .setLngLat([lng, lat])
  .addTo(map);
```

### Add Popup
```tsx
const popup = new mapboxgl.Popup({ offset: 25 })
  .setText('Your location')
  .setLngLat([lng, lat])
  .addTo(map);
```

### 3D Buildings
```tsx
map.on('load', () => {
  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'min_height'],
      'fill-extrusion-opacity': 0.6
    }
  });
});
```

---

## 📚 API Endpoints

### Geocoding (Search)
```
GET https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json
    ?access_token={token}
    &autocomplete=true
    &limit=5
```

### Reverse Geocoding
```
GET https://api.mapbox.com/geocoding/v5/mapbox.places/{lng},{lat}.json
    ?access_token={token}
```

### Directions
```
GET https://api.mapbox.com/directions/v5/mapbox/driving/{lng},{lat};{lng},{lat}
    ?access_token={token}
    &geometries=geojson
```

---

## 🆚 Mapbox vs Google Maps

### Why Mapbox?

✅ **More generous free tier**
- 50k map loads vs 28k (Google)
- 100k geocoding vs 40k (Google)

✅ **Better customization**
- More pre-built styles
- Easier custom styling
- 3D support out of box

✅ **Better performance**
- Vector tiles (faster)
- Smoother animations

✅ **Lower costs**
- Cheaper after free tier
- Unlimited directions (non-commercial)

✅ **Developer friendly**
- Simpler API
- Better documentation
- Open source friendly

### When to use Google Maps?

- Need extensive business data
- Need Street View
- Need indoor maps
- Enterprise support required

---

## 📝 Complete Booking Example

```tsx
'use client';

import { useState } from 'react';
import { LocationPicker } from '@/components/map/location-picker';
import { RideRouteMap } from '@/components/map/ride-route-map';
import { Button } from '@/components/ui/button';

export function BookRideForm() {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBookRide = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/rides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pickup_latitude: pickup.lat,
          pickup_longitude: pickup.lng,
          pickup_address: pickup.address,
          dropoff_latitude: destination.lat,
          dropoff_longitude: destination.lng,
          dropoff_address: destination.address,
        }),
      });
      
      const data = await response.json();
      // Handle success
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <LocationPicker
        label="Pickup Location"
        placeholder="Where should we pick you up?"
        onLocationSelect={setPickup}
      />
      
      <LocationPicker
        label="Destination"
        placeholder="Where are you going?"
        onLocationSelect={setDestination}
      />

      {pickup && destination && (
        <>
          <RideRouteMap
            pickup={pickup}
            destination={destination}
            showDetails={true}
          />
          
          <Button 
            onClick={handleBookRide}
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </>
      )}
    </div>
  );
}
```

---

## 🔗 Useful Links

- [Mapbox Account](https://account.mapbox.com/)
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Geocoding API Docs](https://docs.mapbox.com/api/search/geocoding/)
- [Directions API Docs](https://docs.mapbox.com/api/navigation/directions/)
- [Mapbox Studio](https://studio.mapbox.com/) - Create custom styles
- [Examples](https://docs.mapbox.com/mapbox-gl-js/example/)
- [Pricing](https://www.mapbox.com/pricing/)
- [Status Dashboard](https://status.mapbox.com/)

---

## 🎯 Testing Checklist

Before deploying:

- [ ] Map loads correctly
- [ ] Location search works
- [ ] Route directions display
- [ ] Mobile responsive
- [ ] Works on slow network
- [ ] Token restrictions set
- [ ] Error states handled
- [ ] Usage monitoring setup
- [ ] Production token configured
- [ ] Performance optimized

---

## ⚡ Performance Tips

1. **Lazy load map** - Only load when needed
2. **Debounce search** - 300ms delay
3. **Cache results** - Store recent searches
4. **Minimize re-renders** - Use useMemo
5. **Optimize markers** - Cluster for 100+
6. **Preload styles** - Load map style early

---

**Last Updated**: 2024
**Packages**: mapbox-gl, @mapbox/mapbox-gl-geocoder, react-map-gl
**Next.js**: 13.5.1+

For detailed documentation, see `MAPBOX_SETUP.md`
