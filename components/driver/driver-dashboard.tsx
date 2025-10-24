"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase, DriverProfile } from "@/lib/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { AvailableRides } from "./available-rides";
import { ActiveRide } from "./active-ride";
import { DriverStats } from "./driver-stats";
import { LogOut, Star, DollarSign, Car, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export function DriverDashboard() {
  const { profile, signOut, user } = useAuth();
  const [driverProfile, setDriverProfile] = useState<DriverProfile | null>(
    null,
  );
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    fetchDriverProfile();
  }, [user?.id]);

  const fetchDriverProfile = async () => {
    if (!user?.id) return;

    const { data, error } = await supabase
      .from("driver_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      setDriverProfile(data);
      setIsAvailable(data.is_available);
    } else if (!data && !error) {
      const { error: createError } = await supabase
        .from("driver_profiles")
        .insert([
          {
            id: user.id,
            vehicle_type: "standard",
            is_available: false,
          },
        ]);

      if (!createError) {
        fetchDriverProfile();
      }
    }
  };

  const toggleAvailability = async (available: boolean) => {
    if (!user?.id) return;

    const { error } = await supabase
      .from("driver_profiles")
      .update({ is_available: available })
      .eq("id", user.id);

    if (error) {
      toast.error("Failed to update availability");
    } else {
      setIsAvailable(available);
      toast.success(
        available ? "You are now available" : "You are now offline",
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-20">
      {/* iOS Navigation Bar */}
      <div className="ios-navbar">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between h-14">
            <h1 className="text-xl font-semibold text-gray-900">Driver</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 max-w-6xl space-y-4">
        {/* Driver Info Card - iOS Style */}
        <div className="ios-list rounded-xl overflow-hidden">
          {/* Driver Profile Section */}
          <div className="bg-white px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Car className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-gray-900 truncate">
                    {profile?.full_name || "Driver"}
                  </h2>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                    Driver
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {profile?.rating ? profile.rating.toFixed(1) : "0.0"}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    {profile?.total_rides || 0} rides
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </div>

          {/* iOS Separator */}
          <div className="ios-separator mx-4" />

          {/* Availability Toggle */}
          <div className="ios-list-item flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${isAvailable ? "bg-green-100" : "bg-gray-100"}`}
              >
                <Car
                  className={`w-4 h-4 ${isAvailable ? "text-green-600" : "text-gray-500"}`}
                />
              </div>
              <div>
                <p className="text-[17px] font-medium text-gray-900">
                  {isAvailable ? "Available for Rides" : "Currently Offline"}
                </p>
                <p className="text-[13px] text-gray-500">
                  {isAvailable
                    ? "You can accept rides"
                    : "Turn on to start earning"}
                </p>
              </div>
            </div>
            <Switch
              id="availability"
              checked={isAvailable}
              onCheckedChange={toggleAvailability}
              className="data-[state=checked]:bg-[#34C759]"
            />
          </div>

          {/* iOS Separator */}
          <div className="ios-separator mx-4" />

          {/* Sign Out Button */}
          <button
            onClick={signOut}
            className="ios-list-item w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <span className="text-[17px] text-red-600 font-normal">
                Sign Out
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* iOS Segment Control for Tabs */}
        <Tabs defaultValue="active" className="space-y-4">
          <div className="ios-segment">
            <TabsList className="w-full grid grid-cols-3 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="active"
                className="ios-segment-item data-[state=active]:ios-segment-item-active text-[15px]"
              >
                Active Ride
              </TabsTrigger>
              <TabsTrigger
                value="available"
                className="ios-segment-item data-[state=active]:ios-segment-item-active text-[15px]"
              >
                Available
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="ios-segment-item data-[state=active]:ios-segment-item-active text-[15px]"
              >
                Stats
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="active" className="mt-4">
            <ActiveRide />
          </TabsContent>

          <TabsContent value="available" className="mt-4">
            {isAvailable ? (
              <AvailableRides />
            ) : (
              <Card className="ios-card">
                <CardContent className="text-center py-12">
                  <div className="text-6xl mb-4">🚗</div>
                  <p className="text-lg font-medium mb-2 text-gray-900">
                    You are currently offline
                  </p>
                  <p className="text-gray-600 mb-4 text-[15px]">
                    Turn on availability to start accepting rides
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="stats" className="mt-4">
            <DriverStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
