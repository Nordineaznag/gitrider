package com.gitride.android.data.local

import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import android.content.Context
import com.gitride.android.data.model.Ride
import com.gitride.android.data.model.User
import com.gitride.android.data.model.Location

@Database(
    entities = [User::class, Ride::class, Location::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class GitRideDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
    abstract fun rideDao(): RideDao
    abstract fun locationDao(): LocationDao

    companion object {
        @Volatile
        private var INSTANCE: GitRideDatabase? = null

        fun getDatabase(context: Context): GitRideDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    GitRideDatabase::class.java,
                    "gitride_database"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}
