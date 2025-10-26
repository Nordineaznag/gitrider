# GitRide Android App

A high-performance ride-sharing Android application built with Kotlin, Jetpack Compose, and modern Android architecture.

## 🚀 Features

- **Real-time Location Tracking**: GPS-based location services with background processing
- **Mapbox Integration**: Interactive maps with route calculation and navigation
- **Supabase Backend**: Real-time database with authentication and real-time updates
- **Modern UI**: Jetpack Compose with Material 3 design system
- **MVVM Architecture**: Clean architecture with Hilt dependency injection
- **Offline Support**: Local caching and offline capabilities
- **Performance Optimized**: Fast startup, smooth animations, efficient memory usage

## 🏗️ Architecture

- **UI Layer**: Jetpack Compose with Material 3
- **ViewModel**: State management and business logic
- **Repository Pattern**: Data abstraction layer
- **Dependency Injection**: Hilt for dependency management
- **Database**: Room for local caching
- **Networking**: Retrofit with Supabase integration
- **Maps**: Mapbox SDK with real-time tracking

## 📋 Prerequisites

- Android Studio Hedgehog (2023.1.1) or later
- JDK 17 or later
- Android SDK 34
- Mapbox Access Token
- Supabase project with configured database

## 🛠️ Setup Instructions

### 1. Clone and Setup

```bash
cd android
./gradlew build
```

### 2. Configure API Keys

1. **Mapbox Access Token**:
   - Go to [Mapbox Account](https://account.mapbox.com/)
   - Create a new access token or use your default public token
   - Update `local.properties`:
   ```properties
   MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
   ```

2. **Supabase Configuration**:
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key
   - Update `local.properties`:
   ```properties
   SUPABASE_URL=your_supabase_url_here
   SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### 3. Database Setup

Run the SQL migration from your web project:
```sql
-- Copy the content from supabase/migrations/20251024134909_create_ride_sharing_schema.sql
-- and run it in your Supabase SQL editor
```

### 4. Build and Run

```bash
./gradlew assembleDebug
```

## 📱 Key Components

### Screens
- **LoginScreen**: Authentication with email/password
- **UserDashboard**: Main user interface with ride management
- **RideBookingScreen**: Interactive map for booking rides
- **DriverDashboard**: Driver-specific interface

### Services
- **LocationService**: Background location tracking
- **FirebaseMessagingService**: Push notifications

### Data Models
- **User**: User profile and authentication
- **Ride**: Ride requests and management
- **Location**: GPS coordinates and addresses

## 🔧 Performance Optimizations

- **ProGuard/R8**: Code shrinking and obfuscation
- **Image Loading**: Coil for efficient image caching
- **Database**: Room with efficient queries
- **Networking**: Retrofit with connection pooling
- **Background Processing**: WorkManager for reliable background tasks
- **Memory Management**: Proper lifecycle management

## 🧪 Testing

```bash
# Unit tests
./gradlew test

# Instrumented tests
./gradlew connectedAndroidTest
```

## 📦 Dependencies

- **UI**: Jetpack Compose, Material 3
- **Architecture**: ViewModel, LiveData, Room
- **Dependency Injection**: Hilt
- **Networking**: Retrofit, OkHttp
- **Maps**: Google Maps SDK
- **Database**: Supabase, Room
- **Image Loading**: Coil
- **Background**: WorkManager

## 🚀 Deployment

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

## 📄 License

This project is part of the GitRide ride-sharing platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📞 Support

For support, please contact the development team or create an issue in the repository.
