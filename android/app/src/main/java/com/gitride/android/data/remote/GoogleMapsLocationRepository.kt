package com.gitride.android.data.remote

import android.content.Context
import android.location.Location as AndroidLocation
import com.gitride.android.data.model.Location
import com.gitride.android.data.repository.LocationRepository
import com.gitride.android.data.repository.RouteInfo
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.maps.model.LatLng
import com.google.android.gms.tasks.Task
import com.google.maps.DirectionsApi
import com.google.maps.GeoApiContext
import com.google.maps.model.DirectionsResult
import com.google.maps.model.TravelMode
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
class GoogleMapsLocationRepository @Inject constructor(
    private val context: Context
) : LocationRepository {

    private val fusedLocationClient: FusedLocationProviderClient = 
        LocationServices.getFusedLocationProviderClient(context)
    
    private val geoApiContext = GeoApiContext.Builder()
        .apiKey(context.getString(com.gitride.android.R.string.google_maps_key))
        .build()

    private val _locationUpdates = MutableStateFlow<Location?>(null)
    override fun observeLocationUpdates(): Flow<Location> = _locationUpdates.asStateFlow().let { flow ->
        flow.filterNotNull()
    }

    override suspend fun getCurrentLocation(): Result<Location> {
        return try {
            if (!isLocationPermissionGranted()) {
                return Result.failure(SecurityException("Location permission not granted"))
            }

            val androidLocation = fusedLocationClient.lastLocation.await()
            androidLocation?.let { location ->
                val gitRideLocation = Location(
                    latitude = location.latitude,
                    longitude = location.longitude,
                    timestamp = location.time
                )
                _locationUpdates.value = gitRideLocation
                Result.success(gitRideLocation)
            } ?: Result.failure(Exception("Location not available"))
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getLocationFromAddress(address: String): Result<Location> {
        return try {
            val geocodingResult = suspendCancellableCoroutine<com.google.maps.model.GeocodingResult> { continuation ->
                com.google.maps.GeocodingApi.geocode(geoApiContext, address)
                    .setCallback { result, status ->
                        if (status == com.google.maps.model.GeocodingApiStatus.OK && result.isNotEmpty()) {
                            continuation.resume(result[0])
                        } else {
                            continuation.resumeWithException(Exception("Geocoding failed: $status"))
                        }
                    }
            }

            val location = Location(
                latitude = geocodingResult.geometry.location.lat,
                longitude = geocodingResult.geometry.location.lng,
                address = geocodingResult.formattedAddress
            )
            Result.success(location)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getAddressFromLocation(location: Location): Result<String> {
        return try {
            val geocodingResult = suspendCancellableCoroutine<com.google.maps.model.GeocodingResult> { continuation ->
                com.google.maps.GeocodingApi.reverseGeocode(geoApiContext, 
                    com.google.maps.model.LatLng(location.latitude, location.longitude))
                    .setCallback { result, status ->
                        if (status == com.google.maps.model.GeocodingApiStatus.OK && result.isNotEmpty()) {
                            continuation.resume(result[0])
                        } else {
                            continuation.resumeWithException(Exception("Reverse geocoding failed: $status"))
                        }
                    }
            }
            Result.success(geocodingResult.formattedAddress)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun calculateRoute(
        startLocation: Location,
        endLocation: Location
    ): Result<RouteInfo> {
        return try {
            val directionsResult = suspendCancellableCoroutine<DirectionsResult> { continuation ->
                DirectionsApi.newRequest(geoApiContext)
                    .origin(com.google.maps.model.LatLng(startLocation.latitude, startLocation.longitude))
                    .destination(com.google.maps.model.LatLng(endLocation.latitude, endLocation.longitude))
                    .mode(TravelMode.DRIVING)
                    .setCallback { result, status ->
                        if (status == com.google.maps.model.DirectionsApiStatus.OK && result.routes.isNotEmpty()) {
                            continuation.resume(result)
                        } else {
                            continuation.resumeWithException(Exception("Directions failed: $status"))
                        }
                    }
            }

            val route = directionsResult.routes[0]
            val leg = route.legs[0]
            
            val routeInfo = RouteInfo(
                distance = leg.distance.inMeters / 1000.0, // Convert to kilometers
                duration = leg.duration.inSeconds / 60, // Convert to minutes
                polyline = route.overviewPolyline.encodedPath,
                waypoints = route.legs.flatMap { leg ->
                    leg.steps.map { step ->
                        Location(
                            latitude = step.startLocation.lat,
                            longitude = step.startLocation.lng
                        )
                    }
                }
            )
            
            Result.success(routeInfo)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun startLocationTracking(): Result<Unit> {
        return try {
            if (!isLocationPermissionGranted()) {
                return Result.failure(SecurityException("Location permission not granted"))
            }

            // Start location updates
            fusedLocationClient.requestLocationUpdates(
                com.google.android.gms.location.LocationRequest.Builder(
                    Priority.PRIORITY_HIGH_ACCURACY,
                    5000 // 5 seconds
                ).build(),
                { location ->
                    val gitRideLocation = Location(
                        latitude = location.latitude,
                        longitude = location.longitude,
                        timestamp = location.time
                    )
                    _locationUpdates.value = gitRideLocation
                },
                context.mainLooper
            )
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun stopLocationTracking(): Result<Unit> {
        return try {
            fusedLocationClient.removeLocationUpdates { }
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
        // This should be handled by the UI layer with proper permission request flow
        return if (isLocationPermissionGranted()) {
            Result.success(Unit)
        } else {
            Result.failure(SecurityException("Location permission required"))
        }
    }
}
