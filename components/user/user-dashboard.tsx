"use client";

import { useAuth } from "@/lib/auth-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RideBooking } from "./ride-booking";
import { ActiveRides } from "./active-rides";
import { RideHistory } from "./ride-history";
import { LogOut, User, Star, MapPin, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function UserDashboard() {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-20">
   

      <div className="container mx-auto p-4 max-w-6xl space-y-4">
        {/* User Info Card - iOS Style */}
        <div className="ios-list rounded-xl overflow-hidden">
          {/* User Profile Section */}
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
                  <User className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {profile?.full_name || "User"}
                </h2>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    {profile?.rating ? profile.rating.toFixed(1) : "0.0"}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {profile?.total_rides || 0} rides
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
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
        <Tabs defaultValue="book" className="space-y-4">
          <div className="ios-segment">
            <TabsList className="w-full grid grid-cols-3 bg-transparent p-0 h-auto">
              <TabsTrigger
                value="book"
                className="ios-segment-item data-[state=active]:ios-segment-item-active text-[15px]"
              >
                Book Ride
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="ios-segment-item data-[state=active]:ios-segment-item-active text-[15px]"
              >
                Active
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="ios-segment-item data-[state=active]:ios-segment-item-active text-[15px]"
              >
                History
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="book" className="mt-4 space-y-4">
            <RideBooking />
          </TabsContent>

          <TabsContent value="active" className="mt-4">
            <ActiveRides />
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <RideHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
