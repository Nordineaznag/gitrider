# 🗺️ Mapbox Integration Setup Guide

## 🚀 Quick Setup

### 1. **Get Mapbox Access Token**

1. **Create Mapbox Account:**
   - Go to [account.mapbox.com](https://account.mapbox.com/)
   - Sign up for a free account
   - Verify your email address

2. **Create Access Token:**
   - Go to [account.mapbox.com/access-tokens](https://account.mapbox.com/access-tokens)
   - Click "Create a token"
   - Name it "GitRide Android"
   - Set scopes: `styles:read`, `fonts:read`, `datasets:read`
   - Copy the token

### 2. **Configure Project**

1. **Update `local.properties`:**
   ```properties
   MAPBOX_ACCESS_TOKEN=pk.your_mapbox_token_here
   ```

2. **Update `AndroidManifest.xml`:**
   ```xml
   <meta-data
       android:name="com.mapbox.token"
       android:value="${MAPBOX_ACCESS_TOKEN}" />
   ```

### 3. **Test Integration**

1. **Build and run the app**
2. **Open ride booking screen**
3. **Verify map loads correctly**
4. **Test location services**

## 🎯 Mapbox Features

### **Interactive Maps:**
- ✅ **High-performance rendering**
- ✅ **Smooth zoom and pan**
- ✅ **Custom map styles**
- ✅ **Offline map support**

### **Location Services:**
- ✅ **GPS tracking**
- ✅ **Geocoding (address ↔ coordinates)**
- ✅ **Reverse geocoding**
- ✅ **Route calculation**

### **Navigation:**
- ✅ **Turn-by-turn directions**
- ✅ **Real-time traffic**
- ✅ **Route optimization**
- ✅ **Voice guidance**

## 🔧 Configuration

### **Map Styles:**
```kotlin
// Available styles
Style.MAPBOX_STREETS      // Default street map
Style.OUTDOORS            // Outdoor activities
Style.LIGHT               // Light theme
Style.DARK                // Dark theme
Style.SATELLITE           // Satellite imagery
Style.SATELLITE_STREETS   // Satellite with streets
```

### **Location Tracking:**
```kotlin
// Enable location tracking
mapView.getMapboxMap().loadStyleUri(Style.MAPBOX_STREETS) { style ->
    val locationComponent = mapView.locationComponent
    locationComponent.activateLocationComponent(
        LocationComponentActivationOptions.builder(context, style)
            .useDefaultLocationEngine(false)
            .build()
    )
    locationComponent.isLocationComponentEnabled = true
    locationComponent.cameraMode = CameraMode.TRACKING
    locationComponent.renderMode = RenderMode.COMPASS
}
```

## 📱 Usage Examples

### **Basic Map:**
```kotlin
@Composable
fun BasicMap() {
    MapboxMapComponent(
        modifier = Modifier.fillMaxSize(),
        onMapReady = { /* Map is ready */ }
    )
}
```

### **Map with Markers:**
```kotlin
@Composable
fun MapWithMarkers() {
    MapboxMapComponent(
        pickupLocation = Location(40.7128, -74.0060, "New York"),
        dropoffLocation = Location(40.7589, -73.9851, "Times Square"),
        onLocationSelected = { location -> /* Handle selection */ }
    )
}
```

## 🚨 Troubleshooting

### **Map Not Loading:**
- Check Mapbox access token is correct
- Verify internet connection
- Check token permissions

### **Location Not Working:**
- Grant location permissions
- Check GPS is enabled
- Verify location services

### **Route Calculation Fails:**
- Check internet connection
- Verify coordinates are valid
- Check token has routing permissions

## 📊 Performance Benefits

### **Mapbox vs Google Maps:**
- ⚡ **Faster rendering** (60fps)
- 💾 **Lower memory usage**
- 🔋 **Better battery life**
- 📱 **Smoother animations**
- 🌐 **Better offline support**

## 🎯 Success Criteria

- ✅ **Map loads without errors**
- ✅ **Location services work**
- ✅ **Route calculation works**
- ✅ **Markers display correctly**
- ✅ **Smooth user interaction**

---

**Ready to use Mapbox?** Follow the setup steps above and enjoy high-performance interactive maps! 🗺️
