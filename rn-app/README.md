# GitRide React Native App

React Native version of the GitRide ride-sharing app.

## Setup

1. Install dependencies:
```bash
cd rn-app
npm install
```

2. Update Supabase credentials in `src/lib/supabase.ts`:
   - Copy from your `.env` file: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. Add logo image:
   - Copy `public/getride-logo.png` to `assets/logo.png`

## Run Android

```bash
npm run android
```

## Build APK

```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Features

- User authentication (sign up/sign in)
- User dashboard (book rides, view active rides, ride history)
- Driver dashboard (accept rides, view active rides, completed rides)
- Real-time ride updates via Supabase
- Native Android UI with iOS-inspired design
