'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase, Ride, Profile } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, DollarSign, Clock, Check, Navigation } from 'lucide-react';
import { toast } from 'sonner';

export function AvailableRides() {
  const { user } = useAuth();
  const [rides, setRides] = useState<(Ride & { user?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAvailableRides();

    const subscription = supabase
      .channel('available_rides')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'rides',
          filter: 'status=eq.requested',
        },
        () => {
          fetchAvailableRides();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchAvailableRides = async () => {
    const { data, error } = await supabase
      .from('rides')
      .select('*, user:profiles!rides_user_id_fkey(*)')
      .eq('status', 'requested')
      .is('driver_id', null)
      .order('created_at', { ascending: false });

    if (data) {
      setRides(data as any);
    }
    setLoading(false);
  };

  const acceptRide = async (rideId: string) => {
    const { error } = await supabase
      .from('rides')
      .update({
        driver_id: user?.id,
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', rideId);

    if (error) {
      toast.error('Failed to accept ride');
    } else {
      toast.success('Ride accepted! Heading to pickup location...');
    }
  };

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const distance = Math.sqrt(Math.pow(lat2 - lat1, 2) + Math.pow(lng2 - lng1, 2)) * 111;
    return distance.toFixed(1);
  };

  if (loading) {
    return (
      <Card className="glass dark:glass-dark">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (rides.length === 0) {
    return (
      <Card className="glass dark:glass-dark">
        <CardHeader>
          <CardTitle>Available Rides</CardTitle>
          <CardDescription>No ride requests at the moment</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-6xl mb-4 animate-pulse-glow">🚗</div>
          <p className="text-muted-foreground">Waiting for ride requests...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass dark:glass-dark">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Available Rides
          <Badge className="bg-green-500/10 text-green-500">
            {rides.length} requests
          </Badge>
        </CardTitle>
        <CardDescription>Accept rides and start earning</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="p-4 rounded-lg border bg-card/50 hover:bg-card transition-all hover:shadow-lg"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-medium">{ride.user?.full_name}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(ride.requested_at).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-primary">
                  ${ride.fare_amount?.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {calculateDistance(
                    ride.pickup_latitude,
                    ride.pickup_longitude,
                    ride.dropoff_latitude,
                    ride.dropoff_longitude
                  )} km
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pickup</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {ride.pickup_address || `${ride.pickup_latitude.toFixed(4)}, ${ride.pickup_longitude.toFixed(4)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {ride.dropoff_address || `${ride.dropoff_latitude.toFixed(4)}, ${ride.dropoff_longitude.toFixed(4)}`}
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={() => acceptRide(ride.id)}
              className="w-full"
            >
              <Check className="w-4 h-4 mr-2" />
              Accept Ride
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
