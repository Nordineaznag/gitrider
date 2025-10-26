package com.gitride.android.data.local

import androidx.room.TypeConverter
import com.gitride.android.data.model.RideStatus
import com.gitride.android.data.model.PaymentMethod
import com.gitride.android.data.model.PaymentStatus
import com.gitride.android.data.model.UserRole
import com.gitride.android.data.model.VehicleType
import java.util.Date

class Converters {
    
    @TypeConverter
    fun fromTimestamp(value: Long?): Date? {
        return value?.let { Date(it) }
    }

    @TypeConverter
    fun dateToTimestamp(date: Date?): Long? {
        return date?.time
    }

    @TypeConverter
    fun fromRideStatus(status: RideStatus?): String? {
        return status?.name
    }

    @TypeConverter
    fun toRideStatus(status: String?): RideStatus? {
        return status?.let { RideStatus.valueOf(it) }
    }

    @TypeConverter
    fun fromPaymentMethod(method: PaymentMethod?): String? {
        return method?.name
    }

    @TypeConverter
    fun toPaymentMethod(method: String?): PaymentMethod? {
        return method?.let { PaymentMethod.valueOf(it) }
    }

    @TypeConverter
    fun fromPaymentStatus(status: PaymentStatus?): String? {
        return status?.name
    }

    @TypeConverter
    fun toPaymentStatus(status: String?): PaymentStatus? {
        return status?.let { PaymentStatus.valueOf(it) }
    }

    @TypeConverter
    fun fromUserRole(role: UserRole?): String? {
        return role?.name
    }

    @TypeConverter
    fun toUserRole(role: String?): UserRole? {
        return role?.let { UserRole.valueOf(it) }
    }

    @TypeConverter
    fun fromVehicleType(type: VehicleType?): String? {
        return type?.name
    }

    @TypeConverter
    fun toVehicleType(type: String?): VehicleType? {
        return type?.let { VehicleType.valueOf(it) }
    }
}
