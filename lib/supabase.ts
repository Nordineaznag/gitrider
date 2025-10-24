import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: 'user' | 'driver';
  rating: number;
  total_rides: number;
  created_at: string;
  updated_at: string;
};

export type DriverProfile = {
  id: string;
  vehicle_type: string;
  vehicle_make: string | null;
  vehicle_model: string | null;
  vehicle_year: number | null;
  license_plate: string | null;
  license_number: string | null;
  is_available: boolean;
  current_latitude: number | null;
  current_longitude: number | null;
  created_at: string;
  updated_at: string;
};

export type Ride = {
  id: string;
  user_id: string;
  driver_id: string | null;
  status: 'requested' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  pickup_latitude: number;
  pickup_longitude: number;
  pickup_address: string | null;
  dropoff_latitude: number;
  dropoff_longitude: number;
  dropoff_address: string | null;
  distance_km: number | null;
  duration_minutes: number | null;
  fare_amount: number | null;
  payment_method: 'card' | 'cash' | 'wallet';
  payment_status: 'pending' | 'completed' | 'failed';
  driver_rating: number | null;
  user_rating: number | null;
  requested_at: string;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type RideLocation = {
  id: string;
  ride_id: string;
  latitude: number;
  longitude: number;
  heading: number | null;
  speed: number | null;
  timestamp: string;
};
