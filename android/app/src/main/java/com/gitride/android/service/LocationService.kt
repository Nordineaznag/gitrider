package com.gitride.android.service

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.location.Location
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import com.gitride.android.MainActivity
import com.gitride.android.R
import com.gitride.android.data.model.Location as GitRideLocation
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import dagger.hilt.android.AndroidEntryPoint
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.launch
import javax.inject.Inject

@AndroidEntryPoint
class LocationService : Service() {

    @Inject
    lateinit var locationRepository: com.gitride.android.data.repository.LocationRepository

    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private var currentRideId: String? = null

    private val locationCallback = object : LocationCallback() {
        override fun onLocationResult(locationResult: LocationResult) {
            locationResult.lastLocation?.let { location ->
                val gitRideLocation = GitRideLocation(
                    latitude = location.latitude,
                    longitude = location.longitude,
                    timestamp = location.time
                )
                
                // Update ride location if there's an active ride
                currentRideId?.let { rideId ->
                    serviceScope.launch {
                        locationRepository.updateRideLocation(rideId, gitRideLocation)
                    }
                }
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_START_LOCATION_SERVICE -> {
                currentRideId = intent.getStringExtra(EXTRA_RIDE_ID)
                startForegroundService()
                startLocationUpdates()
            }
            ACTION_STOP_LOCATION_SERVICE -> {
                stopLocationUpdates()
                stopForegroundService()
            }
        }
        return START_STICKY
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startForegroundService() {
        val notificationIntent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this, 0, notificationIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification = NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("GitRide Location Tracking")
            .setContentText("Tracking your location for ride")
            .setSmallIcon(R.drawable.ic_location)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()

        startForeground(NOTIFICATION_ID, notification)
    }

    private fun stopForegroundService() {
        stopForeground(true)
        stopSelf()
    }

    private fun startLocationUpdates() {
        try {
            val locationRequest = LocationRequest.Builder(
                Priority.PRIORITY_HIGH_ACCURACY,
                5000 // 5 seconds
            ).apply {
                setMinUpdateIntervalMillis(3000) // 3 seconds minimum
                setMaxUpdateDelayMillis(10000) // 10 seconds maximum
            }.build()

            fusedLocationClient.requestLocationUpdates(
                locationRequest,
                locationCallback,
                null
            )
        } catch (e: SecurityException) {
            // Handle permission not granted
        }
    }

    private fun stopLocationUpdates() {
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Location Service",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Tracks location during rides"
                setShowBadge(false)
            }

            val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            notificationManager.createNotificationChannel(channel)
        }
    }

    companion object {
        const val ACTION_START_LOCATION_SERVICE = "startLocationService"
        const val ACTION_STOP_LOCATION_SERVICE = "stopLocationService"
        const val EXTRA_RIDE_ID = "rideId"
        
        private const val CHANNEL_ID = "location_service_channel"
        private const val NOTIFICATION_ID = 1

        fun startService(context: Context, rideId: String? = null) {
            val intent = Intent(context, LocationService::class.java).apply {
                action = ACTION_START_LOCATION_SERVICE
                putExtra(EXTRA_RIDE_ID, rideId)
            }
            context.startForegroundService(intent)
        }

        fun stopService(context: Context) {
            val intent = Intent(context, LocationService::class.java).apply {
                action = ACTION_STOP_LOCATION_SERVICE
            }
            context.startService(intent)
        }
    }
}
