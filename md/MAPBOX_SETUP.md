# Mapbox Integration Guide

This guide will help you set up and use Mapbox in your RideUp application.

## 📋 Prerequisites

- Mapbox account (free)
- Node.js and npm installed

## 🚀 Quick Start

### Step 1: Get Your Mapbox Access Token

1. **Create a Mapbox Account**
   - Go to [Mapbox](https://account.mapbox.com/auth/signup/)
   - Sign up for a free account

2. **Get Your Access Token**
   - After signing in, go to [Access Tokens](https://account.mapbox.com/access-tokens/)
   - Click **Create a token**
   - Give it a name (e.g., "RideUp Development")
   - Select all scopes or at minimum:
     - ✅ `styles:tiles` - Read styles and tiles
     - ✅ `styles:read` - Read styles
     - ✅ `fonts:read` - Read fonts
     - ✅ `datasets:read` - Read datasets
     - ✅ `vision:read` - Read vision
   - Under **URL restrictions**, you can add your domains (optional for development)
   - Click **Create token**
   - Copy your access token

### Step 2: Add Access Token to Your Project

1. **Create or update `.env.local`** in your project root:
   ```bash
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEiOiJjbHh4eHh4eHh4In0.xxxxxxxxxx
   ```

2. **Important**: Replace with your actual access token (starts with `pk.`)

### Step 3: Restart Development Server

```bash
npm run dev
```

### Step 4: Test the Integration

Visit `http://localhost:3000/map-demo` to test all features!

---

## 📦 Installed Packages

The following packages have been installed:
- `mapbox-gl` - Mapbox GL JS library
- `@mapbox/mapbox-gl-geocoder` - Geocoding and search
- `react-map-gl` - React wrapper for Mapbox GL JS

---

## 🗺️ Components Available

### 1. MapComponent (Basic Map)

The core map component with customizable features.

**Usage:**
```tsx
import { MapComponent } from '@/components/map/map-component';

<MapComponent
  center={{ lat: 40.7128, lng: -74.0060 }}
  zoom={13}
  markers={[
    { lat: 40.7128, lng: -74.0060, label: 'A', title: 'Location A' }
  ]}
  onLocationSelect={(location) => console.log(location)}
  className="h-[400px]"
/>
```

**Props:**
- `center?: { lat: number; lng: number }` - Map center point
- `markers?: Array<{ lat, lng, label?, title? }>` - Markers to display
- `onLocationSelect?: (location) => void` - Callback when user clicks map
- `zoom?: number` - Zoom level (default: 13)
- `showDirections?: boolean` - Show route between origin and destination
- `origin?: { lat: number; lng: number }` - Starting point for directions
- `destination?: { lat: number; lng: number }` - End point for directions
- `className?: string` - Additional CSS classes

### 2. LocationPicker (Address Search + Map)

Complete location picker with geocoding search.

**Usage:**
```tsx
import { LocationPicker } from '@/components/map/location-picker';

<LocationPicker
  onLocationSelect={(location) => {
    console.log(location.lat, location.lng, location.address);
  }}
  label="Select Pickup Location"
  placeholder="Search for a location..."
  initialLocation={{ lat: 40.7128, lng: -74.0060 }}
/>
```

**Features:**
- 🔍 Address geocoding search
- 📍 Click on map to select location
- 🌐 Use current location button
- 🏷️ Reverse geocoding (converts coordinates to address)

### 3. RideRouteMap (Directions Display)

Shows route between pickup and destination with details.

**Usage:**
```tsx
import { RideRouteMap } from '@/components/map/ride-route-map';

<RideRouteMap
  pickup={{
    lat: 40.7128,
    lng: -74.0060,
    address: "Times Square, New York"
  }}
  destination={{
    lat: 40.7589,
    lng: -73.9851,
    address: "Central Park, New York"
  }}
  showDetails={true}
/>
```

**Features:**
- 🗺️ Visual route on map
- 📏 Distance calculation
- ⏱️ Duration estimate
- 💵 Estimated fare (customizable)
- 📍 Pickup and destination markers

---

## 🎨 Customization Examples

### Change Map Style

Mapbox offers various pre-built styles:

```tsx
// In map-component.tsx, change the style property:
style: "mapbox://styles/mapbox/dark-v11"        // Dark theme
style: "mapbox://styles/mapbox/light-v11"       // Light theme
style: "mapbox://styles/mapbox/streets-v12"     // Streets (default)
style: "mapbox://styles/mapbox/outdoors-v12"    // Outdoors
style: "mapbox://styles/mapbox/satellite-v9"    // Satellite
style: "mapbox://styles/mapbox/satellite-streets-v12" // Satellite with streets
```

### Custom Marker Icons

```tsx
const el = document.createElement('div');
el.className = 'custom-marker';
el.style.backgroundImage = 'url(/path/to/icon.png)';
el.style.width = '40px';
el.style.height = '40px';
el.style.backgroundSize = 'cover';

const marker = new mapboxgl.Marker(el)
  .setLngLat([lng, lat])
  .addTo(map);
```

### Add 3D Buildings

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

### Add Traffic Layer

```tsx
// Mapbox doesn't have built-in traffic layer in free tier
// You can add custom traffic data or use premium features
```

---

## 💰 Pricing & Costs

Mapbox operates on a pay-as-you-go model with a generous free tier:

### Free Tier (Monthly)
- **50,000 map loads** for web (free forever)
- **100,000 Geocoding API requests** (free forever)
- **Unlimited** static maps
- **Unlimited** Directions API requests (for non-commercial apps)

### Paid Tier (After Free Tier)
- **Map loads**: $5 per 1,000 loads
- **Geocoding**: $0.50 per 1,000 requests
- **Directions**: $5 per 1,000 requests

**For most small to medium apps, the free tier is more than sufficient!**

[View full pricing](https://www.mapbox.com/pricing)

---

## 🔒 Security Best Practices

1. **Never commit access tokens to Git**
   - Always use `.env.local` for sensitive data
   - The `.gitignore` file already excludes `.env*.local`

2. **Use URL restrictions (optional but recommended)**
   - Add your production domain to token restrictions
   - Development can use unrestricted tokens

3. **Monitor usage**
   - Check your [Mapbox account dashboard](https://account.mapbox.com/)
   - Set up usage alerts

4. **Use environment variables**
   - Development: `.env.local`
   - Production: Use your hosting provider's environment variables
   - Never hardcode tokens in source code

5. **Use different tokens for different environments**
   - Development token
   - Staging token
   - Production token

---

## 🐛 Troubleshooting

### Map not loading

**Problem**: Map shows placeholder or error message

**Solutions**:
1. Verify access token is correct in `.env.local`
2. Restart dev server after adding token
3. Check browser console for errors
4. Verify token starts with `pk.` (public token)
5. Check token hasn't expired

### "Unauthorized" Error

**Problem**: Console shows 401 Unauthorized

**Solution**: 
- Token is invalid or expired
- Generate a new token from Mapbox dashboard
- Make sure you copied the entire token

### Geocoding not working

**Problem**: Location search doesn't show suggestions

**Solutions**:
1. Verify token has proper scopes
2. Check network tab for API call errors
3. Verify internet connection
4. Check Mapbox [status page](https://status.mapbox.com/)

### Directions not showing

**Problem**: Route doesn't appear between points

**Solutions**:
1. Verify both origin and destination are valid
2. Ensure `showDirections={true}` is set
3. Check console for API errors
4. Verify points are routable (not in ocean, etc.)

### Map is blurry or pixelated

**Solution**:
- Mapbox automatically handles retina displays
- Check if you're zoomed in too much
- Try using a different map style

---

## 🆚 Mapbox vs Google Maps

### Advantages of Mapbox

✅ **More generous free tier**
- 50,000 free map loads vs 28,000 (Google)
- 100,000 free geocoding requests vs 40,000 (Google)

✅ **Better customization**
- More pre-built styles
- Easier to customize appearance
- 3D buildings and terrain

✅ **Lower cost after free tier**
- Generally cheaper for high-volume apps

✅ **Better performance**
- Vector tiles load faster
- Smoother animations

✅ **Open source friendly**
- Based on open standards
- Active community

### Disadvantages vs Google Maps

❌ **Less business data**
- Fewer place details
- Less comprehensive POI database

❌ **Smaller ecosystem**
- Fewer third-party integrations

❌ **Learning curve**
- Different API structure
- Less tutorials available

---

## 📚 Additional Resources

### Official Documentation
- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/guides/)
- [Geocoding API](https://docs.mapbox.com/api/search/geocoding/)
- [Directions API](https://docs.mapbox.com/api/navigation/directions/)
- [Style Specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/)

### Tools
- [Mapbox Studio](https://studio.mapbox.com/) - Create custom map styles
- [Playground](https://docs.mapbox.com/mapbox-gl-js/example/) - Interactive examples
- [Status Dashboard](https://status.mapbox.com/) - API status

### Tutorials
- [Getting Started Guide](https://docs.mapbox.com/help/getting-started/)
- [Tutorials](https://docs.mapbox.com/help/tutorials/)
- [Examples](https://docs.mapbox.com/mapbox-gl-js/example/)

---

## 🎯 Next Steps

1. ✅ Get your Mapbox access token
2. ✅ Add it to `.env.local`
3. ✅ Test at `/map-demo`
4. ✅ Integrate into your booking flow
5. ✅ Customize map style
6. ✅ Test on mobile devices
7. ✅ Deploy to production

---

## 📝 Example Integration in Ride Booking

```tsx
'use client';

import { useState } from 'react';
import { LocationPicker } from '@/components/map/location-picker';
import { RideRouteMap } from '@/components/map/ride-route-map';
import { Button } from '@/components/ui/button';

export function BookRide() {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);

  const handleBookRide = async () => {
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
    // Handle response...
  };

  return (
    <div className="space-y-6">
      <LocationPicker
        label="Pickup Location"
        onLocationSelect={setPickup}
      />
      
      <LocationPicker
        label="Destination"
        onLocationSelect={setDestination}
      />

      {pickup && destination && (
        <>
          <RideRouteMap
            pickup={pickup}
            destination={destination}
          />
          
          <Button onClick={handleBookRide} className="w-full">
            Confirm Booking
          </Button>
        </>
      )}
    </div>
  );
}
```

---

## 🚨 Production Deployment Checklist

Before deploying to production:

- [ ] Use production access token
- [ ] Add URL restrictions to token
- [ ] Set up usage alerts in Mapbox dashboard
- [ ] Test all map features on production
- [ ] Monitor API usage for first week
- [ ] Have error tracking in place
- [ ] Test on mobile devices
- [ ] Check loading performance
- [ ] Verify token restrictions
- [ ] Document any customizations

---

## 💬 API Endpoints Used

### Geocoding (Location Search)
```
GET https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json
```

### Reverse Geocoding (Coordinates to Address)
```
GET https://api.mapbox.com/geocoding/v5/mapbox.places/{lng},{lat}.json
```

### Directions (Route Planning)
```
GET https://api.mapbox.com/directions/v5/mapbox/driving/{lng},{lat};{lng},{lat}
```

All require `access_token` parameter.

---

## 🔧 Common Customizations

### Dark Mode Map

```tsx
// Automatically switch based on theme
const mapStyle = theme === 'dark' 
  ? 'mapbox://styles/mapbox/dark-v11'
  : 'mapbox://styles/mapbox/light-v11';
```

### Custom Color Scheme

Create your own style in [Mapbox Studio](https://studio.mapbox.com/) and use:
```tsx
style: 'mapbox://styles/your-username/your-style-id'
```

### Animated Marker

```tsx
const el = document.createElement('div');
el.className = 'animate-bounce';
el.innerHTML = '📍';
el.style.fontSize = '32px';

const marker = new mapboxgl.Marker(el)
  .setLngLat([lng, lat])
  .addTo(map);
```

---

## 📊 Performance Tips

1. **Lazy load map component** - Only load when needed
2. **Debounce geocoding requests** - Wait 300ms before searching
3. **Cache geocoding results** - Store recent searches
4. **Use vector tiles** - Already done by default
5. **Minimize marker updates** - Only update when changed
6. **Use clustering** - For many markers (100+)

---

## 📝 Summary

You now have a complete Mapbox integration with:
- ✅ Interactive maps with custom markers
- ✅ Location search with geocoding
- ✅ Route planning and directions
- ✅ Distance and duration calculation
- ✅ Fare estimation
- ✅ Responsive mobile design
- ✅ Customizable map styles
- ✅ More generous free tier than Google Maps

**Start testing at:** `http://localhost:3000/map-demo`

**Happy mapping! 🗺️**

---

**Last Updated**: 2024
**Mapbox GL JS Version**: Latest
**Next.js**: 13.5.1+