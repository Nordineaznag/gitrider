package com.gitride.android.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface LocationDao {
    @Query("SELECT * FROM location WHERE ride_id = :rideId ORDER BY timestamp DESC")
    suspend fun getRideLocations(rideId: String): List<Location>

    @Query("SELECT * FROM location WHERE ride_id = :rideId ORDER BY timestamp DESC")
    fun observeRideLocations(rideId: String): Flow<List<Location>>

    @Query("SELECT * FROM location WHERE ride_id = :rideId ORDER BY timestamp DESC LIMIT 1")
    suspend fun getLatestRideLocation(rideId: String): Location?

    @Query("SELECT * FROM location WHERE ride_id = :rideId ORDER BY timestamp DESC LIMIT 1")
    fun observeLatestRideLocation(rideId: String): Flow<Location?>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLocation(location: Location)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertLocations(locations: List<Location>)

    @Delete
    suspend fun deleteLocation(location: Location)

    @Query("DELETE FROM location WHERE ride_id = :rideId")
    suspend fun deleteRideLocations(rideId: String)

    @Query("DELETE FROM location WHERE timestamp < :cutoffTime")
    suspend fun deleteOldLocations(cutoffTime: Long)
}
