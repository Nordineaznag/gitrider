#!/bin/bash

# GitRide Android Test Setup Script
# This script helps set up the testing environment

echo "🚀 GitRide Android Test Setup"
echo "=============================="

# Check if we're in the android directory
if [ ! -f "app/build.gradle" ]; then
    echo "❌ Error: Please run this script from the android directory"
    exit 1
fi

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  Warning: ANDROID_HOME not set. Please set it to your Android SDK path"
    echo "   Example: export ANDROID_HOME=/Users/username/Library/Android/sdk"
fi

# Check if device/emulator is connected
echo "📱 Checking for connected devices..."
adb devices

# Check if local.properties exists
if [ ! -f "local.properties" ]; then
    echo "⚠️  Warning: local.properties not found. Creating template..."
    cat > local.properties << EOF
## This file must *NOT* be checked into Version Control Systems,
# as it contains information specific to your local configuration.
#
# Location of the SDK. This is only used by Gradle.
# For customization when using a Version Control System, please read the
# header note.
sdk.dir=\$ANDROID_HOME

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API Key
MAPS_API_KEY=your_google_maps_api_key_here
EOF
    echo "✅ Created local.properties template"
    echo "📝 Please update local.properties with your API keys"
fi

# Clean and build
echo "🧹 Cleaning project..."
./gradlew clean

echo "🔨 Building project..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi

# Install on device if available
DEVICE_COUNT=$(adb devices | grep -c "device$")
if [ $DEVICE_COUNT -gt 0 ]; then
    echo "📱 Installing app on connected device..."
    ./gradlew installDebug
    
    if [ $? -eq 0 ]; then
        echo "✅ App installed successfully!"
        echo "🚀 You can now test the app on your device"
    else
        echo "❌ Installation failed"
    fi
else
    echo "⚠️  No devices connected. Please connect a device or start an emulator"
    echo "   To start an emulator:"
    echo "   1. Open Android Studio"
    echo "   2. Go to Tools > AVD Manager"
    echo "   3. Create/start an emulator"
fi

echo ""
echo "🧪 Testing Commands:"
echo "===================="
echo "Unit Tests:        ./gradlew test"
echo "UI Tests:          ./gradlew connectedAndroidTest"
echo "All Tests:        ./gradlew check"
echo "Run App:          adb shell am start -n com.gitride.android/.MainActivity"
echo "View Logs:        adb logcat | grep GitRide"
echo ""
echo "📚 For detailed testing instructions, see TESTING_GUIDE.md"
