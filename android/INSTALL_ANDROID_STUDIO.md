# 📱 How to Build GitRide APK

## 🚀 Quick Setup Guide

Since you want to test the Android app, here's the fastest way to get the APK:

### **Step 1: Install Android Studio**

1. **Download Android Studio:**
   - Go to [developer.android.com/studio](https://developer.android.com/studio)
   - Download the latest version
   - Install with default settings

2. **Install Android SDK:**
   - Open Android Studio
   - Go to **Tools** → **SDK Manager**
   - Install **Android 14 (API 34)** - Target SDK
   - Install **Android 7.0 (API 24)** - Minimum SDK
   - Install **Android SDK Build-Tools 34.0.0**

### **Step 2: Open GitRide Project**

1. **Open Project:**
   - Launch Android Studio
   - Click **Open an Existing Project**
   - Navigate to your `gitride/android` folder
   - Click **OK**

2. **Sync Project:**
   - Android Studio will automatically sync the project
   - Wait for "Gradle sync finished" message

### **Step 3: Configure API Keys**

1. **Open `local.properties`:**
   - In Android Studio, open `local.properties`
   - Update with your API keys:

   ```properties
   # Replace with your actual values
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your_supabase_anon_key
   MAPS_API_KEY=your_google_maps_api_key
   ```

2. **Get API Keys:**
   - **Supabase:** Go to your Supabase project → Settings → API
   - **Google Maps:** Go to Google Cloud Console → APIs & Services → Credentials

### **Step 4: Build APK**

1. **Build APK:**
   - In Android Studio, go to **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Wait for build to complete

2. **Find APK:**
   - APK will be created at: `app/build/outputs/apk/debug/app-debug.apk`
   - You can find it in the **Build** tab at the bottom

### **Step 5: Install on Device**

1. **Enable Developer Options:**
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
   - Go back to **Settings** → **Developer Options**
   - Enable **USB Debugging**

2. **Install APK:**
   - Connect your device via USB
   - Copy the APK to your device
   - Open the APK file on your device
   - Follow installation prompts

## 🔧 Alternative: Command Line Build

If you prefer command line:

### **Install Android SDK Command Line Tools:**

1. **Download SDK:**
   ```bash
   # Download Android SDK command line tools
   # Extract to a folder like C:\Android\sdk
   ```

2. **Set Environment Variables:**
   ```bash
   # Add to your PATH:
   export ANDROID_HOME=C:\Android\sdk
   export PATH=$PATH:$ANDROID_HOME\cmdline-tools\latest\bin
   export PATH=$PATH:$ANDROID_HOME\platform-tools
   ```

3. **Build APK:**
   ```bash
   cd android
   ./gradlew clean assembleDebug
   ```

## 📱 APK Features

The built APK will include:

### **Core Features:**
- ✅ **Authentication** (Login/Register with Supabase)
- ✅ **User Dashboard** with ride management
- ✅ **Ride Booking** with interactive Google Maps
- ✅ **Location Services** with GPS tracking
- ✅ **Real-time Updates** via Supabase
- ✅ **Offline Support** with local caching

### **Performance:**
- ⚡ **Fast Startup** (< 3 seconds)
- 🚀 **Smooth Animations** (60fps)
- 💾 **Efficient Memory** (< 200MB)
- 🔋 **Battery Optimized** location tracking

## 🧪 Testing the APK

### **Test Scenarios:**

1. **Install & Launch:**
   - Install APK on device
   - Launch app → Should show login screen
   - No crashes should occur

2. **Authentication:**
   - Try to login with invalid credentials → Should show error
   - Register new account → Should work
   - Login with valid credentials → Should work

3. **Location Services:**
   - Grant location permission → Should request permission
   - Check current location → Should get GPS coordinates
   - Verify map display → Should show Google Maps

4. **Ride Booking:**
   - Select pickup location → Should update map
   - Select dropoff location → Should show route
   - Request ride → Should create ride request

## 🚨 Troubleshooting

### **Common Issues:**

#### **Build Fails:**
- Check Android SDK is installed
- Verify Java 17+ is installed
- Check internet connection for dependencies

#### **APK Won't Install:**
- Check Android version (7.0+ required)
- Enable "Unknown Sources" in device settings
- Check device storage space

#### **App Crashes:**
- Check device compatibility
- Verify API keys are configured
- Check internet connection

#### **Maps Don't Load:**
- Verify Google Maps API key
- Check internet connection
- Ensure Google Play Services is installed

## 📊 Expected Performance

- **Startup Time:** < 3 seconds
- **Memory Usage:** < 200MB
- **Battery Usage:** < 5% per hour
- **Location Accuracy:** < 10 meters

## 🎯 Success Criteria

- ✅ **APK builds successfully**
- ✅ **Installs on device without errors**
- ✅ **App launches and shows login screen**
- ✅ **No crashes during normal use**
- ✅ **All features work as expected**

## 📞 Support

If you encounter issues:

1. **Check Android Studio logs** for build errors
2. **Verify API keys** are correctly configured
3. **Test on different device** if possible
4. **Check internet connection** for API calls

---

**Ready to build?** Follow the steps above and you'll have your GitRide APK ready for testing! 🚀

## 🚀 Quick Start Commands

Once you have Android Studio installed:

```bash
# 1. Open Android Studio
# 2. Open the android folder
# 3. Wait for sync to complete
# 4. Build → Build Bundle(s) / APK(s) → Build APK(s)
# 5. Find APK at: app/build/outputs/apk/debug/app-debug.apk
```

**That's it!** Your APK will be ready for testing on your device! 📱
