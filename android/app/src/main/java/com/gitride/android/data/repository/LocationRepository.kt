package com.gitride.android.data.repository

import com.gitride.android.data.model.Location
import kotlinx.coroutines.flow.Flow

interface LocationRepository {
    suspend fun getCurrentLocation(): Result<Location>
    suspend fun getLocationFromAddress(address: String): Result<Location>
    suspend fun getAddressFromLocation(location: Location): Result<String>
    suspend fun calculateRoute(
        startLocation: Location,
        endLocation: Location
    ): Result<RouteInfo>
    
    fun observeLocationUpdates(): Flow<Location>
    suspend fun startLocationTracking(): Result<Unit>
    suspend fun stopLocationTracking(): Result<Unit>
    suspend fun isLocationPermissionGranted(): Boolean
    suspend fun requestLocationPermission(): Result<Unit>
}

data class RouteInfo(
    val distance: Double, // in kilometers
    val duration: Int, // in minutes
    val polyline: String, // encoded polyline
    val waypoints: List<Location>
)
