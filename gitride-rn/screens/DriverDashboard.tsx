import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/AuthContext';
import { supabase, DriverProfile } from '../lib/supabase';
import AvailableRides from '../components/AvailableRides';
import ActiveRide from '../components/ActiveRide';
import DriverStats from '../components/DriverStats';

export default function DriverDashboard() {
  const { profile, signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'available' | 'stats'>('active');
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    fetchDriverProfile();
  }, [user?.id]);

  const fetchDriverProfile = async () => {
    try {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('driver_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching driver profile:', error);
        return;
      }

      if (data) {
        setDriverProfile(data);
        setIsAvailable(data.is_available);
      } else {
        const { error: insertError } = await supabase
          .from('driver_profiles')
          .insert([{ id: user.id, vehicle_type: 'standard', is_available: false }]);
        
        if (insertError) {
          console.error('Error creating driver profile:', insertError);
          return;
        }
        fetchDriverProfile();
      }
    } catch (error) {
      console.error('Error in fetchDriverProfile:', error);
    }
  };

  const toggleAvailability = async (value: boolean) => {
    try {
      if (!user?.id) return;

      const { error } = await supabase
        .from('driver_profiles')
        .update({ is_available: value })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating availability:', error);
        Alert.alert('Error', 'Failed to update availability');
        return;
      }

      setIsAvailable(value);
      Alert.alert('Success', value ? 'You are now available' : 'You are now offline');
    } catch (error) {
      console.error('Error in toggleAvailability:', error);
      Alert.alert('Error', 'Failed to update availability');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Driver</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🚗</Text>
            </View>
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.profileName}>{profile?.full_name || 'Driver'}</Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Driver</Text>
                </View>
              </View>
              <View style={styles.profileStats}>
                <Text style={styles.statText}>⭐ {profile?.rating?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.statSeparator}>•</Text>
                <Text style={styles.statText}>💵 {profile?.total_rides || 0} rides</Text>
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          <View style={styles.availabilityRow}>
            <View style={styles.availabilityInfo}>
              <View style={[styles.statusIcon, isAvailable && styles.statusIconActive]}>
                <Text>🚗</Text>
              </View>
              <View>
                <Text style={styles.availabilityTitle}>{isAvailable ? 'Available for Rides' : 'Currently Offline'}</Text>
                <Text style={styles.availabilityDesc}>{isAvailable ? 'You can accept rides' : 'Turn on to start earning'}</Text>
              </View>
            </View>
            <Switch value={isAvailable} onValueChange={toggleAvailability} trackColor={{ true: '#34C759' }} />
          </View>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
            <View style={styles.signOutIcon}>
              <Text>🚪</Text>
            </View>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.segmentControl}>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'active' && styles.segmentActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.segmentText, activeTab === 'active' && styles.segmentTextActive]}>Active Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'available' && styles.segmentActive]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.segmentText, activeTab === 'available' && styles.segmentTextActive]}>Available</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'stats' && styles.segmentActive]}
            onPress={() => setActiveTab('stats')}
          >
            <Text style={[styles.segmentText, activeTab === 'stats' && styles.segmentTextActive]}>Stats</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'active' && <ActiveRide />}
        {activeTab === 'available' && (isAvailable ? <AvailableRides /> : (
          <View style={styles.offlineCard}>
            <Text style={styles.offlineEmoji}>🚗</Text>
            <Text style={styles.offlineTitle}>You are currently offline</Text>
            <Text style={styles.offlineDesc}>Turn on availability to start accepting rides</Text>
          </View>
        ))}
        {activeTab === 'stats' && <DriverStats />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  navbar: { backgroundColor: 'rgba(255,255,255,0.95)', borderBottomWidth: 1, borderBottomColor: '#E5E5EA', paddingHorizontal: 16, paddingVertical: 12 },
  navTitle: { fontSize: 20, fontWeight: '600', color: '#1C1C1E' },
  content: { flex: 1, padding: 16 },
  profileCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#E5E5EA', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 32 },
  profileInfo: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  profileName: { fontSize: 18, fontWeight: '600', color: '#1C1C1E' },
  badge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '500', color: '#1976D2' },
  profileStats: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statText: { fontSize: 14, color: '#8E8E93' },
  statSeparator: { color: '#D1D1D6' },
  separator: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 12 },
  availabilityRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 4 },
  availabilityInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  statusIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  statusIconActive: { backgroundColor: '#E8F5E9' },
  availabilityTitle: { fontSize: 17, fontWeight: '500', color: '#1C1C1E' },
  availabilityDesc: { fontSize: 13, color: '#8E8E93' },
  signOutButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  signOutIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  signOutText: { fontSize: 17, color: '#FF3B30' },
  segmentControl: { flexDirection: 'row', backgroundColor: '#E5E5EA', borderRadius: 8, padding: 2, marginBottom: 16 },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  segmentActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  segmentText: { fontSize: 15, fontWeight: '500', color: '#8E8E93' },
  segmentTextActive: { color: '#000' },
  offlineCard: { backgroundColor: '#fff', borderRadius: 12, padding: 48, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  offlineEmoji: { fontSize: 64, marginBottom: 16 },
  offlineTitle: { fontSize: 18, fontWeight: '500', color: '#1C1C1E', marginBottom: 8 },
  offlineDesc: { fontSize: 15, color: '#8E8E93', textAlign: 'center' },
});
