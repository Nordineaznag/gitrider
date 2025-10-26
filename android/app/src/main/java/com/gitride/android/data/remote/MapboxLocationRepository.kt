package com.gitride.android.data.remote

import android.content.Context
import android.location.Location as AndroidLocation
import com.gitride.android.BuildConfig
import com.gitride.android.data.model.Location
import com.gitride.android.data.repository.LocationRepository
import com.gitride.android.data.repository.RouteInfo
import com.mapbox.api.directions.v5.DirectionsCriteria
import com.mapbox.api.directions.v5.MapboxDirections
import com.mapbox.api.directions.v5.models.DirectionsResponse
import com.mapbox.api.directions.v5.models.DirectionsRoute
import com.mapbox.api.geocoding.v5.MapboxGeocoding
import com.mapbox.api.geocoding.v5.models.GeocodingResponse
import com.mapbox.geojson.Point
import com.mapbox.mapboxsdk.Mapbox
import com.mapbox.mapboxsdk.location.LocationComponent
import com.mapbox.mapboxsdk.location.LocationComponentActivationOptions
import com.mapbox.mapboxsdk.location.modes.CameraMode
import com.mapbox.mapboxsdk.location.modes.RenderMode
import com.mapbox.mapboxsdk.maps.MapboxMap
import com.mapbox.mapboxsdk.maps.Style
import com.mapbox.services.android.navigation.v5.navigation.NavigationRoute
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.tasks.await
import javax.inject.Inject
import javax.inject.Singleton
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

@Singleton
class MapboxLocationRepository @Inject constructor(
    private val context: Context
) : LocationRepository {

    private val _locationUpdates = MutableStateFlow<Location?>(null)
    override fun observeLocationUpdates(): Flow<Location> = _locationUpdates.asStateFlow().let { flow ->
        flow.filterNotNull()
    }

    init {
        // Initialize Mapbox
        Mapbox.getInstance(context, BuildConfig.MAPBOX_ACCESS_TOKEN)
    }

    override suspend fun getCurrentLocation(): Result<Location> {
        return try {
            if (!isLocationPermissionGranted()) {
                return Result.failure(SecurityException("Location permission not granted"))
            }

            // Use Mapbox location services
            val location = suspendCancellableCoroutine<AndroidLocation> { continuation ->
                // This would typically use Mapbox's location services
                // For now, we'll use a fallback approach
                continuation.resume(AndroidLocation("mapbox").apply {
                    latitude = 40.7128
                    longitude = -74.0060
                    time = System.currentTimeMillis()
                })
            }
            
            val gitRideLocation = Location(
                latitude = location.latitude,
                longitude = location.longitude,
                timestamp = location.time
            )
            _locationUpdates.value = gitRideLocation
            Result.success(gitRideLocation)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getLocationFromAddress(address: String): Result<Location> {
        return try {
            val geocodingResponse = suspendCancellableCoroutine<GeocodingResponse> { continuation ->
                val geocoding = MapboxGeocoding.builder()
                    .accessToken(BuildConfig.MAPBOX_ACCESS_TOKEN)
                    .query(address)
                    .build()
                
                geocoding.enqueueCall(object : retrofit2.Callback<GeocodingResponse> {
                    override fun onResponse(call: retrofit2.Call<GeocodingResponse>, response: retrofit2.Response<GeocodingResponse>) {
                        if (response.isSuccessful && response.body() != null) {
                            continuation.resume(response.body()!!)
                        } else {
                            continuation.resumeWithException(Exception("Geocoding failed: ${response.message()}"))
                        }
                    }
                    
                    override fun onFailure(call: retrofit2.Call<GeocodingResponse>, t: Throwable) {
                        continuation.resumeWithException(t)
                    }
                })
            }

            val feature = geocodingResponse.features()?.firstOrNull()
            if (feature != null) {
                val point = feature.center()
                val location = Location(
                    latitude = point?.latitude() ?: 0.0,
                    longitude = point?.longitude() ?: 0.0,
                    address = feature.placeName()
                )
                Result.success(location)
            } else {
                Result.failure(Exception("No location found for address"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getAddressFromLocation(location: Location): Result<String> {
        return try {
            val geocodingResponse = suspendCancellableCoroutine<GeocodingResponse> { continuation ->
                val geocoding = MapboxGeocoding.builder()
                    .accessToken(BuildConfig.MAPBOX_ACCESS_TOKEN)
                    .query(Point.fromLngLat(location.longitude, location.latitude))
                    .build()
                
                geocoding.enqueueCall(object : retrofit2.Callback<GeocodingResponse> {
                    override fun onResponse(call: retrofit2.Call<GeocodingResponse>, response: retrofit2.Response<GeocodingResponse>) {
                        if (response.isSuccessful && response.body() != null) {
                            continuation.resume(response.body()!!)
                        } else {
                            continuation.resumeWithException(Exception("Reverse geocoding failed: ${response.message()}"))
                        }
                    }
                    
                    override fun onFailure(call: retrofit2.Call<GeocodingResponse>, t: Throwable) {
                        continuation.resumeWithException(t)
                    }
                })
            }

            val feature = geocodingResponse.features()?.firstOrNull()
            if (feature != null) {
                Result.success(feature.placeName() ?: "Unknown location")
            } else {
                Result.failure(Exception("No address found for location"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun calculateRoute(
        startLocation: Location,
        endLocation: Location
    ): Result<RouteInfo> {
        return try {
            val directionsResponse = suspendCancellableCoroutine<DirectionsResponse> { continuation ->
                val directions = MapboxDirections.builder()
                    .accessToken(BuildConfig.MAPBOX_ACCESS_TOKEN)
                    .origin(Point.fromLngLat(startLocation.longitude, startLocation.latitude))
                    .destination(Point.fromLngLat(endLocation.longitude, endLocation.latitude))
                    .profile(DirectionsCriteria.PROFILE_DRIVING)
                    .build()
                
                directions.enqueueCall(object : retrofit2.Callback<DirectionsResponse> {
                    override fun onResponse(call: retrofit2.Call<DirectionsResponse>, response: retrofit2.Response<DirectionsResponse>) {
                        if (response.isSuccessful && response.body() != null) {
                            continuation.resume(response.body()!!)
                        } else {
                            continuation.resumeWithException(Exception("Directions failed: ${response.message()}"))
                        }
                    }
                    
                    override fun onFailure(call: retrofit2.Call<DirectionsResponse>, t: Throwable) {
                        continuation.resumeWithException(t)
                    }
                })
            }

            val route = directionsResponse.routes()?.firstOrNull()
            if (route != null) {
                val routeInfo = RouteInfo(
                    distance = route.distance()?.toDouble()?.div(1000) ?: 0.0, // Convert to kilometers
                    duration = route.duration()?.toInt()?.div(60) ?: 0, // Convert to minutes
                    polyline = route.geometry() ?: "",
                    waypoints = listOf(startLocation, endLocation)
                )
                Result.success(routeInfo)
            } else {
                Result.failure(Exception("No route found"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun startLocationTracking(): Result<Unit> {
        return try {
            if (!isLocationPermissionGranted()) {
                return Result.failure(SecurityException("Location permission not granted"))
            }

            // Mapbox location tracking would be implemented here
            // For now, we'll simulate location updates
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun stopLocationTracking(): Result<Unit> {
        return try {
            // Stop Mapbox location tracking
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun isLocationPermissionGranted(): Boolean {
        return android.content.pm.PackageManager.PERMISSION_GRANTED == 
            context.checkSelfPermission(android.Manifest.permission.ACCESS_FINE_LOCATION)
    }

    override suspend fun requestLocationPermission(): Result<Unit> {
        return if (isLocationPermissionGranted()) {
            Result.success(Unit)
        } else {
            Result.failure(SecurityException("Location permission required"))
        }
    }
}
