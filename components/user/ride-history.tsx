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
import { MapPin, DollarSign, Clock, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RideHistory() {
  const { user } = useAuth();
  const [rides, setRides] = useState<(Ride & { driver?: Profile })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRideHistory();
  }, [user?.id]);

  const fetchRideHistory = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("rides")
      .select("*, driver:profiles!rides_driver_id_fkey(*)")
      .eq("user_id", user.id)
      .in("status", ["completed", "cancelled"])
      .order("created_at", { ascending: false })
      .limit(10);

    if (data) {
      setRides(data as any);
    }
    setLoading(false);
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
          <CardTitle className="text-gray-900">Ride History</CardTitle>
          <CardDescription className="text-gray-600 text-[15px]">
            No completed rides yet
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="ios-card">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="text-gray-900 text-xl font-semibold">
          Ride History
        </CardTitle>
        <CardDescription className="text-gray-600 text-[15px]">
          Your recent trips
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200">
          {rides.map((ride) => (
            <div
              key={ride.id}
              className="p-4 bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-[17px]">
                      {new Date(
                        ride.completed_at || ride.created_at,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-[13px] text-gray-500">
                      {new Date(
                        ride.completed_at || ride.created_at,
                      ).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`text-[13px] px-2 py-1 rounded-md font-medium border ${
                    ride.status === "completed"
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-gray-100 text-gray-700 border-gray-200"
                  }`}
                >
                  {ride.status}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <span className="text-[15px] text-gray-700 line-clamp-1">
                    {ride.pickup_address || "Pickup location"}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <span className="text-[15px] text-gray-700 line-clamp-1">
                    {ride.dropoff_address || "Drop-off location"}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="font-semibold text-gray-900 text-lg">
                    ${ride.fare_amount?.toFixed(2)}
                  </span>
                </div>
                {ride.driver && ride.status === "completed" && (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-50">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-[15px] font-medium text-gray-900">
                      {ride.driver_rating || "Not rated"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
