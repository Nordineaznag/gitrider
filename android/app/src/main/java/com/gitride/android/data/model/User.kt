package com.gitride.android.data.model

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.UUID

@Parcelize
data class User(
    val id: String = UUID.randomUUID().toString(),
    val email: String,
    val fullName: String,
    val phone: String? = null,
    val avatarUrl: String? = null,
    val role: UserRole = UserRole.USER,
    val rating: Double = 0.0,
    val totalRides: Int = 0,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
) : Parcelable

enum class UserRole {
    USER, DRIVER
}

@Parcelize
data class DriverProfile(
    val id: String,
    val vehicleType: VehicleType = VehicleType.STANDARD,
    val vehicleMake: String? = null,
    val vehicleModel: String? = null,
    val vehicleYear: Int? = null,
    val licensePlate: String? = null,
    val licenseNumber: String? = null,
    val isAvailable: Boolean = false,
    val currentLatitude: Double? = null,
    val currentLongitude: Double? = null,
    val createdAt: Long = System.currentTimeMillis(),
    val updatedAt: Long = System.currentTimeMillis()
) : Parcelable

enum class VehicleType {
    STANDARD, PREMIUM, LUXURY, SUV
}
