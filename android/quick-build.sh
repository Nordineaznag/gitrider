#!/bin/bash

# GitRide Quick APK Build Script
# Run this after installing Android Studio

echo "🚀 GitRide Quick APK Builder"
echo "============================"

# Check if we're in the android directory
if [ ! -f "app/build.gradle" ]; then
    echo "❌ Error: Please run this script from the android directory"
    exit 1
fi

# Check if Android Studio is installed
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  Android Studio not found in PATH"
    echo "   Please install Android Studio first:"
    echo "   1. Download from https://developer.android.com/studio"
    echo "   2. Install with Android SDK 34"
    echo "   3. Set ANDROID_HOME environment variable"
    echo ""
    echo "   Then run this script again"
    exit 1
fi

echo "✅ Android Studio found at: $ANDROID_HOME"

# Check if local.properties exists and has API keys
if [ ! -f "local.properties" ]; then
    echo "⚠️  Creating local.properties template..."
    cat > local.properties << EOF
## This file must *NOT* be checked into Version Control Systems,
# as it contains information specific to your local configuration.
#
# Location of the SDK. This is only used by Gradle.
# For customization when using a Version Control System, please read the
# header note.
sdk.dir=$ANDROID_HOME

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Maps API Key
MAPS_API_KEY=your_google_maps_api_key_here
EOF
    echo "📝 Please update local.properties with your API keys"
    echo "   Then run this script again"
    exit 1
fi

# Check if API keys are configured
if grep -q "your_supabase_url_here" local.properties; then
    echo "⚠️  Please configure your API keys in local.properties"
    echo "   Update the following values:"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_ANON_KEY"
    echo "   - MAPS_API_KEY"
    echo ""
    echo "   Then run this script again"
    exit 1
fi

echo "✅ API keys configured"

# Clean and build
echo "🧹 Cleaning project..."
./gradlew clean

echo "🔨 Building APK..."
./gradlew assembleDebug

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 APK built successfully!"
    echo "📁 APK location: app/build/outputs/apk/debug/app-debug.apk"
    echo ""
    echo "📱 To install on your device:"
    echo "   1. Copy the APK to your device"
    echo "   2. Enable 'Unknown Sources' in device settings"
    echo "   3. Open the APK file on your device"
    echo "   4. Follow installation prompts"
    echo ""
    echo "🧪 To test the app:"
    echo "   1. Launch GitRide app"
    echo "   2. Test login/register"
    echo "   3. Test location services"
    echo "   4. Test ride booking"
    echo ""
    echo "📚 For detailed testing, see TESTING_GUIDE.md"
else
    echo "❌ Build failed!"
    echo ""
    echo "🔧 Troubleshooting:"
    echo "   1. Check Android Studio is installed"
    echo "   2. Verify Android SDK 34 is installed"
    echo "   3. Check internet connection"
    echo "   4. Verify API keys are correct"
    echo ""
    echo "📚 For help, see INSTALL_ANDROID_STUDIO.md"
fi
