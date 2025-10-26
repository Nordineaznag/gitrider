# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# If your project uses WebView with JS, uncomment the following
# and specify the fully qualified class name to the JavaScript interface
# class:
#-keepclassmembers class fqcn.of.javascript.interface.for.webview {
#   public *;
#}

# Uncomment this to preserve the line number information for
# debugging stack traces.
#-keepattributes SourceFile,LineNumberTable

# If you keep the line number information, uncomment this to
# hide the original source file name.
#-renamesourcefileattribute SourceFile

# Keep Supabase classes
-keep class io.github.jan.supabase.** { *; }
-keep class io.github.jan.tennert.supabase.** { *; }

# Keep Mapbox classes
-keep class com.mapbox.** { *; }
-keep class com.mapbox.maps.** { *; }
-keep class com.mapbox.navigation.** { *; }
-keep class com.mapbox.api.** { *; }

# Keep Retrofit classes
-keep class retrofit2.** { *; }
-keep class okhttp3.** { *; }

# Keep Room database classes
-keep class androidx.room.** { *; }

# Keep Hilt classes
-keep class dagger.hilt.** { *; }

# Keep data classes
-keep class com.gitride.android.data.model.** { *; }

# Keep Parcelable classes
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}
