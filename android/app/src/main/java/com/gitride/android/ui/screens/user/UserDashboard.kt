package com.gitride.android.ui.screens.user

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import com.gitride.android.data.model.Ride
import com.gitride.android.data.model.RideStatus

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserDashboard(
    onNavigateToRideBooking: () -> Unit,
    onNavigateToRideHistory: () -> Unit,
    viewModel: UserDashboardViewModel = hiltViewModel()
) {
    val user by viewModel.user.collectAsState()
    val activeRide by viewModel.activeRide.collectAsState()
    val recentRides by viewModel.recentRides.collectAsState()

    LaunchedEffect(Unit) {
        viewModel.loadUserData()
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { 
                    Text(
                        text = "Welcome, ${user?.fullName ?: "User"}",
                        fontWeight = FontWeight.Bold
                    )
                },
                actions = {
                    IconButton(onClick = { /* Profile settings */ }) {
                        Icon(Icons.Default.Person, contentDescription = "Profile")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = onNavigateToRideBooking,
                modifier = Modifier.padding(16.dp)
            ) {
                Icon(Icons.Default.Add, contentDescription = "Book Ride")
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Active Ride Card
            activeRide?.let { ride ->
                item {
                    ActiveRideCard(
                        ride = ride,
                        onCancelRide = { viewModel.cancelRide(ride.id) }
                    )
                }
            }

            // Quick Actions
            item {
                QuickActionsCard(
                    onBookRide = onNavigateToRideBooking,
                    onViewHistory = onNavigateToRideHistory
                )
            }

            // Recent Rides
            if (recentRides.isNotEmpty()) {
                item {
                    Text(
                        text = "Recent Rides",
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold
                    )
                }
                
                items(recentRides) { ride ->
                    RideHistoryCard(ride = ride)
                }
            }
        }
    }
}

@Composable
fun ActiveRideCard(
    ride: Ride,
    onCancelRide: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.primaryContainer
        )
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Active Ride",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                
                Text(
                    text = ride.status.name,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "From: ${ride.pickupLocation.address ?: "Unknown location"}",
                style = MaterialTheme.typography.bodyMedium
            )
            
            Text(
                text = "To: ${ride.dropoffLocation.address ?: "Unknown location"}",
                style = MaterialTheme.typography.bodyMedium
            )
            
            ride.fareAmount?.let { fare ->
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = "Fare: $${String.format("%.2f", fare)}",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                OutlinedButton(
                    onClick = onCancelRide,
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Cancel Ride")
                }
                
                Button(
                    onClick = { /* Track ride */ },
                    modifier = Modifier.weight(1f)
                ) {
                    Text("Track")
                }
            }
        }
    }
}

@Composable
fun QuickActionsCard(
    onBookRide: () -> Unit,
    onViewHistory: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = "Quick Actions",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Button(
                    onClick = onBookRide,
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Add, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Book Ride")
                }
                
                OutlinedButton(
                    onClick = onViewHistory,
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.History, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("History")
                }
            }
        }
    }
}

@Composable
fun RideHistoryCard(ride: Ride) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = ride.status.name,
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Bold
                )
                
                Text(
                    text = ride.fareAmount?.let { "$${String.format("%.2f", it)}" } ?: "N/A",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "From: ${ride.pickupLocation.address ?: "Unknown location"}",
                style = MaterialTheme.typography.bodyMedium
            )
            
            Text(
                text = "To: ${ride.dropoffLocation.address ?: "Unknown location"}",
                style = MaterialTheme.typography.bodyMedium
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "Date: ${java.text.SimpleDateFormat("MMM dd, yyyy", java.util.Locale.getDefault()).format(java.util.Date(ride.createdAt))}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
