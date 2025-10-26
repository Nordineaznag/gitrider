# 🚀 Quick Test Start Guide

## ⚡ 5-Minute Test Setup

### 1. **Prerequisites Check**
```bash
# Check if you have the required tools
java -version          # Should be Java 17+
adb devices           # Should show connected device/emulator
./gradlew --version   # Should show Gradle 8.4+
```

### 2. **Quick Build & Install**
```bash
cd android

# Build the app
./gradlew assembleDebug

# Install on device (if connected)
./gradlew installDebug
```

### 3. **Run Basic Tests**
```bash
# Run unit tests
./gradlew test

# Run UI tests (requires device)
./gradlew connectedAndroidTest
```

## 🧪 **Testing Commands**

### **Automated Testing**
```bash
# Run all tests
./gradlew check

# Run specific test
./gradlew test --tests "UserTest"

# Generate coverage report
./gradlew testDebugUnitTestCoverage
```

### **Manual Testing**
```bash
# Launch app
adb shell am start -n com.gitride.android/.MainActivity

# View logs
adb logcat | grep GitRide

# Check app info
adb shell dumpsys package com.gitride.android
```

## 📱 **Quick Test Scenarios**

### **Test 1: App Launch**
1. Launch app → Should show login screen
2. Check for crashes → App should not crash
3. Verify UI elements → All elements visible

### **Test 2: Basic Navigation**
1. Try to login with invalid credentials → Should show error
2. Check error handling → Should display proper message
3. Verify UI responsiveness → Should respond to touches

### **Test 3: Location Services**
1. Grant location permission → Should request permission
2. Check current location → Should get GPS coordinates
3. Verify map display → Should show map with location

## 🔧 **Troubleshooting**

### **Common Issues**

#### **Build Fails**
```bash
# Clean and rebuild
./gradlew clean
./gradlew assembleDebug
```

#### **Tests Fail**
```bash
# Check device connection
adb devices

# Restart ADB
adb kill-server
adb start-server
```

#### **App Crashes**
```bash
# View crash logs
adb logcat | grep -E "(FATAL|AndroidRuntime)"

# Check device compatibility
adb shell getprop ro.build.version.sdk
```

## 📊 **Test Results**

### **Expected Results**
- ✅ **Build:** Should complete without errors
- ✅ **Install:** Should install on device successfully
- ✅ **Launch:** Should start without crashes
- ✅ **Tests:** Should pass all automated tests
- ✅ **Performance:** Should meet performance requirements

### **Success Metrics**
- **Startup Time:** < 3 seconds
- **Memory Usage:** < 200MB
- **Test Coverage:** > 80%
- **Crash Rate:** 0%

## 🚀 **Next Steps**

1. **Complete Setup:** Follow `TESTING_GUIDE.md` for detailed setup
2. **Run Full Tests:** Use `TESTING_CHECKLIST.md` for comprehensive testing
3. **Performance Testing:** Monitor app performance and battery usage
4. **Device Testing:** Test on multiple devices and Android versions

## 📞 **Need Help?**

- **Setup Issues:** Check `TESTING_GUIDE.md`
- **Test Failures:** Check `TESTING_CHECKLIST.md`
- **Performance Issues:** Monitor logs with `adb logcat`
- **Build Issues:** Clean and rebuild project

---

**Ready to test?** Run `./scripts/test-setup.sh` to get started! 🚀
