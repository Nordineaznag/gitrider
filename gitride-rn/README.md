# Getride - React Native Expo

Complete React Native Expo clone of the Getride PWA ride-sharing app with identical design and functionality.

## Features

- **iOS-Style Design**: Matches the PWA's iOS design system
- **Authentication**: Sign in/Sign up with role selection (User/Driver)
- **User Dashboard**: Book rides, view active rides, ride history
- **Driver Dashboard**: Accept rides, manage availability, view stats
- **Real-time Updates**: Live ride status updates via Supabase
- **Maps Integration**: React Native Maps support
- **Same Backend**: Uses the same Supabase database as PWA

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

3. Start the app:
```bash
npm start
```

## Project Structure

```
gitride-rn/
├── screens/
│   ├── LoginScreen.tsx
│   ├── UserDashboard.tsx
│   └── DriverDashboard.tsx
├── components/
│   ├── RideBooking.tsx
│   ├── ActiveRides.tsx
│   ├── RideHistory.tsx
│   ├── AvailableRides.tsx
│   ├── ActiveRide.tsx
│   └── DriverStats.tsx
├── lib/
│   ├── supabase.ts
│   └── AuthContext.tsx
├── App.tsx
└── app.json
```

## Design System

- **Colors**: iOS system colors (#007AFF primary, #F2F2F7 background)
- **Typography**: San Francisco font system
- **Components**: iOS-style cards, segments, buttons
- **Spacing**: Consistent 16px padding, 12px gaps

## Run on Device

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

**Web:**
```bash
npm run web
```
