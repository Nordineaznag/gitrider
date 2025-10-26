# GitRide React Native - Quick Start Guide

## Prerequisites
- Node.js 18+ installed
- Expo CLI installed (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

## Installation

```bash
cd gitride-rn
npm install
```

## Environment Setup

✅ Environment variables are already configured in `.env`:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN`

## Running the App

### Start Development Server
```bash
npm start
```

### Run on iOS
```bash
npm run ios
# or press 'i' in the terminal
```

### Run on Android
```bash
npm run android
# or press 'a' in the terminal
```

### Run on Web
```bash
npm run web
# or press 'w' in the terminal
```

## Testing Accounts

Create test accounts or use existing ones from the PWA version.

### Test User (Rider)
- Email: `user@test.com`
- Password: `test123`
- Role: User

### Test Driver
- Email: `driver@test.com`
- Password: `test123`
- Role: Driver

## Features to Test

### User Flow
1. ✅ Sign up as a user
2. ✅ Book a ride
3. ✅ View active rides
4. ✅ View ride history
5. ✅ Sign out

### Driver Flow
1. ✅ Sign up as a driver
2. ✅ Toggle availability
3. ✅ View available rides
4. ✅ Accept a ride
5. ✅ Start ride
6. ✅ Complete ride
7. ✅ View stats

## Troubleshooting

### App won't start
```bash
# Clear cache
expo start -c
```

### Dependencies issues
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Environment variables not loading
```bash
# Restart the development server
# Press Ctrl+C and run npm start again
```

## Project Structure

```
gitride-rn/
├── App.tsx                 # Main app entry
├── lib/
│   ├── AuthContext.tsx    # Authentication context
│   └── supabase.ts        # Supabase client
├── screens/
│   ├── LoginScreen.tsx    # Login/signup screen
│   ├── UserDashboard.tsx  # User dashboard
│   └── DriverDashboard.tsx # Driver dashboard
└── components/
    ├── RideBooking.tsx    # Ride booking form
    ├── ActiveRides.tsx    # Active rides list
    ├── ActiveRide.tsx     # Driver active ride
    ├── AvailableRides.tsx # Available rides for drivers
    ├── RideHistory.tsx    # Ride history
    └── DriverStats.tsx    # Driver statistics
```

## Development Tips

- Use React DevTools for debugging
- Check console for errors
- Test on both iOS and Android
- Use Expo Go app for quick testing on physical devices

## Known Issues

- Maps integration is basic (needs enhancement)
- Location services need full implementation
- Push notifications not implemented

## Support

For issues or questions, check:
- `RN_RUNTIME_CHECK.md` - Runtime check report
- `RN_COMPATIBILITY_FIXES.md` - Compatibility fixes
- Console logs for error messages
