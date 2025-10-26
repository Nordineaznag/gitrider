import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../lib/AuthContext';

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupRole, setSignupRole] = useState<'user' | 'driver'>('user');

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await signIn(loginEmail, loginPassword);
      if (error) {
        Alert.alert('Error', error.message || 'Login failed');
      } else {
        Alert.alert('Success', 'Welcome back!');
      }
    } catch (error) {
      console.error('Error in handleLogin:', error);
      Alert.alert('Error', 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    try {
      setLoading(true);
      const { error } = await signUp(signupEmail, signupPassword, signupName, signupRole);
      if (error) {
        Alert.alert('Error', error.message || 'Account creation failed');
      } else {
        Alert.alert('Success', 'Account created!');
      }
    } catch (error) {
      console.error('Error in handleSignup:', error);
      Alert.alert('Error', 'Account creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>G</Text>
          </View>
          <Text style={styles.title}>Getride</Text>
          <Text style={styles.subtitle}>Your journey starts here</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.segmentControl}>
            <TouchableOpacity
              style={[styles.segment, !isSignUp && styles.segmentActive]}
              onPress={() => setIsSignUp(false)}
            >
              <Text style={[styles.segmentText, !isSignUp && styles.segmentTextActive]}>Sign In</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, isSignUp && styles.segmentActive]}
              onPress={() => setIsSignUp(true)}
            >
              <Text style={[styles.segmentText, isSignUp && styles.segmentTextActive]}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {!isSignUp ? (
            <View style={styles.form}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                value={loginEmail}
                onChangeText={setLoginEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={loginPassword}
                onChangeText={setLoginPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.form}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="John Doe"
                value={signupName}
                onChangeText={setSignupName}
              />

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                value={signupEmail}
                onChangeText={setSignupEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                value={signupPassword}
                onChangeText={setSignupPassword}
                secureTextEntry
              />

              <Text style={styles.label}>Account Type</Text>
              <View style={styles.roleContainer}>
                <TouchableOpacity
                  style={[styles.roleOption, signupRole === 'user' && styles.roleOptionActive]}
                  onPress={() => setSignupRole('user')}
                >
                  <View style={[styles.roleIcon, signupRole === 'user' && styles.roleIconActive]}>
                    <Text style={styles.roleEmoji}>👤</Text>
                  </View>
                  <View style={styles.roleInfo}>
                    <Text style={styles.roleTitle}>Rider</Text>
                    <Text style={styles.roleDesc}>Book rides and travel</Text>
                  </View>
                  {signupRole === 'user' && <View style={styles.checkmark} />}
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleOption, signupRole === 'driver' && styles.roleOptionActive]}
                  onPress={() => setSignupRole('driver')}
                >
                  <View style={[styles.roleIcon, signupRole === 'driver' && styles.roleIconActive]}>
                    <Text style={styles.roleEmoji}>🚗</Text>
                  </View>
                  <View style={styles.roleInfo}>
                    <Text style={styles.roleTitle}>Driver</Text>
                    <Text style={styles.roleDesc}>Drive and earn money</Text>
                  </View>
                  {signupRole === 'driver' && <View style={styles.checkmark} />}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleSignup}
                disabled={loading}
              >
                <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={styles.footer}>Secure and encrypted connection</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  scrollContent: { padding: 16, paddingTop: 40 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#007AFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { fontSize: 40, fontWeight: 'bold', color: '#fff' },
  title: { fontSize: 32, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 4 },
  subtitle: { fontSize: 15, color: '#8E8E93' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  segmentControl: { flexDirection: 'row', backgroundColor: '#E5E5EA', borderRadius: 8, padding: 2, marginBottom: 24 },
  segment: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  segmentActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  segmentText: { fontSize: 15, fontWeight: '500', color: '#8E8E93' },
  segmentTextActive: { color: '#000' },
  form: { gap: 16 },
  label: { fontSize: 15, color: '#3C3C43', marginBottom: 4 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D1D6', borderRadius: 8, padding: 12, fontSize: 17 },
  button: { backgroundColor: '#007AFF', borderRadius: 8, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  roleContainer: { gap: 12 },
  roleOption: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E5E5EA', backgroundColor: '#fff' },
  roleOptionActive: { backgroundColor: '#F2F2F7', borderColor: '#007AFF' },
  roleIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E5E5EA', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  roleIconActive: { backgroundColor: '#007AFF' },
  roleEmoji: { fontSize: 20 },
  roleInfo: { flex: 1 },
  roleTitle: { fontSize: 17, fontWeight: '500', color: '#1C1C1E' },
  roleDesc: { fontSize: 13, color: '#8E8E93' },
  checkmark: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#007AFF' },
  footer: { textAlign: 'center', fontSize: 13, color: '#8E8E93', marginTop: 24 },
});
