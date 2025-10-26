package com.gitride.android.data.model

import org.junit.Test
import org.junit.Assert.*

class UserTest {

    @Test
    fun `user creation with default values`() {
        val user = User(
            email = "test@example.com",
            fullName = "Test User"
        )
        
        assertEquals("test@example.com", user.email)
        assertEquals("Test User", user.fullName)
        assertEquals(UserRole.USER, user.role)
        assertEquals(0.0, user.rating, 0.0)
        assertEquals(0, user.totalRides)
        assertNotNull(user.id)
        assertTrue(user.id.isNotEmpty())
    }

    @Test
    fun `user with custom values`() {
        val user = User(
            id = "custom-id",
            email = "driver@example.com",
            fullName = "Driver User",
            phone = "+1234567890",
            avatarUrl = "https://example.com/avatar.jpg",
            role = UserRole.DRIVER,
            rating = 4.5,
            totalRides = 100
        )
        
        assertEquals("custom-id", user.id)
        assertEquals("driver@example.com", user.email)
        assertEquals("Driver User", user.fullName)
        assertEquals("+1234567890", user.phone)
        assertEquals("https://example.com/avatar.jpg", user.avatarUrl)
        assertEquals(UserRole.DRIVER, user.role)
        assertEquals(4.5, user.rating, 0.0)
        assertEquals(100, user.totalRides)
    }

    @Test
    fun `driver profile creation`() {
        val driverProfile = DriverProfile(
            id = "driver-123",
            vehicleType = VehicleType.PREMIUM,
            vehicleMake = "Toyota",
            vehicleModel = "Camry",
            vehicleYear = 2020,
            licensePlate = "ABC123",
            licenseNumber = "DL123456",
            isAvailable = true,
            currentLatitude = 40.7128,
            currentLongitude = -74.0060
        )
        
        assertEquals("driver-123", driverProfile.id)
        assertEquals(VehicleType.PREMIUM, driverProfile.vehicleType)
        assertEquals("Toyota", driverProfile.vehicleMake)
        assertEquals("Camry", driverProfile.vehicleModel)
        assertEquals(2020, driverProfile.vehicleYear)
        assertEquals("ABC123", driverProfile.licensePlate)
        assertEquals("DL123456", driverProfile.licenseNumber)
        assertTrue(driverProfile.isAvailable)
        assertEquals(40.7128, driverProfile.currentLatitude, 0.0)
        assertEquals(-74.0060, driverProfile.currentLongitude, 0.0)
    }
}
