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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  DollarSign,
  Star,
  X,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";

export function ActiveRides() {
  const { user } = useAuth();
  const [rides, setRides] = useState<(Ride & { driver?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveRides();

    const subscription = supabase
      .channel("active_rides")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "rides",
          filter: `user_id=eq.${user?.id}`,
        },
        () => {
          fetchActiveRides();
        },
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.id]);

  const fetchActiveRides = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("rides")
      .select("*, driver:profiles!rides_driver_id_fkey(*)")
      .eq("user_id", user.id)
      .in("status", ["requested", "accepted", "in_progress"])
      .order("created_at", { ascending: false });

    if (data) {
      setRides(data as any);
    }
    setLoading(false);
  };

  const cancelRide = async (rideId: string) => {
    const { error } = await supabase
      .from("rides")
      .update({ status: "cancelled" })
      .eq("id", rideId);

    if (error) {
      toast.error("Failed to cancel ride");
    } else {
      toast.success("Ride cancelled");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "requested":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "accepted":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "in_progress":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "requested":
        return "Finding Driver";
      case "accepted":
        return "Driver En Route";
      case "in_progress":
        return "In Progress";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <Card className="ios-card">
        <CardContent className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#007AFF] border-t-transparent rounded-full mx-auto" />
        </CardContent>
      </Card>
    );
  }

  if (rides.length === 0) {
    return (
      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="text-gray-900">Active Rides</CardTitle>
          <CardDescription className="text-gray-600">
            No active rides at the moment
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {rides.map((ride) => (
        <Card key={ride.id} className="ios-card">
          <CardHeader className="border-b border-gray-200">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Ride #{ride.id.slice(0, 8)}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1 text-gray-600">
                  <Clock className="w-3.5 h-3.5" />
                  {new Date(ride.requested_at).toLocaleTimeString()}
                </CardDescription>
              </div>
              <Badge
                className={`${getStatusColor(ride.status)} text-[13px] px-2 py-1 rounded-md font-medium border`}
              >
                {getStatusText(ride.status)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-gray-900">
                    Pickup
                  </p>
                  <p className="text-[13px] text-gray-600 mt-0.5">
                    {ride.pickup_address ||
                      `${ride.pickup_latitude.toFixed(4)}, ${ride.pickup_longitude.toFixed(4)}`}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[15px] font-medium text-gray-900">
                    Destination
                  </p>
                  <p className="text-[13px] text-gray-600 mt-0.5">
                    {ride.dropoff_address ||
                      `${ride.dropoff_latitude.toFixed(4)}, ${ride.dropoff_longitude.toFixed(4)}`}
                  </p>
                </div>
              </div>
            </div>

            {ride.driver && (
              <div className="p-3 rounded-lg bg-gray-50 flex items-center gap-3 border border-gray-200">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {ride.driver.avatar_url ? (
                    <img
                      src={ride.driver.avatar_url}
                      alt={ride.driver.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-[17px]">
                    {ride.driver.full_name}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="text-[13px] text-gray-600">
                      {ride.driver.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900 text-lg">
                  ${ride.fare_amount?.toFixed(2)}
                </span>
              </div>
              {ride.status === "requested" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => cancelRide(ride.id)}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-lg text-[15px] h-9 px-4"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
