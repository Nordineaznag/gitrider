import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export default function RideBooking() {
  const { user } = useAuth();
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [loading, setLoading] = useState(false);

  const bookRide = async () => {
    try {
      if (!pickup || !dropoff) {
        Alert.alert('Error', 'Please enter pickup and dropoff locations');
        return;
      }

      setLoading(true);
      const { error } = await supabase
        .from('rides')
        .insert([{
          user_id: user!.id,
          status: 'requested',
          pickup_latitude: 0,
          pickup_longitude: 0,
          pickup_address: pickup,
          dropoff_latitude: 0,
          dropoff_longitude: 0,
          dropoff_address: dropoff,
          fare_amount: null,
          payment_method: 'card',
          payment_status: 'pending',
          requested_at: new Date().toISOString()
        }]);

      if (error) {
        console.error('Error booking ride:', error);
        Alert.alert('Error', 'Failed to book ride');
        return;
      }

      Alert.alert('Success', 'Ride booked successfully!');
      setPickup('');
      setDropoff('');
    } catch (error) {
      console.error('Error in bookRide:', error);
      Alert.alert('Error', 'Failed to book ride');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book a Ride</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Pickup Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter pickup location"
          value={pickup}
          onChangeText={setPickup}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Dropoff Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination"
          value={dropoff}
          onChangeText={setDropoff}
        />
      </View>

      <TouchableOpacity
        style={[styles.bookButton, loading && styles.buttonDisabled]}
        onPress={bookRide}
        disabled={loading}
      >
        <Text style={styles.bookButtonText}>
          {loading ? 'Booking...' : 'Book Ride'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  title: { fontSize: 20, fontWeight: '600', color: '#1C1C1E', marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 15, color: '#3C3C43', marginBottom: 8 },
  input: { backgroundColor: '#F2F2F7', borderRadius: 8, padding: 12, fontSize: 17 },
  bookButton: { backgroundColor: '#007AFF', borderRadius: 8, padding: 16, alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  bookButtonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});