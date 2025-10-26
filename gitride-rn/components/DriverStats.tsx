import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export default function DriverStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRides: 0,
    totalEarnings: 0,
    completedToday: 0,
    earningsToday: 0,
  });

  useEffect(() => {
    if (!user?.id) return;
    fetchStats();
  }, [user?.id]);

  const fetchStats = async () => {
    try {
      if (!user?.id) return;
      
      const { data: allRides, error } = await supabase
        .from('rides')
        .select('*')
        .eq('driver_id', user.id)
        .eq('status', 'completed');

      if (error) {
        console.error('Error fetching stats:', error);
        return;
      }

      const today = new Date().toISOString().split('T')[0];
      const todayRides = allRides?.filter(r => r.completed_at?.startsWith(today)) || [];

      setStats({
        totalRides: allRides?.length || 0,
        totalEarnings: allRides?.reduce((sum, r) => sum + (r.fare_amount || 0), 0) || 0,
        completedToday: todayRides.length,
        earningsToday: todayRides.reduce((sum, r) => sum + (r.fare_amount || 0), 0),
      });
    } catch (error) {
      console.error('Error in fetchStats:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalRides}</Text>
          <Text style={styles.statLabel}>Total Rides</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>${stats.totalEarnings.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Total Earnings</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.completedToday}</Text>
          <Text style={styles.statLabel}>Rides Today</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statValue}>${stats.earningsToday.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Earnings Today</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { backgroundColor: '#fff', borderRadius: 12, padding: 20, flex: 1, minWidth: '45%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#007AFF', marginBottom: 4 },
  statLabel: { fontSize: 13, color: '#8E8E93', textAlign: 'center' },
});
