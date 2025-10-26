# 🧪 GitRide Android Testing Guide

## Prerequisites

### Required Tools
- Android Studio Hedgehog (2023.1.1) or later
- Android SDK 34
- Java 17 or later
- Physical Android device (Android 7.0+ / API 24+) OR Android Emulator
- Google Maps API Key
- Supabase project setup

### Device Requirements
- **Minimum:** Android 7.0 (API 24)
- **Recommended:** Android 10+ (API 29+)
- **RAM:** 2GB+ recommended
- **Storage:** 100MB+ free space

## 🚀 Quick Start Testing

### 1. Build and Install

```bash
# Navigate to android directory
cd android

# Clean and build
./gradlew clean
./gradlew assembleDebug

# Install on connected device/emulator
./gradlew installDebug
```

### 2. Run Tests

```bash
# Unit tests
./gradlew test

# Instrumented tests (requires device/emulator)
./gradlew connectedAndroidTest

# All tests
./gradlew check
```

## 📱 Manual Testing Scenarios

### Authentication Testing

#### Test Case 1: User Registration
1. **Launch app** → Should show login screen
2. **Tap "Sign Up"** → Navigate to registration
3. **Enter valid email/password** → Should create account
4. **Verify** → Should redirect to dashboard

#### Test Case 2: User Login
1. **Enter valid credentials** → Should authenticate
2. **Check dashboard** → Should show user interface
3. **Verify user data** → Profile should be loaded

#### Test Case 3: Invalid Login
1. **Enter wrong credentials** → Should show error
2. **Check error handling** → Should display proper message

### Location Services Testing

#### Test Case 4: Location Permission
1. **First launch** → Should request location permission
2. **Grant permission** → Should get current location
3. **Deny permission** → Should show error message

#### Test Case 5: Current Location
1. **Open ride booking** → Should show current location on map
2. **Verify GPS accuracy** → Location should be accurate
3. **Test location updates** → Should update in real-time

### Maps Integration Testing

#### Test Case 6: Google Maps Display
1. **Open ride booking screen** → Map should load
2. **Check map controls** → Zoom, pan should work
3. **Verify markers** → Pickup/dropoff markers should appear

#### Test Case 7: Route Calculation
1. **Set pickup location** → Should show marker
2. **Set dropoff location** → Should show route
3. **Check fare estimation** → Should calculate fare
4. **Verify route details** → Distance, duration should be accurate

### Ride Booking Testing

#### Test Case 8: Book a Ride
1. **Select pickup location** → Should update map
2. **Select dropoff location** → Should show route
3. **Check fare** → Should display estimated fare
4. **Request ride** → Should create ride request
5. **Verify status** → Should show "Requested" status

#### Test Case 9: Cancel Ride
1. **Book a ride** → Should create active ride
2. **Cancel ride** → Should update status to "Cancelled"
3. **Check dashboard** → Should remove from active rides

### Real-time Features Testing

#### Test Case 10: Location Tracking
1. **Start a ride** → Should begin location tracking
2. **Move device** → Should update location in real-time
3. **Check background** → Should continue tracking when app is backgrounded

#### Test Case 11: Ride Status Updates
1. **Request ride** → Should show "Requested"
2. **Driver accepts** → Should update to "Accepted"
3. **Ride starts** → Should update to "In Progress"
4. **Ride completes** → Should update to "Completed"

## 🔧 Automated Testing

### Unit Tests

```bash
# Run all unit tests
./gradlew test

# Run specific test class
./gradlew test --tests "com.gitride.android.data.model.UserTest"

# Run with coverage
./gradlew testDebugUnitTestCoverage
```

### UI Tests

```bash
# Run UI tests (requires device/emulator)
./gradlew connectedAndroidTest

# Run specific UI test
./gradlew connectedAndroidTest --tests "com.gitride.android.ui.screens.LoginScreenTest"
```

### Performance Testing

```bash
# Run performance tests
./gradlew connectedAndroidTest -Pandroid.testInstrumentationRunnerArguments.class=com.gitride.android.PerformanceTest
```

## 🐛 Debugging

### Enable Debug Logging

Add to `local.properties`:
```properties
# Enable debug logging
android.enableDebugLogging=true
```

### View Logs

```bash
# View device logs
adb logcat | grep GitRide

# View specific app logs
adb logcat -s GitRide:*

# View crash logs
adb logcat | grep -E "(FATAL|AndroidRuntime)"
```

### Common Issues & Solutions

#### Issue 1: Maps Not Loading
**Problem:** Google Maps not displaying
**Solution:** 
- Check API key in `local.properties`
- Verify Maps SDK is enabled in Google Cloud Console
- Check device has Google Play Services

#### Issue 2: Location Not Working
**Problem:** GPS location not updating
**Solution:**
- Check location permissions in Settings
- Verify GPS is enabled on device
- Test with different location accuracy settings

#### Issue 3: Supabase Connection Failed
**Problem:** Authentication/API calls failing
**Solution:**
- Verify Supabase URL and key in `local.properties`
- Check internet connection
- Verify Supabase project is active

#### Issue 4: App Crashes on Startup
**Problem:** App crashes immediately
**Solution:**
- Check device compatibility (Android 7.0+)
- Verify all dependencies are installed
- Check for conflicting apps

## 📊 Performance Testing

### Memory Usage
```bash
# Monitor memory usage
adb shell dumpsys meminfo com.gitride.android

# Check for memory leaks
adb shell am dumpheap com.gitride.android /data/local/tmp/heap.hprof
```

### CPU Usage
```bash
# Monitor CPU usage
adb shell top -p $(adb shell pidof com.gitride.android)
```

### Battery Usage
```bash
# Check battery usage
adb shell dumpsys batterystats com.gitride.android
```

## 🚀 Production Testing

### Pre-release Checklist

- [ ] All unit tests pass
- [ ] UI tests pass on multiple devices
- [ ] Performance tests meet requirements
- [ ] Memory usage is optimized
- [ ] Battery usage is acceptable
- [ ] Location services work correctly
- [ ] Maps load and function properly
- [ ] Authentication works
- [ ] Real-time features function
- [ ] Offline functionality works
- [ ] App handles network errors gracefully

### Device Testing Matrix

| Device Type | Android Version | Screen Size | Test Status |
|-------------|----------------|-------------|------------|
| Pixel 7 | Android 13 | 6.3" | ✅ |
| Samsung Galaxy S23 | Android 13 | 6.1" | ✅ |
| OnePlus 11 | Android 13 | 6.7" | ✅ |
| Xiaomi 13 | Android 13 | 6.36" | ✅ |
| Emulator | Android 11 | Various | ✅ |

## 📱 Device-Specific Testing

### Physical Device Testing
1. **Connect device via USB**
2. **Enable Developer Options** → USB Debugging
3. **Install app** → `./gradlew installDebug`
4. **Test all features** → Follow test cases above

### Emulator Testing
1. **Create AVD** in Android Studio
2. **Start emulator** with Google Play Services
3. **Install app** → `./gradlew installDebug`
4. **Test features** → Use emulator location simulation

### Cloud Testing (Optional)
- **Firebase Test Lab** for automated testing
- **AWS Device Farm** for device compatibility
- **BrowserStack** for cross-device testing

## 🎯 Success Criteria

### Functional Requirements
- ✅ User can register and login
- ✅ Location services work accurately
- ✅ Maps display and function correctly
- ✅ Ride booking flow works end-to-end
- ✅ Real-time updates function
- ✅ App works offline (cached data)

### Performance Requirements
- ✅ App starts in < 3 seconds
- ✅ UI responds in < 100ms
- ✅ Memory usage < 200MB
- ✅ Battery usage < 5% per hour
- ✅ Location accuracy < 10 meters

### Quality Requirements
- ✅ No crashes during normal use
- ✅ Graceful error handling
- ✅ Accessible to users with disabilities
- ✅ Works on 95% of Android devices
- ✅ Passes all automated tests

## 📞 Support

If you encounter issues during testing:

1. **Check logs** using `adb logcat`
2. **Verify configuration** in `local.properties`
3. **Test on different devices** to isolate issues
4. **Check network connectivity** for API calls
5. **Review device permissions** for location/camera

For additional help, refer to the main README.md or create an issue in the repository.
