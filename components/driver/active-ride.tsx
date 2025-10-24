"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase, Ride, Profile } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapComponent } from "@/components/map/map-component";
import { MapPin, Navigation, CheckCircle, Star } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function ActiveRide() {
  const { user } = useAuth();
  const [ride, setRide] = useState<(Ride & { user?: Profile }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    fetchActiveRide();

    const subscription = supabase
      .channel("driver_active_ride")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
          filter: `driver_id=eq.${user?.id}`,
        },
        () => {
          fetchActiveRide();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fetchActiveRide = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("rides")
      .select("*, user:profiles!rides_user_id_fkey(*)")
      .eq("driver_id", user.id)
      .in("status", ["accepted", "in_progress"])
      .order("accepted_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (data) {
      setRide(data as any);
    }
    setLoading(false);
  };

  const startRide = async () => {
    if (!ride) return;

    const { error } = await supabase
      .from("rides")
      .update({
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .eq("id", ride.id);

    if (error) {
      toast.error("Failed to start ride");
    } else {
      toast.success("Ride started!");
    }
  };

  const completeRide = async () => {
    if (!ride) return;

    const { error } = await supabase
      .from("rides")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        payment_status: "completed",
      })
      .eq("id", ride.id);

    if (error) {
      toast.error("Failed to complete ride");
    } else {
      toast.success("Ride completed!");
      setShowCompleteDialog(false);
      setRide(null);
    }
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

  if (!ride) {
    return (
      <Card className="glass dark:glass-dark">
        <CardHeader>
          <CardTitle>Active Ride</CardTitle>
          <CardDescription>No active ride at the moment</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-muted-foreground">Accept a ride to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        <Card className="glass dark:glass-dark">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Current Ride</CardTitle>
                <CardDescription>Ride #{ride.id.slice(0, 8)}</CardDescription>
              </div>
              <Badge
                className={
                  ride.status === "accepted"
                    ? "bg-blue-500/10 text-blue-500"
                    : "bg-green-500/10 text-green-500"
                }
              >
                {ride.status === "accepted" ? "En Route" : "In Progress"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  {ride.user?.avatar_url ? (
                    <img
                      src={ride.user.avatar_url}
                      alt={ride.user?.full_name || "User"}
                      className="w-full h-full rounded-full"
                    />
                  ) : (
                    <span className="text-lg font-bold">
                      {ride.user?.full_name?.[0] || "?"}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{ride.user?.full_name}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                    {ride.user?.rating?.toFixed(1) || "N/A"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Pickup</p>
                  <p className="text-sm text-muted-foreground">
                    {ride.pickup_address ||
                      `${ride.pickup_latitude.toFixed(4)}, ${ride.pickup_longitude.toFixed(4)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-sm text-muted-foreground">
                    {ride.dropoff_address ||
                      `${ride.dropoff_latitude.toFixed(4)}, ${ride.dropoff_longitude.toFixed(4)}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-muted-foreground">
                  Fare Amount
                </span>
                <span className="text-2xl font-bold text-primary">
                  ${ride.fare_amount?.toFixed(2)}
                </span>
              </div>

              {ride.status === "accepted" ? (
                <Button onClick={startRide} className="w-full" size="lg">
                  <Navigation className="w-4 h-4 mr-2" />
                  Start Ride
                </Button>
              ) : (
                <Button
                  onClick={() => setShowCompleteDialog(true)}
                  className="w-full"
                  size="lg"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Complete Ride
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="glass dark:glass-dark overflow-hidden">
          <CardContent className="p-0">
            <MapComponent
              className="h-[400px] rounded-lg"
              showDirections={true}
              origin={{
                lat: ride.pickup_latitude,
                lng: ride.pickup_longitude,
              }}
              destination={{
                lat: ride.dropoff_latitude,
                lng: ride.dropoff_longitude,
              }}
              markers={[
                {
                  lat: ride.pickup_latitude,
                  lng: ride.pickup_longitude,
                  label: "A",
                  title: ride.pickup_address || "Pickup",
                },
                {
                  lat: ride.dropoff_latitude,
                  lng: ride.dropoff_longitude,
                  label: "B",
                  title: ride.dropoff_address || "Destination",
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Ride</DialogTitle>
            <DialogDescription>
              Mark this ride as completed and collect payment
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Fare</span>
                <span className="text-2xl font-bold">
                  ${ride.fare_amount?.toFixed(2)}
                </span>
              </div>
            </div>
            <Button onClick={completeRide} className="w-full" size="lg">
              Confirm & Complete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
