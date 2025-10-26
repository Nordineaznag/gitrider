package com.gitride.android.ui.viewmodel

import com.gitride.android.data.repository.AuthRepository
import com.gitride.android.data.repository.AuthState
import com.gitride.android.data.model.User
import com.gitride.android.data.model.UserRole
import io.mockk.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.flowOf
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.Assert.*

@ExperimentalCoroutinesApi
class AuthViewModelTest {

    private lateinit var authRepository: AuthRepository
    private lateinit var authViewModel: AuthViewModel
    private val testDispatcher = UnconfinedTestDispatcher()

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        authRepository = mockk()
        authViewModel = AuthViewModel(authRepository)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `signIn calls repository with correct parameters`() = runTest {
        // Given
        val email = "test@example.com"
        val password = "password123"
        val user = User(
            email = email,
            fullName = "Test User",
            role = UserRole.USER
        )
        
        coEvery { authRepository.signIn(email, password) } returns Result.success(user)
        coEvery { authRepository.observeAuthState() } returns flowOf(AuthState.Authenticated(user))

        // When
        authViewModel.signIn(email, password)

        // Then
        coVerify { authRepository.signIn(email, password) }
    }

    @Test
    fun `signUp calls repository with correct parameters`() = runTest {
        // Given
        val email = "test@example.com"
        val password = "password123"
        val fullName = "Test User"
        val user = User(
            email = email,
            fullName = fullName,
            role = UserRole.USER
        )
        
        coEvery { authRepository.signUp(email, password, fullName) } returns Result.success(user)
        coEvery { authRepository.observeAuthState() } returns flowOf(AuthState.Authenticated(user))

        // When
        authViewModel.signUp(email, password, fullName)

        // Then
        coVerify { authRepository.signUp(email, password, fullName) }
    }

    @Test
    fun `signOut calls repository`() = runTest {
        // Given
        coEvery { authRepository.signOut() } returns Result.success(Unit)
        coEvery { authRepository.observeAuthState() } returns flowOf(AuthState.Unauthenticated)

        // When
        authViewModel.signOut()

        // Then
        coVerify { authRepository.signOut() }
    }

    @Test
    fun `authState emits loading initially`() = runTest {
        // Given
        coEvery { authRepository.observeAuthState() } returns flowOf(AuthState.Loading)

        // When
        val authState = authViewModel.authState.value

        // Then
        assertTrue(authState is AuthState.Loading)
    }

    @Test
    fun `authState emits authenticated when user is signed in`() = runTest {
        // Given
        val user = User(
            email = "test@example.com",
            fullName = "Test User",
            role = UserRole.USER
        )
        coEvery { authRepository.observeAuthState() } returns flowOf(AuthState.Authenticated(user))

        // When
        val authState = authViewModel.authState.value

        // Then
        assertTrue(authState is AuthState.Authenticated)
        assertEquals(user, (authState as AuthState.Authenticated).user)
    }

    @Test
    fun `authState emits error when authentication fails`() = runTest {
        // Given
        val errorMessage = "Authentication failed"
        coEvery { authRepository.observeAuthState() } returns flowOf(AuthState.Error(errorMessage))

        // When
        val authState = authViewModel.authState.value

        // Then
        assertTrue(authState is AuthState.Error)
        assertEquals(errorMessage, (authState as AuthState.Error).message)
    }
}
