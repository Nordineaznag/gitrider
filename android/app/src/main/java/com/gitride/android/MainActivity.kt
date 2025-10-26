package com.gitride.android

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import com.gitride.android.ui.screens.auth.LoginScreen
import com.gitride.android.ui.screens.user.UserDashboard
import com.gitride.android.ui.theme.GitRideTheme
import com.gitride.android.ui.viewmodel.AuthViewModel
import com.gitride.android.data.repository.AuthState
import dagger.hilt.android.AndroidEntryPoint

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            GitRideTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    GitRideApp()
                }
            }
        }
    }
}

@Composable
fun GitRideApp(
    authViewModel: AuthViewModel = hiltViewModel()
) {
    val authState by authViewModel.authState.collectAsState()

    when (authState) {
        is AuthState.Loading -> {
            // Show loading screen
            androidx.compose.material3.CircularProgressIndicator()
        }
        is AuthState.Authenticated -> {
            UserDashboard(
                onNavigateToRideBooking = { /* Navigate to ride booking */ },
                onNavigateToRideHistory = { /* Navigate to ride history */ }
            )
        }
        is AuthState.Unauthenticated, is AuthState.Error -> {
            LoginScreen(
                onLoginSuccess = { /* Handle login success */ },
                onNavigateToSignUp = { /* Navigate to sign up */ }
            )
        }
    }
}
