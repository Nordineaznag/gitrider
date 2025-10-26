package com.gitride.android.data.model

import org.junit.Test
import org.junit.Assert.*

class RideTest {

    @Test
    fun `ride creation with default values`() {
        val pickupLocation = Location(40.7128, -74.0060, "New York, NY")
        val dropoffLocation = Location(40.7589, -73.9851, "Times Square, NY")
        
        val ride = Ride(
            userId = "user-123",
            pickupLocation = pickupLocation,
            dropoffLocation = dropoffLocation
        )
        
        assertEquals("user-123", ride.userId)
        assertNull(ride.driverId)
        assertEquals(RideStatus.REQUESTED, ride.status)
        assertEquals(pickupLocation, ride.pickupLocation)
        assertEquals(dropoffLocation, ride.dropoffLocation)
        assertNull(ride.distanceKm)
        assertNull(ride.durationMinutes)
        assertNull(ride.fareAmount)
        assertEquals(PaymentMethod.CARD, ride.paymentMethod)
        assertEquals(PaymentStatus.PENDING, ride.paymentStatus)
        assertNull(ride.driverRating)
        assertNull(ride.userRating)
        assertNotNull(ride.requestedAt)
        assertNull(ride.acceptedAt)
        assertNull(ride.startedAt)
        assertNull(ride.completedAt)
        assertNotNull(ride.id)
        assertTrue(ride.id.isNotEmpty())
    }

    @Test
    fun `ride with complete information`() {
        val pickupLocation = Location(40.7128, -74.0060, "New York, NY")
        val dropoffLocation = Location(40.7589, -73.9851, "Times Square, NY")
        
        val ride = Ride(
            id = "ride-123",
            userId = "user-123",
            driverId = "driver-456",
            status = RideStatus.COMPLETED,
            pickupLocation = pickupLocation,
            dropoffLocation = dropoffLocation,
            distanceKm = 5.2,
            durationMinutes = 15,
            fareAmount = 12.50,
            paymentMethod = PaymentMethod.CARD,
            paymentStatus = PaymentStatus.COMPLETED,
            driverRating = 5,
            userRating = 4,
            requestedAt = 1000L,
            acceptedAt = 2000L,
            startedAt = 3000L,
            completedAt = 4000L
        )
        
        assertEquals("ride-123", ride.id)
        assertEquals("user-123", ride.userId)
        assertEquals("driver-456", ride.driverId)
        assertEquals(RideStatus.COMPLETED, ride.status)
        assertEquals(5.2, ride.distanceKm, 0.0)
        assertEquals(15, ride.durationMinutes)
        assertEquals(12.50, ride.fareAmount, 0.0)
        assertEquals(PaymentMethod.CARD, ride.paymentMethod)
        assertEquals(PaymentStatus.COMPLETED, ride.paymentStatus)
        assertEquals(5, ride.driverRating)
        assertEquals(4, ride.userRating)
        assertEquals(1000L, ride.requestedAt)
        assertEquals(2000L, ride.acceptedAt)
        assertEquals(3000L, ride.startedAt)
        assertEquals(4000L, ride.completedAt)
    }

    @Test
    fun `location creation`() {
        val location = Location(
            latitude = 40.7128,
            longitude = -74.0060,
            address = "New York, NY",
            timestamp = 1234567890L
        )
        
        assertEquals(40.7128, location.latitude, 0.0)
        assertEquals(-74.0060, location.longitude, 0.0)
        assertEquals("New York, NY", location.address)
        assertEquals(1234567890L, location.timestamp)
    }

    @Test
    fun `ride location tracking`() {
        val rideLocation = RideLocation(
            rideId = "ride-123",
            latitude = 40.7128,
            longitude = -74.0060,
            heading = 45.0,
            speed = 25.5
        )
        
        assertEquals("ride-123", rideLocation.rideId)
        assertEquals(40.7128, rideLocation.latitude, 0.0)
        assertEquals(-74.0060, rideLocation.longitude, 0.0)
        assertEquals(45.0, rideLocation.heading, 0.0)
        assertEquals(25.5, rideLocation.speed, 0.0)
        assertNotNull(rideLocation.id)
        assertTrue(rideLocation.id.isNotEmpty())
    }
}
