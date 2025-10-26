# 🗺️ Google Maps Integration - Complete Setup Guide

## ✅ What's Been Installed

Your RideUp application now has full Google Maps integration with the following features:

### 📦 Packages Installed
- `@googlemaps/js-api-loader@2.0.1` - Official Google Maps JavaScript API loader

### 🎨 Components Created
1. **MapComponent** (`components/map/map-component.tsx`)
   - Basic interactive map with markers
   - Click-to-select location
   - Route directions display
   - Customizable zoom and center

2. **LocationPicker** (`components/map/location-picker.tsx`)
   - Address search with autocomplete
   - "Use my current location" feature
   - Click on map to select
   - Reverse geocoding (coordinates → address)

3. **RideRouteMap** (`components/map/ride-route-map.tsx`)
   - Route visualization between pickup and destination
   - Distance and duration calculation
   - Estimated fare display
   - Detailed route information

### 📄 Documentation Created
- `GOOGLE_MAPS_SETUP.md` - Comprehensive setup and usage guide
- `MAPS_QUICK_REFERENCE.md` - Quick reference for developers
- `README_GOOGLE_MAPS.md` - This file

### 🧪 Demo Page
- `/app/map-demo/page.tsx` - Interactive demo of all features
- Access at: `http://localhost:3000/map-demo`

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Get Your API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - ✅ Maps JavaScript API
   - ✅ Places API
   - ✅ Directions API
   - ✅ Geocoding API
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy your API key

### Step 2: Configure Your Project

1. Open or create `.env.local` in your project root:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

2. **Important**: Replace `your_api_key_here` with your actual API key

### Step 3: Secure Your API Key

1. In Google Cloud Console, click your API key
2. Under **Application restrictions**:
   - Select "HTTP referrers (web sites)"
   - Add:
     - `localhost:3000/*`
     - `localhost:*/*`
     - `yourdomain.com/*` (for production)
3. Under **API restrictions**:
   - Select "Restrict key"
   - Select only the 4 APIs listed above
4. Click **Save**

### Step 4: Restart Development Server

```bash
npm run dev
```

### Step 5: Test the Integration

Visit `http://localhost:3000/map-demo` to test all features!

---

## 💡 Basic Usage Examples

### 1. Display a Simple Map

```tsx
import { MapComponent } from '@/components/map/map-component';

export function MyComponent() {
  return (
    <MapComponent
      center={{ lat: 40.7128, lng: -74.0060 }}
      markers={[
        { lat: 40.7128, lng: -74.0060, label: 'A', title: 'My Location' }
      ]}
      zoom={13}
      className="h-[400px]"
    />
  );
}
```

### 2. Let Users Pick a Location

```tsx
import { LocationPicker } from '@/components/map/location-picker';

export function PickLocation() {
  const handleLocationSelect = (location) => {
    console.log('Selected:', location.lat, location.lng, location.address);
  };

  return (
    <LocationPicker
      label="Where should we pick you up?"
      onLocationSelect={handleLocationSelect}
    />
  );
}
```

### 3. Show a Ride Route

```tsx
import { RideRouteMap } from '@/components/map/ride-route-map';

export function ShowRoute() {
  return (
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
  );
}
```

### 4. Complete Booking Flow

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
        <>
          <RideRouteMap
            pickup={pickup}
            destination={destination}
          />
          
          <Button className="w-full">
            Book This Ride
          </Button>
        </>
      )}
    </div>
  );
}
```

---

## 🛠️ Component Props Reference

### MapComponent

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `center` | `{lat: number, lng: number}` | NYC | Map center coordinates |
| `markers` | `Array<{lat, lng, label?, title?}>` | `[]` | Markers to display |
| `zoom` | `number` | `13` | Zoom level (1-20) |
| `showDirections` | `boolean` | `false` | Show route between points |
| `origin` | `{lat: number, lng: number}` | - | Route starting point |
| `destination` | `{lat: number, lng: number}` | - | Route ending point |
| `onLocationSelect` | `(location) => void` | - | Called when map is clicked |
| `className` | `string` | - | CSS classes |

### LocationPicker

| Prop | Type | Description |
|------|------|-------------|
| `onLocationSelect` | `(location) => void` | Callback with {lat, lng, address?} |
| `initialLocation` | `{lat, lng}` | Starting location |
| `label` | `string` | Input label |
| `placeholder` | `string` | Input placeholder |

### RideRouteMap

| Prop | Type | Description |
|------|------|-------------|
| `pickup` | `{lat, lng, address?}` | Pickup location |
| `destination` | `{lat, lng, address?}` | Destination location |
| `showDetails` | `boolean` | Show distance/duration/fare |
| `className` | `string` | CSS classes |

---

## 🐛 Troubleshooting

### Map Not Loading?

**Check these things:**

1. ✅ API key is in `.env.local` (not `.env`)
2. ✅ API key doesn't have quotes around it
3. ✅ Restart dev server after adding API key
4. ✅ Clear browser cache (Ctrl+Shift+R / Cmd+Shift+R)
5. ✅ Check browser console for errors

### Getting "RefererNotAllowedMapError"?

**Solution:** Add your domain to API key restrictions in Google Cloud Console
- Development: `localhost:3000/*` and `localhost:*/*`
- Production: `yourdomain.com/*`

### Autocomplete Not Working?

**Check:**
1. ✅ Places API is enabled in Google Cloud Console
2. ✅ API key has Places API in restrictions
3. ✅ Wait 2-3 minutes after enabling (propagation time)

### Directions Not Showing?

**Check:**
1. ✅ Directions API is enabled
2. ✅ `showDirections={true}` prop is set
3. ✅ Both `origin` and `destination` props are provided

### API Key Error Messages?

| Error Message | Solution |
|---------------|----------|
| "API key not configured" | Add key to `.env.local` and restart |
| "RefererNotAllowedMapError" | Add domain to HTTP referrers |
| "ApiNotActivatedMapError" | Enable required APIs in Console |
| "REQUEST_DENIED" | Check API restrictions |

---

## 💰 Pricing Information

### Free Tier (Monthly)
- **$200 free credit** every month
- Covers approximately:
  - 28,000 map loads
  - 40,000 directions requests
  - 70,000 autocomplete requests
  - 40,000 geocoding requests

### Cost After Free Tier
- Maps JavaScript API: $7 per 1,000 loads
- Directions API: $5 per 1,000 requests
- Places API Autocomplete: $2.83 per 1,000 requests
- Geocoding API: $5 per 1,000 requests

**For most small to medium apps, the free tier is sufficient!**

[View detailed pricing →](https://mapsplatform.google.com/pricing/)

---

## 🔒 Security Best Practices

### ✅ DO:
- Store API key in `.env.local` (already in `.gitignore`)
- Use HTTP referrer restrictions
- Enable only required APIs
- Set up billing alerts
- Use different keys for dev/staging/production
- Monitor usage regularly

### ❌ DON'T:
- Commit API keys to version control
- Use unrestricted API keys
- Share API keys publicly
- Hardcode API keys in source code
- Use production keys in development

---

## 📊 API Usage Monitoring

### Set Up Billing Alerts

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **Billing** → **Budgets & alerts**
3. Click **Create Budget**
4. Set threshold: $50 (or your preference)
5. Add your email for notifications

### Check Usage

1. Go to **APIs & Services** → **Dashboard**
2. Select your API (Maps JavaScript, etc.)
3. View usage metrics and quotas

---

## 🎨 Customization Tips

### Dark Mode Map Style

```tsx
// Add to MapComponent initialization
styles: [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
]
```

### Custom Marker Icons

```tsx
const marker = new google.maps.Marker({
  position: { lat, lng },
  icon: {
    url: '/path/to/icon.png',
    scaledSize: new google.maps.Size(40, 40),
  },
});
```

### Add Traffic Layer

```tsx
const trafficLayer = new google.maps.TrafficLayer();
trafficLayer.setMap(map);
```

---

## 📚 Additional Resources

### Official Documentation
- [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Directions API](https://developers.google.com/maps/documentation/directions)
- [Geocoding API](https://developers.google.com/maps/documentation/geocoding)

### Tools
- [Map Styling Wizard](https://mapstyle.withgoogle.com/)
- [Pricing Calculator](https://mapsplatform.google.com/pricing/)
- [API Status Dashboard](https://status.cloud.google.com/)

### Project Documentation
- `GOOGLE_MAPS_SETUP.md` - Detailed setup guide
- `MAPS_QUICK_REFERENCE.md` - Quick reference for developers
- `/map-demo` - Interactive demo page

---

## 🎯 Next Steps

1. ✅ Get your Google Maps API key
2. ✅ Add it to `.env.local`
3. ✅ Set up API restrictions
4. ✅ Test at `/map-demo`
5. ✅ Integrate into your booking flow
6. ✅ Set up billing alerts
7. ✅ Test on mobile devices
8. ✅ Deploy to production

---

## 🚨 Production Deployment Checklist

Before deploying to production:

- [ ] Use production API key (not development key)
- [ ] Add production domain to HTTP referrers
- [ ] Set up billing alerts
- [ ] Test all map features on production
- [ ] Monitor API usage for first week
- [ ] Have error tracking in place
- [ ] Test on mobile devices
- [ ] Check loading performance
- [ ] Verify API key restrictions
- [ ] Document any customizations

---

## 💬 Need Help?

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review `GOOGLE_MAPS_SETUP.md` for detailed instructions
3. Visit the demo page: `/map-demo`
4. Check browser console for error messages
5. Verify API key is correct and APIs are enabled

---

## 📝 Summary

You now have a complete Google Maps integration with:
- ✅ Interactive maps with markers
- ✅ Location search with autocomplete
- ✅ Route planning and directions
- ✅ Distance and duration calculation
- ✅ Fare estimation
- ✅ Responsive mobile design
- ✅ Dark mode support
- ✅ Comprehensive documentation

**Start testing at:** `http://localhost:3000/map-demo`

**Happy mapping! 🗺️**