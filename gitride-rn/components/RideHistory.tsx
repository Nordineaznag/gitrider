import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { supabase, Ride } from '../lib/supabase';

export default function RideHistory() {
  const { user } = useAuth();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    fetchRideHistory();
  }, [user?.id]);

  const fetchRideHistory = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['completed', 'cancelled'])
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching ride history:', error);
      } else {
        setRides(data || []);
      }
    } catch (error) {
      console.error('Error in fetchRideHistory:', error);
    } finally {
      setLoading(false);
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
        <Text style={styles.emptyEmoji}>📋</Text>
        <Text style={styles.emptyTitle}>No Ride History</Text>
        <Text style={styles.emptyDesc}>Your completed rides will appear here</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {rides.map((ride) => (
        <View key={ride.id} style={styles.rideCard}>
          <View style={styles.header}>
            <View style={[styles.statusBadge, ride.status === 'completed' ? styles.completedBadge : styles.cancelledBadge]}>
              <Text style={[styles.statusText, ride.status === 'completed' ? styles.completedText : styles.cancelledText]}>
                {ride.status.toUpperCase()}
              </Text>
            </View>
            <Text style={styles.dateText}>
              {new Date(ride.created_at).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.locationRow}>
            <View style={styles.locationDot} />
            <Text style={styles.locationText}>{ride.pickup_address}</Text>
          </View>
          
          <View style={styles.locationRow}>
            <View style={[styles.locationDot, styles.locationDotDestination]} />
            <Text style={styles.locationText}>{ride.dropoff_address}</Text>
          </View>
          
          {ride.fare_amount && ride.status === 'completed' && (
            <Text style={styles.fareText}>${ride.fare_amount.toFixed(2)}</Text>
          )}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  completedBadge: { backgroundColor: '#E8F5E9' },
  cancelledBadge: { backgroundColor: '#FFEBEE' },
  statusText: { fontSize: 12, fontWeight: '600' },
  completedText: { color: '#2E7D32' },
  cancelledText: { color: '#C62828' },
  dateText: { fontSize: 13, color: '#8E8E93' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#34C759', marginRight: 12 },
  locationDotDestination: { backgroundColor: '#FF3B30' },
  locationText: { fontSize: 15, color: '#1C1C1E', flex: 1 },
  fareText: { fontSize: 18, fontWeight: 'bold', color: '#007AFF', textAlign: 'right', marginTop: 8 },
});