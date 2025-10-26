# GitRide - React Native Android App

Build a complete React Native Android ride-sharing app with the exact same features as the Next.js PWA version.

## Core Requirements

### Tech Stack
- React Native (latest stable)
- TypeScript
- React Navigation v6
- Supabase for backend (@supabase/supabase-js)
- React Native Maps (for map functionality)
- AsyncStorage for local storage
- React Native Geolocation Service

### App Structure

#### Authentication System
- Login screen with email/password
- Supabase authentication integration
- Auto-login with stored credentials
- User role detection (user/driver)

#### User Dashboard Features
1. **Ride Booking Component**
   - Pickup location picker with map
   - Dropoff location picker with map
   - Real-time fare estimation
   - Distance calculation (Haversine formula)
   - Estimated time calculation
   - Route visualization on map
   - Book ride button with loading state

2. **Active Rides Component**
   - Real-time ride status tracking
   - Driver information display
   - Live location tracking
   - Cancel ride option
   - Rate driver after completion

3. **Ride History Component**
   - List of completed rides
   - Ride details (date, fare, route)
   - Driver ratings
   - Pagination support

#### Driver Dashboard Features
1. **Available Rides Component**
   - List of requested rides nearby
   - Distance from driver to pickup
   - Estimated fare display
   - Accept ride button
   - Auto-refresh every 10 seconds

2. **Active Ride Component**
   - Current ride details
   - Navigation to pickup/dropoff
   - Start ride button
   - Complete ride button
   - Real-time location updates

3. **Driver Stats Component**
   - Total earnings today/week/month
   - Total rides completed
   - Average rating
   - Acceptance rate
   - Charts and statistics

### Database Schema (Supabase)

#### profiles table
```sql
- id (uuid, primary key)
- email (text)
- full_name (text)
- phone (text, nullable)
- avatar_url (text, nullable)
- role (enum: 'user' | 'driver')
- rating (numeric, default 5.0)
- total_rides (integer, default 0)
- created_at (timestamp)
- updated_at (timestamp)
```

#### driver_profiles table
```sql
- id (uuid, foreign key to profiles)
- vehicle_type (text)
- vehicle_make (text, nullable)
- vehicle_model (text, nullable)
- vehicle_year (integer, nullable)
- license_plate (text, nullable)
- license_number (text, nullable)
- is_available (boolean, default true)
- current_latitude (numeric, nullable)
- current_longitude (numeric, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

#### rides table
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- driver_id (uuid, foreign key to profiles, nullable)
- status (enum: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled')
- pickup_latitude (numeric)
- pickup_longitude (numeric)
- pickup_address (text, nullable)
- dropoff_latitude (numeric)
- dropoff_longitude (numeric)
- dropoff_address (text, nullable)
- distance_km (numeric, nullable)
- duration_minutes (integer, nullable)
- fare_amount (numeric, nullable)
- payment_method (enum: 'card' | 'cash' | 'wallet', default 'cash')
- payment_status (enum: 'pending' | 'completed' | 'failed', default 'pending')
- driver_rating (numeric, nullable)
- user_rating (numeric, nullable)
- requested_at (timestamp)
- accepted_at (timestamp, nullable)
- started_at (timestamp, nullable)
- completed_at (timestamp, nullable)
- created_at (timestamp)
```

### UI/UX Design - iOS Style (White Theme)

#### Color Scheme
- Primary: #007AFF (iOS Blue)
- Background: #F2F2F7 (iOS Light Gray)
- Card Background: #FFFFFF
- Text Primary: #000000
- Text Secondary: #8E8E93
- Border: #C6C6C8
- Success: #34C759
- Warning: #FF9500
- Error: #FF3B30

#### Component Styling
- Rounded corners: 12px for cards
- Shadow: subtle iOS-style shadows
- Font: System font (San Francisco style)
- Button height: 48px
- Input height: 44px
- Spacing: 16px standard padding

### Key Features to Implement

1. **Real-time Updates**
   - Supabase realtime subscriptions for ride status
   - Live location tracking during rides
   - Instant notifications for ride updates

2. **Map Integration**
   - React Native Maps with custom markers
   - Route drawing between pickup and dropoff
   - Current location tracking
   - Map gestures (zoom, pan)
   - Location search/autocomplete

3. **Fare Calculation**
   - Base fare: $5
   - Per km rate: $2.50
   - Haversine formula for distance
   - Average speed: 40 km/h for time estimate

4. **Location Services**
   - Request location permissions
   - Get current location
   - Background location updates for drivers
   - Geocoding (coordinates to address)

5. **State Management**
   - React Context for auth state
   - Local state for component data
   - AsyncStorage for persistence

### File Structure
```
/src
  /components
    /auth
      LoginScreen.tsx
    /user
      RideBooking.tsx
      ActiveRides.tsx
      RideHistory.tsx
    /driver
      AvailableRides.tsx
      ActiveRide.tsx
      DriverStats.tsx
    /map
      MapView.tsx
      LocationPicker.tsx
      RouteMap.tsx
    /ui
      Button.tsx
      Card.tsx
      Input.tsx
      LoadingSpinner.tsx
  /screens
    UserDashboard.tsx
    DriverDashboard.tsx
  /lib
    supabase.ts
    AuthContext.tsx
    types.ts
  /utils
    distance.ts
    fare.ts
    location.ts
  App.tsx
```

### Environment Variables
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Android Permissions (AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

### Critical Implementation Details

1. **Authentication Flow**
   - Check for existing session on app launch
   - Redirect to appropriate dashboard based on role
   - Handle session expiry gracefully

2. **Real-time Ride Updates**
   - Subscribe to rides table changes
   - Filter by user_id or driver_id
   - Update UI immediately on status change

3. **Location Tracking**
   - Request permissions on first use
   - Update driver location every 10 seconds when available
   - Show driver location to user during active ride

4. **Error Handling**
   - Network errors with retry logic
   - Location permission denied fallback
   - Supabase errors with user-friendly messages
   - Loading states for all async operations

5. **Performance**
   - Lazy load components
   - Optimize map rendering
   - Debounce location updates
   - Cache user profile data

### Testing Checklist
- [ ] User can sign in
- [ ] User can book a ride
- [ ] Fare calculation is accurate
- [ ] Map shows correct route
- [ ] Driver can see available rides
- [ ] Driver can accept rides
- [ ] Real-time updates work
- [ ] Location tracking works
- [ ] Ride completion flow works
- [ ] Ratings system works

### Build Instructions
1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Run on Android: `npx react-native run-android`
4. Build APK: `cd android && ./gradlew assembleRelease`

## Additional Notes
- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error boundaries
- Add loading skeletons for better UX
- Use FlatList for long lists (performance)
- Implement pull-to-refresh where appropriate
- Add haptic feedback for button presses
- Use React.memo for expensive components
- Implement proper cleanup in useEffect hooks

Build this app to be production-ready with clean code, proper error handling, and excellent user experience matching the iOS design aesthetic.
