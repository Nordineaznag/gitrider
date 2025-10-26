# Google Maps Integration Guide

This guide will help you set up and use Google Maps in your RideUp application.

## 📋 Prerequisites

- Google Cloud Platform account
- Credit card (required for Google Cloud, but you get $200 free credits)
- Node.js and npm installed

## 🚀 Quick Start

### Step 1: Get Your Google Maps API Key

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Click "Select a project" → "New Project"
   - Enter project name (e.g., "RideUp") and click "Create"

2. **Enable Required APIs**
   - In the sidebar, go to **APIs & Services** → **Library**
   - Search for and enable the following APIs:
     - ✅ **Maps JavaScript API** (required for map display)
     - ✅ **Places API** (required for location search/autocomplete)
     - ✅ **Directions API** (required for route planning)
     - ✅ **Geocoding API** (required for address conversion)
     - ✅ **Geolocation API** (optional, for IP-based location)

3. **Create API Key**
   - Go to **APIs & Services** → **Credentials**
   - Click **+ CREATE CREDENTIALS** → **API key**
   - Copy the API key that appears

4. **Restrict Your API Key** (IMPORTANT for security)
   - Click on the API key you just created
   - Under "Application restrictions":
     - Select **HTTP referrers (web sites)**
     - Add your domains:
       - `localhost:3000/*` (for development)
       - `localhost:*/*` (for development)
       - `yourdomain.com/*` (for production)
       - `*.yourdomain.com/*` (for production subdomains)
   - Under "API restrictions":
     - Select **Restrict key**
     - Select only the APIs you enabled above
   - Click **Save**

### Step 2: Add API Key to Your Project

1. **Create or update `.env.local`** in your project root:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

2. **Restart your development server**:
   ```bash
   npm run dev
   ```

3. **Verify the key is working** by navigating to any page with a map component

## 📦 Installed Packages

The following package has been installed:
- `@googlemaps/js-api-loader` - Official Google Maps JavaScript API loader

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

Complete location picker with autocomplete search.

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
- 🔍 Address autocomplete search
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

## 🎨 Customization Examples

### Change Map Style (Dark Mode)

```tsx
// In map-component.tsx, modify the styles array:
styles: [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  // ... more styles
]
```

### Custom Marker Icons

```tsx
const marker = new google.maps.Marker({
  position: { lat, lng },
  map: googleMapRef.current,
  icon: {
    url: '/path/to/custom-icon.png',
    scaledSize: new google.maps.Size(40, 40),
  },
});
```

### Add Traffic Layer

```tsx
const trafficLayer = new google.maps.TrafficLayer();
trafficLayer.setMap(googleMapRef.current);
```

### Add Transit Layer

```tsx
const transitLayer = new google.maps.TransitLayer();
transitLayer.setMap(googleMapRef.current);
```

## 💰 Pricing & Costs

Google Maps APIs operate on a pay-as-you-go model:

- **Maps JavaScript API**: $7 per 1,000 loads (first 28,000/month free)
- **Directions API**: $5 per 1,000 requests (first 40,000 elements free)
- **Places API (Autocomplete)**: $2.83 per 1,000 requests (first 40,000/month free)
- **Geocoding API**: $5 per 1,000 requests (first 40,000/month free)

**Free Tier**: $200 credit per month covers approximately:
- 28,000 map loads
- 40,000 directions requests
- 70,000 autocomplete requests

[View full pricing](https://mapsplatform.google.com/pricing/)

## 🔒 Security Best Practices

1. **Never commit API keys to Git**
   - Always use `.env.local` for sensitive data
   - The `.gitignore` file already excludes `.env*.local`

2. **Always restrict your API key**
   - Use HTTP referrer restrictions
   - Enable only required APIs
   - Never use unrestricted keys in production

3. **Monitor usage**
   - Set up billing alerts in Google Cloud Console
   - Review API usage regularly
   - Set quotas to prevent unexpected charges

4. **Use environment variables**
   - Development: `.env.local`
   - Production: Use your hosting provider's environment variables
   - Never hardcode API keys in source code

## 🐛 Troubleshooting

### Map not loading

**Problem**: Map shows placeholder or error message

**Solutions**:
1. Verify API key is correct in `.env.local`
2. Restart dev server after adding API key
3. Check browser console for errors
4. Verify APIs are enabled in Google Cloud Console
5. Check API key restrictions (referrer URLs)

### "RefererNotAllowedMapError"

**Problem**: Console shows referrer error

**Solution**: 
- Add your domain to API key's HTTP referrer restrictions
- For localhost: Add `localhost:3000/*` and `localhost:*/*`

### Autocomplete not working

**Problem**: Location search doesn't show suggestions

**Solutions**:
1. Verify **Places API** is enabled
2. Check API key has Places API in restrictions
3. Clear browser cache
4. Check network tab for API call errors

### Directions not showing

**Problem**: Route doesn't appear between points

**Solutions**:
1. Verify **Directions API** is enabled
2. Check both origin and destination are valid
3. Ensure `showDirections={true}` is set
4. Check console for API errors

## 📚 Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API Documentation](https://developers.google.com/maps/documentation/directions)
- [Styling Maps](https://developers.google.com/maps/documentation/javascript/styling)
- [Custom Markers](https://developers.google.com/maps/documentation/javascript/markers)

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for errors
2. Verify API key and enabled APIs
3. Review the troubleshooting section above
4. Check Google Maps API status: https://status.cloud.google.com/

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
        <RideRouteMap
          pickup={pickup}
          destination={destination}
        />
      )}

      <Button disabled={!pickup || !destination}>
        Book Ride
      </Button>
    </div>
  );
}
```

---

**Last Updated**: 2024
**Package Version**: @googlemaps/js-api-loader ^1.16.0