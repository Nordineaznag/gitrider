package com.gitride.android.data.remote

import com.gitride.android.BuildConfig
import com.gitride.android.data.model.User
import com.gitride.android.data.model.UserRole
import com.gitride.android.data.repository.AuthRepository
import com.gitride.android.data.repository.AuthState
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.realtime.Realtime
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flow
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class SupabaseAuthRepository @Inject constructor() : AuthRepository {

    private val supabase = createSupabaseClient(
        supabaseUrl = BuildConfig.SUPABASE_URL,
        supabaseKey = BuildConfig.SUPABASE_ANON_KEY
    ) {
        install(Auth)
        install(Postgrest)
        install(Realtime)
    }

    private val _authState = MutableStateFlow<AuthState>(AuthState.Loading)
    override fun observeAuthState(): Flow<AuthState> = _authState.asStateFlow()

    override suspend fun signIn(email: String, password: String): Result<User> {
        return try {
            val session = supabase.auth.signInWith(Email) {
                this.email = email
                this.password = password
            }
            
            val user = session.user?.let { authUser ->
                User(
                    id = authUser.id,
                    email = authUser.email ?: email,
                    fullName = authUser.userMetadata?.get("full_name") as? String ?: "",
                    role = UserRole.valueOf(authUser.userMetadata?.get("role") as? String ?: "USER")
                )
            } ?: throw Exception("Failed to get user data")
            
            _authState.value = AuthState.Authenticated(user)
            Result.success(user)
        } catch (e: Exception) {
            _authState.value = AuthState.Error(e.message ?: "Sign in failed")
            Result.failure(e)
        }
    }

    override suspend fun signUp(email: String, password: String, fullName: String): Result<User> {
        return try {
            val session = supabase.auth.signUpWith(Email) {
                this.email = email
                this.password = password
                data = mapOf("full_name" to fullName, "role" to "USER")
            }
            
            val user = session.user?.let { authUser ->
                User(
                    id = authUser.id,
                    email = authUser.email ?: email,
                    fullName = fullName,
                    role = UserRole.USER
                )
            } ?: throw Exception("Failed to create user")
            
            _authState.value = AuthState.Authenticated(user)
            Result.success(user)
        } catch (e: Exception) {
            _authState.value = AuthState.Error(e.message ?: "Sign up failed")
            Result.failure(e)
        }
    }

    override suspend fun signOut(): Result<Unit> {
        return try {
            supabase.auth.signOut()
            _authState.value = AuthState.Unauthenticated
            Result.success(Unit)
        } catch (e: Exception) {
            _authState.value = AuthState.Error(e.message ?: "Sign out failed")
            Result.failure(e)
        }
    }

    override suspend fun getCurrentUser(): User? {
        return try {
            val session = supabase.auth.currentSessionOrNull()
            session?.user?.let { authUser ->
                User(
                    id = authUser.id,
                    email = authUser.email ?: "",
                    fullName = authUser.userMetadata?.get("full_name") as? String ?: "",
                    role = UserRole.valueOf(authUser.userMetadata?.get("role") as? String ?: "USER")
                )
            }
        } catch (e: Exception) {
            null
        }
    }

    override suspend fun updateProfile(user: User): Result<User> {
        return try {
            // Update user metadata in Supabase Auth
            supabase.auth.updateUser {
                data = mapOf(
                    "full_name" to user.fullName,
                    "role" to user.role.name
                )
            }
            
            // Update profile in database
            supabase.from("profiles")
                .update(mapOf(
                    "full_name" to user.fullName,
                    "phone" to user.phone,
                    "avatar_url" to user.avatarUrl,
                    "updated_at" to System.currentTimeMillis()
                ))
                .eq("id", user.id)
                .execute()
            
            _authState.value = AuthState.Authenticated(user)
            Result.success(user)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    override suspend fun deleteAccount(): Result<Unit> {
        return try {
            supabase.auth.signOut()
            _authState.value = AuthState.Unauthenticated
            Result.success(Unit)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
