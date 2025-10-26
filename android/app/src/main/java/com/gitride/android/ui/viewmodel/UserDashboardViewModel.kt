package com.gitride.android.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.gitride.android.data.model.Ride
import com.gitride.android.data.model.User
import com.gitride.android.data.repository.AuthRepository
import com.gitride.android.data.repository.RideRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class UserDashboardViewModel @Inject constructor(
    private val authRepository: AuthRepository,
    private val rideRepository: RideRepository
) : ViewModel() {

    private val _user = MutableStateFlow<User?>(null)
    val user: StateFlow<User?> = _user.asStateFlow()

    private val _activeRide = MutableStateFlow<Ride?>(null)
    val activeRide: StateFlow<Ride?> = _activeRide.asStateFlow()

    private val _recentRides = MutableStateFlow<List<Ride>>(emptyList())
    val recentRides: StateFlow<List<Ride>> = _recentRides.asStateFlow()

    init {
        loadUserData()
    }

    fun loadUserData() {
        viewModelScope.launch {
            // Load current user
            authRepository.getCurrentUser()?.let { currentUser ->
                _user.value = currentUser
                
                // Load active ride
                rideRepository.getActiveRide(currentUser.id).fold(
                    onSuccess = { ride -> _activeRide.value = ride },
                    onFailure = { /* Handle error */ }
                )
                
                // Load recent rides
                rideRepository.getUserRides(currentUser.id).fold(
                    onSuccess = { rides -> _recentRides.value = rides.take(5) },
                    onFailure = { /* Handle error */ }
                )
            }
        }
    }

    fun cancelRide(rideId: String) {
        viewModelScope.launch {
            rideRepository.cancelRide(rideId).fold(
                onSuccess = { 
                    _activeRide.value = null
                    loadUserData() // Refresh data
                },
                onFailure = { /* Handle error */ }
            )
        }
    }
}
