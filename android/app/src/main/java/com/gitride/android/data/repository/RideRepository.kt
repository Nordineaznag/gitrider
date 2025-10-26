package com.gitride.android.data.repository

import com.gitride.android.data.model.Ride
import com.gitride.android.data.model.RideStatus
import com.gitride.android.data.model.Location
import kotlinx.coroutines.flow.Flow

interface RideRepository {
    suspend fun requestRide(
        userId: String,
        pickupLocation: Location,
        dropoffLocation: Location
    ): Result<Ride>
    
    suspend fun acceptRide(rideId: String, driverId: String): Result<Ride>
    suspend fun startRide(rideId: String): Result<Ride>
    suspend fun completeRide(rideId: String): Result<Ride>
    suspend fun cancelRide(rideId: String, reason: String? = null): Result<Ride>
    
    suspend fun updateRideLocation(rideId: String, location: Location): Result<Unit>
    suspend fun rateRide(rideId: String, rating: Int, isDriverRating: Boolean): Result<Unit>
    
    suspend fun getRideById(rideId: String): Result<Ride>
    suspend fun getUserRides(userId: String): Result<List<Ride>>
    suspend fun getDriverRides(driverId: String): Result<List<Ride>>
    suspend fun getActiveRide(userId: String): Result<Ride?>
    suspend fun getAvailableRides(): Result<List<Ride>>
    
    fun observeRideUpdates(rideId: String): Flow<Ride>
    fun observeUserRides(userId: String): Flow<List<Ride>>
    fun observeAvailableRides(): Flow<List<Ride>>
}
