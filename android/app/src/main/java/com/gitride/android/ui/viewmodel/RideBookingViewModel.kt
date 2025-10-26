package com.gitride.android.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.gitride.android.data.model.Location
import com.gitride.android.data.model.Ride
import com.gitride.android.data.repository.LocationRepository
import com.gitride.android.data.repository.RideRepository
import com.gitride.android.data.repository.AuthRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class RideBookingViewModel @Inject constructor(
    private val locationRepository: LocationRepository,
    private val rideRepository: RideRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _pickupLocation = MutableStateFlow<Location?>(null)
    val pickupLocation: StateFlow<Location?> = _pickupLocation.asStateFlow()

    private val _dropoffLocation = MutableStateFlow<Location?>(null)
    val dropoffLocation: StateFlow<Location?> = _dropoffLocation.asStateFlow()

    private val _estimatedFare = MutableStateFlow<Double?>(null)
    val estimatedFare: StateFlow<Double?> = _estimatedFare.asStateFlow()

    private val _isLoading = MutableStateFlow(false)
    val isLoading: StateFlow<Boolean> = _isLoading.asStateFlow()

    private val _errorMessage = MutableStateFlow("")
    val errorMessage: StateFlow<String> = _errorMessage.asStateFlow()

    fun getCurrentLocation() {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = ""
            
            locationRepository.getCurrentLocation().fold(
                onSuccess = { location ->
                    _pickupLocation.value = location
                    calculateFare()
                },
                onFailure = { error ->
                    _errorMessage.value = error.message ?: "Failed to get current location"
                }
            )
            _isLoading.value = false
        }
    }

    fun setPickupLocation(location: Location) {
        _pickupLocation.value = location
        calculateFare()
    }

    fun setDropoffLocation(location: Location) {
        _dropoffLocation.value = location
        calculateFare()
    }

    private fun calculateFare() {
        val pickup = _pickupLocation.value
        val dropoff = _dropoffLocation.value
        
        if (pickup != null && dropoff != null) {
            viewModelScope.launch {
                locationRepository.calculateRoute(pickup, dropoff).fold(
                    onSuccess = { routeInfo ->
                        // Simple fare calculation: $2 base + $1.50 per km
                        val baseFare = 2.0
                        val distanceFare = routeInfo.distance * 1.5
                        _estimatedFare.value = baseFare + distanceFare
                    },
                    onFailure = { error ->
                        _errorMessage.value = error.message ?: "Failed to calculate route"
                    }
                )
            }
        }
    }

    fun requestRide(pickup: Location, dropoff: Location) {
        viewModelScope.launch {
            _isLoading.value = true
            _errorMessage.value = ""
            
            val currentUser = authRepository.getCurrentUser()
            if (currentUser == null) {
                _errorMessage.value = "User not authenticated"
                _isLoading.value = false
                return@launch
            }
            
            rideRepository.requestRide(currentUser.id, pickup, dropoff).fold(
                onSuccess = { ride ->
                    // Handle successful ride request
                    _isLoading.value = false
                },
                onFailure = { error ->
                    _errorMessage.value = error.message ?: "Failed to request ride"
                    _isLoading.value = false
                }
            )
        }
    }
}
