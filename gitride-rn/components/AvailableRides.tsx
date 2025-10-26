import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { supabase, Ride } from '../lib/supabase';

export default function AvailableRides() {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableRides();
    const subscription = supabase
      .channel('available_rides')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rides' }, fetchAvailableRides)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAvailableRides = async () => {
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'requested')
        .is('driver_id', null)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching available rides:', error);
      } else {
        setRides(data || []);
      }
    } catch (error) {
      console.error('Error in fetchAvailableRides:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRide = async (rideId: string) => {
    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          driver_id: user!.id, 
          status: 'accepted',
          accepted_at: new Date().toISOString()
        })
        .eq('id', rideId);

      if (error) {
        Alert.alert('Error', 'Failed to accept ride');
        return;
      }

      Alert.alert('Success', 'Ride accepted!');
      fetchAvailableRides();
    } catch (error) {
      Alert.alert('Error', 'Failed to accept ride');
    }
  };

  if (loading) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  if (rides.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyEmoji}>🔍</Text>
        <Text style={styles.emptyTitle}>No Available Rides</Text>
        <Text style={styles.emptyDesc}>New ride requests will appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {rides.map((ride) => (
        <View key={ride.id} style={styles.rideCard}>
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Pickup</Text>
              <Text style={styles.locationText}>{ride.pickup_address}</Text>
            </View>
          </View>
          
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.locationDotDestination]} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Destination</Text>
              <Text style={styles.locationText}>{ride.dropoff_address}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.timeText}>
              {new Date(ride.requested_at).toLocaleTimeString()}
            </Text>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => acceptRide(ride.id)}
            >
              <Text style={styles.acceptButtonText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyCard: { backgroundColor: '#fff', borderRadius: 12, padding: 48, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '500', color: '#1C1C1E', marginBottom: 8 },
  emptyDesc: { fontSize: 15, color: '#8E8E93' },
  emptyText: { fontSize: 17, color: '#8E8E93' },
  rideCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  locationRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  locationDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#34C759', marginRight: 12, marginTop: 4 },
  locationDotDestination: { backgroundColor: '#FF3B30' },
  locationInfo: { flex: 1 },
  locationLabel: { fontSize: 13, color: '#8E8E93', marginBottom: 2 },
  locationText: { fontSize: 15, color: '#1C1C1E' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E5EA' },
  timeText: { fontSize: 13, color: '#8E8E93' },
  acceptButton: { backgroundColor: '#34C759', borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  acceptButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});