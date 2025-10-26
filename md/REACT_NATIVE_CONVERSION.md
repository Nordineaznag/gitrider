# GitRide: PWA to React Native Conversion Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Database Schema](#database-schema)
3. [Tech Stack Migration](#tech-stack-migration)
4. [Component Conversion](#component-conversion)
5. [Native Features](#native-features)
6. [Performance Optimization](#performance-optimization)
7. [Deployment Guidelines](#deployment-guidelines)

## Project Overview

Converting GitRide PWA to a full-featured React Native application while maintaining exact feature parity and enhancing with native capabilities.

### Current Tech Stack
- Next.js 13.5.1
- TypeScript 5.2.2
- Supabase
- Mapbox GL
- TailwindCSS

### Target Tech Stack
- React Native (latest)
- TypeScript 5.2.2
- Supabase React Native SDK
- React Native Mapbox GL
- React Native Navigation

## Database Schema

```sql
-- Users Table
CREATE TABLE users (
    id UUID REFERENCES auth.users PRIMARY KEY,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    phone_number TEXT,
    email TEXT UNIQUE,
    role TEXT DEFAULT 'user'
);

-- Driver Profiles Table
CREATE TABLE driver_profiles (
    id UUID REFERENCES users(id) PRIMARY KEY,
    vehicle_type TEXT NOT NULL,
    license_number TEXT,
    is_available BOOLEAN DEFAULT false,
    current_location GEOGRAPHY(POINT),
    rating DECIMAL(3,2) DEFAULT 0.0,
    total_rides INTEGER DEFAULT 0,
    total_earnings DECIMAL(10,2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Rides Table
CREATE TABLE rides (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) NOT NULL,
    driver_id UUID REFERENCES driver_profiles(id),
    pickup_location GEOGRAPHY(POINT) NOT NULL,
    dropoff_location GEOGRAPHY(POINT) NOT NULL,
    status TEXT DEFAULT 'pending',
    fare DECIMAL(10,2),
    distance DECIMAL(10,2),
    duration INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    cancellation_reason TEXT
);

-- Ride Ratings Table
CREATE TABLE ride_ratings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ride_id UUID REFERENCES rides(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    driver_id UUID REFERENCES driver_profiles(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Payment Records Table
CREATE TABLE payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    ride_id UUID REFERENCES rides(id) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT DEFAULT 'pending',
    payment_method TEXT,
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Realtime Subscriptions
CREATE PUBLICATION supabase_realtime FOR TABLE rides, driver_profiles;
```

## Tech Stack Migration

### 1. Core Dependencies
```json
{
  "dependencies": {
    "react-native": "latest",
    "@react-navigation/native": "^6.x",
    "@react-navigation/stack": "^6.x",
    "@supabase/supabase-js": "^2.x",
    "@rnmapbox/maps": "^10.x",
    "react-native-reanimated": "^3.x",
    "react-native-gesture-handler": "^2.x",
    "react-native-safe-area-context": "^4.x",
    "@react-native-async-storage/async-storage": "^1.x",
    "react-native-encrypted-storage": "^4.x"
  }
}
```

### 2. Component Conversion Map

#### Map Components
```typescript
// From components/map/map-component.tsx
interface MapComponentProps {
  center: {
    latitude: number;
    longitude: number;
  };
  markers?: Array<{
    latitude: number;
    longitude: number;
    label?: string;
    title?: string;
  }>;
  showDirections?: boolean;
  origin?: LatLng;
  destination?: LatLng;
  onLocationSelect?: (location: LatLng) => void;
}
```

#### Driver Components
```typescript
// From components/driver/driver-dashboard.tsx
interface DriverDashboardProps {
  profile: {
    id: string;
    fullName: string;
    avatarUrl?: string;
    rating: number;
    totalRides: number;
    vehicleType: string;
    isAvailable: boolean;
    currentLocation?: LatLng;
  };
  activeRide?: RideDetails;
  availableRides: RideRequest[];
  stats: DriverStats;
}
```

### 3. UI Components Migration

```typescript
// UI Components Conversion
const componentMap = {
  'accordion.tsx': 'AccordionView',
  'alert-dialog.tsx': 'Modal',
  'avatar.tsx': 'Image + View',
  'badge.tsx': 'CustomBadge',
  'button.tsx': 'TouchableOpacity',
  'card.tsx': 'CardView',
  'dialog.tsx': 'Modal',
  'drawer.tsx': 'BottomSheet',
  'input.tsx': 'TextInput',
  'tabs.tsx': 'TabView',
  'toast.tsx': 'ToastMessage'
};
```

## Native Features

### 1. Location Services
```typescript
interface LocationService {
  startBackgroundTracking(): Promise<void>;
  getCurrentLocation(): Promise<LatLng>;
  watchPosition(callback: (position: LatLng) => void): number;
  stopWatching(watchId: number): void;
  calculateDistance(start: LatLng, end: LatLng): number;
}
```

### 2. Push Notifications
```typescript
interface NotificationService {
  requestPermission(): Promise<boolean>;
  registerDevice(userId: string): Promise<void>;
  handleNotification(notification: Notification): void;
  scheduleLocalNotification(options: NotificationOptions): void;
}
```

### 3. Offline Support
```typescript
interface OfflineManager {
  syncData(): Promise<void>;
  cacheRides(rides: Ride[]): Promise<void>;
  getCachedRides(): Promise<Ride[]>;
  handleOfflineActions(): Promise<void>;
}
```

## Performance Optimization

### 1. List Virtualization
```typescript
// Implementation for large lists
import { VirtualizedList } from 'react-native';

const RideList = () => {
  return (
    <VirtualizedList
      data={rides}
      renderItem={({ item }) => <RideItem ride={item} />}
      getItemCount={data => data.length}
      getItem={(data, index) => data[index]}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
    />
  );
};
```

### 2. Image Optimization
```typescript
interface ImageCache {
  preloadImages(urls: string[]): Promise<void>;
  clearCache(): Promise<void>;
  getCachedImage(url: string): Promise<string>;
}
```

## Deployment Guidelines

### 1. iOS Configuration
- Minimum iOS version: 13.0
- Required permissions in Info.plist
- Background modes configuration
- Push notification setup

### 2. Android Configuration
- Minimum SDK version: 26
- Target SDK version: latest
- Required permissions in AndroidManifest.xml
- Background service setup
- Firebase Cloud Messaging setup

### 3. Environment Setup
```bash
# iOS
pod install
cd ios
xcodebuild -workspace GitRide.xcworkspace -scheme GitRide -configuration Release

# Android
cd android
./gradlew assembleRelease
```

### 4. CI/CD Pipeline
```yaml
name: Mobile Build Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: yarn install
      - name: Run tests
        run: yarn test
      - name: Build Android
        run: cd android && ./gradlew assembleRelease
      - name: Build iOS
        run: cd ios && pod install && xcodebuild -workspace GitRide.xcworkspace
```

## Testing Strategy

### 1. Unit Tests
```typescript
// Example test suite
import { render, fireEvent } from '@testing-library/react-native';

describe('DriverDashboard', () => {
  test('toggles availability status', () => {
    const { getByTestId } = render(<DriverDashboard />);
    const toggleButton = getByTestId('availability-toggle');
    fireEvent.press(toggleButton);
    expect(toggleButton.props.value).toBe(true);
  });
});
```

### 2. E2E Tests
```typescript
// Detox test example
describe('Driver Flow', () => {
  it('should complete a ride successfully', async () => {
    await device.launchApp();
    await element(by.id('login-button')).tap();
    await element(by.id('email')).typeText('driver@test.com');
    await element(by.id('password')).typeText('password');
    await element(by.id('submit')).tap();
    await expect(element(by.id('driver-dashboard'))).toBeVisible();
  });
});
```

## Security Considerations

### 1. Data Encryption
```typescript
interface SecurityService {
  encryptData(data: any): Promise<string>;
  decryptData(encryptedData: string): Promise<any>;
  secureStore(key: string, value: string): Promise<void>;
  secureRetrieve(key: string): Promise<string>;
}
```

### 2. Authentication Flow
```typescript
interface AuthService {
  signIn(email: string, password: string): Promise<Session>;
  signOut(): Promise<void>;
  refreshToken(): Promise<string>;
  handleBiometricAuth(): Promise<boolean>;
}
```

Remember to:
1. Implement proper error handling
2. Add loading states
3. Handle offline scenarios
4. Optimize for battery life
5. Implement proper memory management
6. Add analytics and crash reporting
7. Setup proper monitoring
8. Implement proper logging
9. Setup proper backup strategies
10. Implement proper security measures