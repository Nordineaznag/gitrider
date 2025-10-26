import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/AuthContext';
import RideBooking from '../components/RideBooking';
import ActiveRides from '../components/ActiveRides';
import RideHistory from '../components/RideHistory';

export default function UserDashboard() {
  const { profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'book' | 'active' | 'history'>('book');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Getride</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{profile?.full_name?.[0] || 'U'}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{profile?.full_name || 'User'}</Text>
              <View style={styles.profileStats}>
                <Text style={styles.statText}>⭐ {profile?.rating?.toFixed(1) || '0.0'}</Text>
                <Text style={styles.statSeparator}>•</Text>
                <Text style={styles.statText}>📍 {profile?.total_rides || 0} rides</Text>
              </View>
            </View>
          </View>

          <View style={styles.separator} />

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <View style={styles.signOutIcon}>
              <Text>🚪</Text>
            </View>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.segmentControl}>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'book' && styles.segmentActive]}
            onPress={() => setActiveTab('book')}
          >
            <Text style={[styles.segmentText, activeTab === 'book' && styles.segmentTextActive]}>Book Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'active' && styles.segmentActive]}
            onPress={() => setActiveTab('active')}
          >
            <Text style={[styles.segmentText, activeTab === 'active' && styles.segmentTextActive]}>Active</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segment, activeTab === 'history' && styles.segmentActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.segmentText, activeTab === 'history' && styles.segmentTextActive]}>History</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'book' && <RideBooking />}
        {activeTab === 'active' && <ActiveRides />}
        {activeTab === 'history' && <RideHistory />}
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
  avatarText: { fontSize: 28, fontWeight: 'bold', color: '#8E8E93' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', marginBottom: 4 },
  profileStats: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statText: { fontSize: 14, color: '#8E8E93' },
  statSeparator: { color: '#D1D1D6' },
  separator: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 12 },
  signOutButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  signOutIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#FFEBEE', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  signOutText: { fontSize: 17, color: '#FF3B30' },
  segmentControl: { flexDirection: 'row', backgroundColor: '#E5E5EA', borderRadius: 8, padding: 2, marginBottom: 16 },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  segmentActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  segmentText: { fontSize: 15, fontWeight: '500', color: '#8E8E93' },
  segmentTextActive: { color: '#000' },
});
