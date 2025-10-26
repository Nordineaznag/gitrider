package com.gitride.android.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface RideDao {
    @Query("SELECT * FROM ride WHERE id = :rideId")
    suspend fun getRideById(rideId: String): Ride?

    @Query("SELECT * FROM ride WHERE id = :rideId")
    fun observeRideById(rideId: String): Flow<Ride?>

    @Query("SELECT * FROM ride WHERE user_id = :userId ORDER BY created_at DESC")
    suspend fun getUserRides(userId: String): List<Ride>

    @Query("SELECT * FROM ride WHERE user_id = :userId ORDER BY created_at DESC")
    fun observeUserRides(userId: String): Flow<List<Ride>>

    @Query("SELECT * FROM ride WHERE driver_id = :driverId ORDER BY created_at DESC")
    suspend fun getDriverRides(driverId: String): List<Ride>

    @Query("SELECT * FROM ride WHERE driver_id = :driverId ORDER BY created_at DESC")
    fun observeDriverRides(driverId: String): Flow<List<Ride>>

    @Query("SELECT * FROM ride WHERE user_id = :userId AND status IN ('REQUESTED', 'ACCEPTED', 'IN_PROGRESS') LIMIT 1")
    suspend fun getActiveRide(userId: String): Ride?

    @Query("SELECT * FROM ride WHERE user_id = :userId AND status IN ('REQUESTED', 'ACCEPTED', 'IN_PROGRESS') LIMIT 1")
    fun observeActiveRide(userId: String): Flow<Ride?>

    @Query("SELECT * FROM ride WHERE status = 'REQUESTED' ORDER BY requested_at ASC")
    suspend fun getAvailableRides(): List<Ride>

    @Query("SELECT * FROM ride WHERE status = 'REQUESTED' ORDER BY requested_at ASC")
    fun observeAvailableRides(): Flow<List<Ride>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertRide(ride: Ride)

    @Update
    suspend fun updateRide(ride: Ride)

    @Delete
    suspend fun deleteRide(ride: Ride)

    @Query("DELETE FROM ride WHERE id = :rideId")
    suspend fun deleteRideById(rideId: String)
}
