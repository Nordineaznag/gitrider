#!/bin/bash

# GitRide Android APK Build Script
# This script helps build the APK for testing

echo "🚀 GitRide Android APK Builder"
echo "=============================="

# Check if we're in the android directory
if [ ! -f "app/build.gradle" ]; then
    echo "❌ Error: Please run this script from the android directory"
    exit 1
fi

# Check if Android SDK is available
if [ -z "$ANDROID_HOME" ]; then
    echo "⚠️  Warning: ANDROID_HOME not set"
    echo "   Please set ANDROID_HOME to your Android SDK path"
    echo "   Example: export ANDROID_HOME=/Users/username/Library/Android/sdk"
    echo ""
    echo "   For now, we'll try to build without it..."
fi

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

# Try to build using different methods
echo "🔨 Attempting to build APK..."

# Method 1: Try gradlew
if [ -f "gradlew" ]; then
    echo "📱 Method 1: Using gradlew wrapper..."
    chmod +x gradlew
    ./gradlew clean assembleDebug
    
    if [ $? -eq 0 ]; then
        echo "✅ APK built successfully using gradlew!"
        echo "📁 APK location: app/build/outputs/apk/debug/app-debug.apk"
        exit 0
    else
        echo "❌ gradlew build failed"
    fi
fi

# Method 2: Try system gradle
if command -v gradle &> /dev/null; then
    echo "📱 Method 2: Using system gradle..."
    gradle clean assembleDebug
    
    if [ $? -eq 0 ]; then
        echo "✅ APK built successfully using system gradle!"
        echo "📁 APK location: app/build/outputs/apk/debug/app-debug.apk"
        exit 0
    else
        echo "❌ System gradle build failed"
    fi
fi

# Method 3: Try gradle wrapper
if [ -f "gradle/wrapper/gradle-wrapper.properties" ]; then
    echo "📱 Method 3: Using gradle wrapper..."
    gradle clean assembleDebug
    
    if [ $? -eq 0 ]; then
        echo "✅ APK built successfully using gradle wrapper!"
        echo "📁 APK location: app/build/outputs/apk/debug/app-debug.apk"
        exit 0
    else
        echo "❌ Gradle wrapper build failed"
    fi
fi

# If all methods fail
echo "❌ All build methods failed!"
echo ""
echo "🔧 Troubleshooting:"
echo "1. Install Android Studio and Android SDK"
echo "2. Set ANDROID_HOME environment variable"
echo "3. Install Java 17+ (already installed ✅)"
echo "4. Update local.properties with your API keys"
echo ""
echo "📚 For detailed instructions, see BUILD_APK.md"
echo ""
echo "🚀 Alternative: Use Android Studio to build the APK"
echo "   1. Open Android Studio"
echo "   2. Open the android folder"
echo "   3. Build → Build Bundle(s) / APK(s) → Build APK(s)"
