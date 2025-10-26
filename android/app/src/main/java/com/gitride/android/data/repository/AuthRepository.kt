package com.gitride.android.data.repository

import com.gitride.android.data.model.User
import com.gitride.android.data.model.UserRole
import kotlinx.coroutines.flow.Flow

interface AuthRepository {
    suspend fun signIn(email: String, password: String): Result<User>
    suspend fun signUp(email: String, password: String, fullName: String): Result<User>
    suspend fun signOut(): Result<Unit>
    suspend fun getCurrentUser(): User?
    suspend fun updateProfile(user: User): Result<User>
    suspend fun deleteAccount(): Result<Unit>
    fun observeAuthState(): Flow<AuthState>
}

sealed class AuthState {
    object Loading : AuthState()
    data class Authenticated(val user: User) : AuthState()
    object Unauthenticated : AuthState()
    data class Error(val message: String) : AuthState()
}
