package com.gitride.android.data.remote

import com.gitride.android.BuildConfig
import com.gitride.android.data.model.Ride
import com.gitride.android.data.model.RideStatus
import com.gitride.android.data.model.Location
import com.gitride.android.data.repository.RideRepository
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.realtime.Realtime
import io.github.jan.supabase.realtime.channel
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SupabaseRideRepository @Inject constructor() : RideRepository {

    private val supabase = createSupabaseClient(
        supabaseUrl = BuildConfig.SUPABASE_URL,
        supabaseKey = BuildConfig.SUPABASE_ANON_KEY
    ) {
        install(Postgrest)
        install(Realtime)
    }

    override suspend fun requestRide(
        userId: String,
        pickupLocation: Location,
        dropoffLocation: Location
    ): Result<Ride> {
        return try {
            val ride = Ride(
                userId = userId,
                pickupLocation = pickupLocation,
                dropoffLocation = dropoffLocation
            )
            
            val result = supabase.from("rides")
                .insert(ride)
                .decodeSingle<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun acceptRide(rideId: String, driverId: String): Result<Ride> {
        return try {
            val result = supabase.from("rides")
                .update(mapOf(
                    "driver_id" to driverId,
                    "status" to RideStatus.ACCEPTED.name,
                    "accepted_at" to System.currentTimeMillis()
                ))
                .eq("id", rideId)
                .decodeSingle<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun startRide(rideId: String): Result<Ride> {
        return try {
            val result = supabase.from("rides")
                .update(mapOf(
                    "status" to RideStatus.IN_PROGRESS.name,
                    "started_at" to System.currentTimeMillis()
                ))
                .eq("id", rideId)
                .decodeSingle<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun completeRide(rideId: String): Result<Ride> {
        return try {
            val result = supabase.from("rides")
                .update(mapOf(
                    "status" to RideStatus.COMPLETED.name,
                    "completed_at" to System.currentTimeMillis()
                ))
                .eq("id", rideId)
                .decodeSingle<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun cancelRide(rideId: String, reason: String?): Result<Ride> {
        return try {
            val result = supabase.from("rides")
                .update(mapOf(
                    "status" to RideStatus.CANCELLED.name
                ))
                .eq("id", rideId)
                .decodeSingle<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun updateRideLocation(rideId: String, location: Location): Result<Unit> {
        return try {
            supabase.from("ride_locations")
                .insert(mapOf(
                    "ride_id" to rideId,
                    "latitude" to location.latitude,
                    "longitude" to location.longitude,
                    "timestamp" to location.timestamp
                ))
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun rateRide(rideId: String, rating: Int, isDriverRating: Boolean): Result<Unit> {
        return try {
            val field = if (isDriverRating) "driver_rating" else "user_rating"
            supabase.from("rides")
                .update(mapOf(field to rating))
                .eq("id", rideId)
            
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getRideById(rideId: String): Result<Ride> {
        return try {
            val result = supabase.from("rides")
                .select()
                .eq("id", rideId)
                .decodeSingle<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getUserRides(userId: String): Result<List<Ride>> {
        return try {
            val result = supabase.from("rides")
                .select()
                .eq("user_id", userId)
                .order("created_at", ascending = false)
                .decodeList<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getDriverRides(driverId: String): Result<List<Ride>> {
        return try {
            val result = supabase.from("rides")
                .select()
                .eq("driver_id", driverId)
                .order("created_at", ascending = false)
                .decodeList<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getActiveRide(userId: String): Result<Ride?> {
        return try {
            val result = supabase.from("rides")
                .select()
                .eq("user_id", userId)
                .in_("status", listOf("REQUESTED", "ACCEPTED", "IN_PROGRESS"))
                .maybeSingle<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun getAvailableRides(): Result<List<Ride>> {
        return try {
            val result = supabase.from("rides")
                .select()
                .eq("status", RideStatus.REQUESTED.name)
                .order("requested_at", ascending = true)
                .decodeList<Ride>()
            
            Result.success(result)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override fun observeRideUpdates(rideId: String): Flow<Ride> = flow {
        supabase.channel("ride_$rideId") {
            on("postgres_changes") {
                filter = "eq=id,$rideId"
                table = "rides"
                // Handle real-time updates
            }
        }.subscribe()
    }

    override fun observeUserRides(userId: String): Flow<List<Ride>> = flow {
        supabase.channel("user_rides_$userId") {
            on("postgres_changes") {
                filter = "eq=user_id,$userId"
                table = "rides"
                // Handle real-time updates
            }
        }.subscribe()
    }

    override fun observeAvailableRides(): Flow<List<Ride>> = flow {
        supabase.channel("available_rides") {
            on("postgres_changes") {
                filter = "eq=status,REQUESTED"
                table = "rides"
                // Handle real-time updates
            }
        }.subscribe()
    }
}
