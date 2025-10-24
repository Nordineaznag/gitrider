"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock, Star } from "lucide-react";

export function DriverStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalRides: 0,
    avgRating: 0,
    totalHours: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [user?.id]);

  const fetchStats = async () => {
    if (!user?.id) return;

    const { data: rides } = await supabase
      .from("rides")
      .select("fare_amount, driver_rating, duration_minutes")
      .eq("driver_id", user.id)
      .eq("status", "completed");

    if (rides) {
      const totalEarnings = rides.reduce(
        (sum, ride) => sum + (ride.fare_amount || 0),
        0,
      );
      const totalRides = rides.length;
      const ratedRides = rides.filter((r) => r.driver_rating);
      const avgRating =
        ratedRides.length > 0
          ? ratedRides.reduce((sum, r) => sum + (r.driver_rating || 0), 0) /
            ratedRides.length
          : 0;
      const totalMinutes = rides.reduce(
        (sum, ride) => sum + (ride.duration_minutes || 0),
        0,
      );
      const totalHours = Math.round(totalMinutes / 60);

      setStats({
        totalEarnings,
        totalRides,
        avgRating,
        totalHours,
      });
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="ios-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-[15px] font-medium text-gray-700">
            Total Earnings
          </CardTitle>
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            ${stats.totalEarnings.toFixed(2)}
          </div>
          <p className="text-[13px] text-gray-500 mt-1">From completed rides</p>
        </CardContent>
      </Card>

      <Card className="ios-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-[15px] font-medium text-gray-700">
            Total Rides
          </CardTitle>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {stats.totalRides}
          </div>
          <p className="text-[13px] text-gray-500 mt-1">
            Completed successfully
          </p>
        </CardContent>
      </Card>

      <Card className="ios-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-[15px] font-medium text-gray-700">
            Average Rating
          </CardTitle>
          <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {stats.avgRating.toFixed(1)}
          </div>
          <p className="text-[13px] text-gray-500 mt-1">
            From passenger reviews
          </p>
        </CardContent>
      </Card>

      <Card className="ios-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-[15px] font-medium text-gray-700">
            Hours Driven
          </CardTitle>
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Clock className="h-5 w-5 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900">
            {stats.totalHours}h
          </div>
          <p className="text-[13px] text-gray-500 mt-1">Total time on road</p>
        </CardContent>
      </Card>
    </div>
  );
}
