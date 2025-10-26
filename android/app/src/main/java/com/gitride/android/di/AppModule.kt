package com.gitride.android.di

import android.content.Context
import com.gitride.android.data.repository.AuthRepository
import com.gitride.android.data.repository.LocationRepository
import com.gitride.android.data.repository.RideRepository
import com.gitride.android.data.remote.SupabaseAuthRepository
import com.gitride.android.data.remote.SupabaseRideRepository
import com.gitride.android.data.remote.GoogleMapsLocationRepository
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.android.qualifiers.ApplicationContext
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {

    @Provides
    @Singleton
    fun provideAuthRepository(): AuthRepository {
        return SupabaseAuthRepository()
    }

    @Provides
    @Singleton
    fun provideRideRepository(): RideRepository {
        return SupabaseRideRepository()
    }

    @Provides
    @Singleton
    fun provideLocationRepository(
        @ApplicationContext context: Context
    ): LocationRepository {
        return MapboxLocationRepository(context)
    }
}
