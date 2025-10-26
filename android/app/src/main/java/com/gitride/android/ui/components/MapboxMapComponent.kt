package com.gitride.android.ui.components

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import com.gitride.android.BuildConfig
import com.gitride.android.data.model.Location
import com.mapbox.geojson.Point
import com.mapbox.maps.MapView
import com.mapbox.maps.Style
import com.mapbox.maps.extension.compose.MapboxMap
import com.mapbox.maps.extension.compose.animation.viewport.rememberMapViewportState
import com.mapbox.maps.extension.compose.style.MapStyle
import com.mapbox.maps.extension.compose.ui.MapView

@Composable
fun MapboxMapComponent(
    modifier: Modifier = Modifier,
    pickupLocation: Location? = null,
    dropoffLocation: Location? = null,
    onLocationSelected: (Location) -> Unit = {},
    onMapReady: () -> Unit = {}
) {
    val context = LocalContext.current
    
    // Initialize Mapbox
    LaunchedEffect(Unit) {
        com.mapbox.mapboxsdk.Mapbox.getInstance(context, BuildConfig.MAPBOX_ACCESS_TOKEN)
    }
    
    val mapViewportState = rememberMapViewportState {
        setCameraOptions {
            center = pickupLocation?.let { 
                Point.fromLngLat(it.longitude, it.latitude) 
            } ?: Point.fromLngLat(-74.0060, 40.7128) // Default to NYC
            zoom = 15.0
        }
    }
    
    MapboxMap(
        modifier = modifier.fillMaxSize(),
        mapViewportState = mapViewportState,
        style = {
            MapStyle(Style.MAPBOX_STREETS)
        }
    ) {
        // Pickup marker
        pickupLocation?.let { location ->
            Marker(
                point = Point.fromLngLat(location.longitude, location.latitude),
                textField = "Pickup"
            )
        }
        
        // Dropoff marker
        dropoffLocation?.let { location ->
            Marker(
                point = Point.fromLngLat(location.longitude, location.latitude),
                textField = "Dropoff"
            )
        }
        
        // Route line if both locations are set
        if (pickupLocation != null && dropoffLocation != null) {
            // Route would be drawn here
        }
    }
    
    LaunchedEffect(Unit) {
        onMapReady()
    }
}

@Composable
fun MapboxMapView(
    modifier: Modifier = Modifier,
    pickupLocation: Location? = null,
    dropoffLocation: Location? = null,
    onLocationSelected: (Location) -> Unit = {},
    onMapReady: () -> Unit = {}
) {
    val context = LocalContext.current
    
    // Initialize Mapbox
    LaunchedEffect(Unit) {
        com.mapbox.mapboxsdk.Mapbox.getInstance(context, BuildConfig.MAPBOX_ACCESS_TOKEN)
    }
    
    MapView(
        modifier = modifier.fillMaxSize(),
        context = context
    ) { mapView ->
        // Configure map
        mapView.getMapboxMap().loadStyleUri(Style.MAPBOX_STREETS) { style ->
            onMapReady()
            
            // Add pickup marker
            pickupLocation?.let { location ->
                // Add marker for pickup location
            }
            
            // Add dropoff marker
            dropoffLocation?.let { location ->
                // Add marker for dropoff location
            }
            
            // Add route if both locations are set
            if (pickupLocation != null && dropoffLocation != null) {
                // Draw route between locations
            }
        }
    }
}
