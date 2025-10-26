package com.gitride.android.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.UUID

@Parcelize
data class Ride(
    val id: String = UUID.randomUUID().toString(),
    val userId: String,
    val driverId: String? = null,
    val status: RideStatus = RideStatus.REQUESTED,
    val pickupLocation: Location,
    val dropoffLocation: Location,
    val distanceKm: Double? = null,
    val durationMinutes: Int? = null,
    val fareAmount: Double? = null,
    val paymentMethod: PaymentMethod = PaymentMethod.CARD,
    val paymentStatus: PaymentStatus = PaymentStatus.PENDING,
    val driverRating: Int? = null,
    val userRating: Int? = null,
    val requestedAt: Long = System.currentTimeMillis(),
    val acceptedAt: Long? = null,
    val startedAt: Long? = null,
    val completedAt: Long? = null,
    val createdAt: Long = System.currentTimeMillis()
) : Parcelable

@Parcelize
data class Location(
    val latitude: Double,
    val longitude: Double,
    val address: String? = null,
    val timestamp: Long = System.currentTimeMillis()
) : Parcelable

enum class RideStatus {
    REQUESTED, ACCEPTED, IN_PROGRESS, COMPLETED, CANCELLED
}

enum class PaymentMethod {
    CARD, CASH, WALLET
}

enum class PaymentStatus {
    PENDING, COMPLETED, FAILED
}

@Parcelize
data class RideLocation(
    val id: String = UUID.randomUUID().toString(),
    val rideId: String,
    val latitude: Double,
    val longitude: Double,
    val heading: Double? = null,
    val speed: Double? = null,
    val timestamp: Long = System.currentTimeMillis()
) : Parcelable
