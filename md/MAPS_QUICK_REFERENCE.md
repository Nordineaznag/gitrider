# Google Maps Quick Reference Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Get API Key
```bash
# Visit: https://console.cloud.google.com/
# Enable: Maps JavaScript API, Places API, Directions API, Geocoding API
# Create: API Key
```

### 2. Add to `.env.local`
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyD...your_actual_key
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
| `zoom` | `number` | `13` | Zoom level (1-20) |
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

## 🐛 Troubleshooting

### Map Not Loading
```bash
✓ Check .env.local has API key
✓ Restart dev server: npm run dev
✓ Clear browser cache
✓ Check browser console for errors
```

### "RefererNotAllowedMapError"
```bash
✓ In Google Cloud Console → Credentials
✓ Click your API key
✓ Add HTTP referrer: localhost:3000/*
✓ Add HTTP referrer: localhost:*/*
```

### Autocomplete Not Working
```bash
✓ Enable "Places API" in Google Cloud Console
✓ Wait 2-3 minutes for changes to propagate
✓ Check API key restrictions include Places API
```

### Directions Not Showing
```bash
✓ Enable "Directions API" in Google Cloud Console
✓ Set showDirections={true}
✓ Provide both origin and destination props
```

---

## 💰 API Costs (Free Tier)

Monthly free usage (updated 2024):
- **28,000** map loads
- **40,000** directions requests
- **70,000** autocomplete requests
- **40,000** geocoding requests

**$200/month** free credit covers typical small-medium apps.

[View pricing →](https://mapsplatform.google.com/pricing/)

---

## 🔒 Security Checklist

- [ ] API key added to `.env.local` (not `.env`)
- [ ] `.env.local` in `.gitignore`
- [ ] HTTP referrers set in Google Cloud Console
- [ ] Only required APIs enabled in restrictions
- [ ] Billing alerts configured
- [ ] Different keys for dev/staging/production

---

## 📚 API Limits & Best Practices

### Rate Limits
- Maps: 30,000 loads/minute
- Directions: 50 requests/second
- Places: 1,000 requests/second

### Optimization Tips
```tsx
// ✓ Good: Memoize map center
const center = useMemo(() => ({ lat, lng }), [lat, lng]);

// ✓ Good: Debounce search input
const debouncedSearch = useMemo(
  () => debounce(handleSearch, 300),
  []
);

// ✗ Avoid: Creating new objects on every render
<MapComponent center={{ lat: 40.7128, lng: -74.0060 }} />

// ✓ Better: Define outside component
const CENTER = { lat: 40.7128, lng: -74.0060 };
<MapComponent center={CENTER} />
```

---

## 🎨 Customization Examples

### Dark Mode Map
```tsx
const darkMapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
];

// Add to map initialization in map-component.tsx
styles: darkMapStyles
```

### Custom Marker Icon
```tsx
const marker = new google.maps.Marker({
  position: { lat, lng },
  icon: {
    url: '/car-icon.png',
    scaledSize: new google.maps.Size(40, 40),
  },
});
```

### Add Traffic Layer
```tsx
const trafficLayer = new google.maps.TrafficLayer();
trafficLayer.setMap(googleMapRef.current);
```

---

## 📝 Example: Complete Booking Flow

```tsx
'use client';

import { useState } from 'react';
import { LocationPicker } from '@/components/map/location-picker';
import { RideRouteMap } from '@/components/map/ride-route-map';
import { Button } from '@/components/ui/button';

export function BookRideForm() {
  const [pickup, setPickup] = useState(null);
  const [destination, setDestination] = useState(null);

  const handleBookRide = async () => {
    const response = await fetch('/api/rides', {
      method: 'POST',
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
          
          <Button onClick={handleBookRide}>
            Confirm Booking
          </Button>
        </>
      )}
    </div>
  );
}
```

---

## 🔗 Useful Links

- [Google Cloud Console](https://console.cloud.google.com/)
- [Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [Places API Docs](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API Docs](https://developers.google.com/maps/documentation/directions)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [Map Styling Wizard](https://mapstyle.withgoogle.com/)

---

## 🎯 Testing Checklist

Before deploying to production:

- [ ] Test map loads correctly
- [ ] Test location search/autocomplete
- [ ] Test route directions display
- [ ] Test on mobile devices
- [ ] Test with slow network
- [ ] Test API key restrictions
- [ ] Test error states (no API key, API disabled)
- [ ] Set up monitoring/alerts
- [ ] Configure production API key
- [ ] Test billing alerts trigger

---

**Last Updated**: 2024
**Package**: @googlemaps/js-api-loader v1.16.0
**Next.js**: 13.5.1+

For detailed documentation, see `GOOGLE_MAPS_SETUP.md`
