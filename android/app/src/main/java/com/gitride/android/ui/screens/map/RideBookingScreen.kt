package com.gitride.android.ui.screens.map

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.gitride.android.data.model.Location
import com.gitride.android.data.model.Ride
import com.gitride.android.ui.components.MapboxMapComponent

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RideBookingScreen(
    onNavigateBack: () -> Unit,
    onRideRequested: (Ride) -> Unit,
    viewModel: RideBookingViewModel = hiltViewModel()
) {
    val pickupLocation by viewModel.pickupLocation.collectAsState()
    val dropoffLocation by viewModel.dropoffLocation.collectAsState()
    val estimatedFare by viewModel.estimatedFare.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val errorMessage by viewModel.errorMessage.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.getCurrentLocation()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Book a Ride", fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onNavigateBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Mapbox Map
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
            ) {
                MapboxMapComponent(
                    modifier = Modifier.fillMaxSize(),
                    pickupLocation = pickupLocation,
                    dropoffLocation = dropoffLocation,
                    onLocationSelected = { location ->
                        // Handle location selection
                    },
                    onMapReady = {
                        // Map is ready
                    }
                )
                
                // Location picker buttons
                Column(
                    modifier = Modifier
                        .align(Alignment.TopEnd)
                        .padding(16.dp)
                ) {
                    FloatingActionButton(
                        onClick = { viewModel.getCurrentLocation() },
                        modifier = Modifier.size(48.dp)
                    ) {
                        Icon(Icons.Default.MyLocation, contentDescription = "Current Location")
                    }
                }
            }
            
            // Booking form
            Card(
                modifier = Modifier.fillMaxWidth(),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    // Pickup location
                    OutlinedTextField(
                        value = pickupLocation?.address ?: "",
                        onValueChange = { /* Handle address input */ },
                        label = { Text("Pickup Location") },
                        leadingIcon = {
                            Icon(Icons.Default.RadioButtonChecked, contentDescription = "Pickup")
                        },
                        trailingIcon = {
                            IconButton(onClick = { /* Open location picker */ }) {
                                Icon(Icons.Default.Search, contentDescription = "Search")
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        readOnly = true
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    // Dropoff location
                    OutlinedTextField(
                        value = dropoffLocation?.address ?: "",
                        onValueChange = { /* Handle address input */ },
                        label = { Text("Dropoff Location") },
                        leadingIcon = {
                            Icon(Icons.Default.RadioButtonUnchecked, contentDescription = "Dropoff")
                        },
                        trailingIcon = {
                            IconButton(onClick = { /* Open location picker */ }) {
                                Icon(Icons.Default.Search, contentDescription = "Search")
                            }
                        },
                        modifier = Modifier.fillMaxWidth(),
                        readOnly = true
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    // Estimated fare
                    if (estimatedFare != null) {
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.primaryContainer
                            )
                        ) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(16.dp),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(
                                        text = "Estimated Fare",
                                        style = MaterialTheme.typography.bodyMedium,
                                        color = MaterialTheme.colorScheme.onPrimaryContainer
                                    )
                                    Text(
                                        text = "$${String.format("%.2f", estimatedFare)}",
                                        style = MaterialTheme.typography.headlineSmall,
                                        fontWeight = FontWeight.Bold,
                                        color = MaterialTheme.colorScheme.onPrimaryContainer
                                    )
                                }
                                
                                Text(
                                    text = "~15 min",
                                    style = MaterialTheme.typography.bodyMedium,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                    
                    // Error message
                    if (errorMessage.isNotEmpty()) {
                        Card(
                            colors = CardDefaults.cardColors(
                                containerColor = MaterialTheme.colorScheme.errorContainer
                            )
                        ) {
                            Text(
                                text = errorMessage,
                                color = MaterialTheme.colorScheme.onErrorContainer,
                                modifier = Modifier.padding(16.dp)
                            )
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                    
                    // Request ride button
                    Button(
                        onClick = {
                            pickupLocation?.let { pickup ->
                                dropoffLocation?.let { dropoff ->
                                    viewModel.requestRide(pickup, dropoff)
                                }
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        enabled = pickupLocation != null && dropoffLocation != null && !isLoading
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                color = MaterialTheme.colorScheme.onPrimary
                            )
                        } else {
                            Text("Request Ride", fontSize = 16.sp)
                        }
                    }
                }
            }
        }
    }
}
