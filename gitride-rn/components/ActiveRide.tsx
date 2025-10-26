import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { supabase, Ride } from '../lib/supabase';

export default function ActiveRide() {
  const { user } = useAuth();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    fetchActiveRide();
    const subscription = supabase
      .channel('driver_active_ride')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, fetchActiveRide)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const fetchActiveRide = async () => {
    try {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', user.id)
        .in('status', ['accepted', 'in_progress'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching active ride:', error);
      } else {
        setRide(data);
      }
    } catch (error) {
      console.error('Error in fetchActiveRide:', error);
    } finally {
      setLoading(false);
    }
  };

  const startRide = async () => {
    try {
      if (!ride) return;

      const { error } = await supabase
        .from('rides')
        .update({ status: 'in_progress', started_at: new Date().toISOString() })
        .eq('id', ride.id);

      if (error) {
        console.error('Error starting ride:', error);
        Alert.alert('Error', 'Failed to start ride');
        return;
      }

      Alert.alert('Success', 'Ride started!');
      fetchActiveRide();
    } catch (error) {
      console.error('Error in startRide:', error);
      Alert.alert('Error', 'Failed to start ride');
    }
  };

  const completeRide = async () => {
    try {
      if (!ride) return;

      const { error } = await supabase
        .from('rides')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', ride.id);

      if (error) {
        console.error('Error completing ride:', error);
        Alert.alert('Error', 'Failed to complete ride');
        return;
      }

      Alert.alert('Success', 'Ride completed!');
      fetchActiveRide();
    } catch (error) {
      console.error('Error in completeRide:', error);
      Alert.alert('Error', 'Failed to complete ride');
    }
  };

  if (loading) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyEmoji}>⏳</Text>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  if (!ride) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyEmoji}>🚗</Text>
        <Text style={styles.emptyTitle}>No Active Ride</Text>
        <Text style={styles.emptyDesc}>Accept a ride to get started</Text>
      </View>
    );
  }

  return (
    <View style={styles.rideCard}>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{ride.status.toUpperCase()}</Text>
      </View>

      <View style={styles.locationRow}>
        <View style={styles.locationDot} />
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Pickup</Text>
          <Text style={styles.locationAddress}>{ride.pickup_address}</Text>
        </View>
      </View>

      <View style={styles.locationRow}>
        <View style={[styles.locationDot, styles.locationDotDestination]} />
        <View style={styles.locationInfo}>
          <Text style={styles.locationLabel}>Destination</Text>
          <Text style={styles.locationAddress}>{ride.dropoff_address}</Text>
        </View>
      </View>

      {ride.fare_amount && (
        <View style={styles.fareRow}>
          <Text style={styles.fareLabel}>Fare</Text>
          <Text style={styles.fareValue}>${ride.fare_amount.toFixed(2)}</Text>
        </View>
      )}

      {ride.status === 'accepted' && (
        <TouchableOpacity style={styles.actionButton} onPress={startRide}>
          <Text style={styles.actionButtonText}>Start Ride</Text>
        </TouchableOpacity>
      )}

      {ride.status === 'in_progress' && (
        <TouchableOpacity style={styles.actionButton} onPress={completeRide}>
          <Text style={styles.actionButtonText}>Complete Ride</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 48, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '500', color: '#1C1C1E', marginBottom: 8 },
  emptyDesc: { fontSize: 15, color: '#8E8E93' },
  emptyText: { fontSize: 17, color: '#8E8E93' },
  rideCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  statusBadge: { backgroundColor: '#FFF3E0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 12 },
  statusText: { fontSize: 12, fontWeight: '600', color: '#F57C00' },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  locationDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#34C759', marginRight: 12, marginTop: 4 },
  locationDotDestination: { backgroundColor: '#FF3B30' },
  locationInfo: { flex: 1 },
  locationLabel: { fontSize: 13, color: '#8E8E93', marginBottom: 2 },
  locationAddress: { fontSize: 15, color: '#1C1C1E' },
  fareRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E5EA', marginTop: 4, marginBottom: 12 },
  fareLabel: { fontSize: 15, color: '#8E8E93' },
  fareValue: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  actionButton: { backgroundColor: '#34C759', borderRadius: 8, padding: 12, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
