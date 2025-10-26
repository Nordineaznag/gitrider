"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LocationPicker } from "@/components/map/location-picker";
import { RideRouteMap } from "@/components/map/ride-route-map";
import {
  DollarSign,
  Clock,
  Car,
  MapPin,
  Navigation as NavigationIcon,
} from "lucide-react";
import { toast } from "sonner";

export function RideBooking() {
  const { user } = useAuth();
  const [pickupLocation, setPickupLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [estimatedTime, setEstimatedTime] = useState<number | null>(null);
  const [estimatedDistance, setEstimatedDistance] = useState<number | null>(
    null,
  );

  // Auto-calculate estimate when both locations are selected
  useEffect(() => {
    if (pickupLocation && dropoffLocation) {
      calculateEstimate();
    } else {
      setEstimatedFare(null);
      setEstimatedTime(null);
      setEstimatedDistance(null);
    }
  }, [pickupLocation, dropoffLocation]);

  const calculateEstimate = async () => {
    if (!pickupLocation || !dropoffLocation) {
      return;
    }

    setIsCalculating(true);

    try {
      // Calculate distance using Haversine formula
      const R = 6371; // Earth's radius in km
      const dLat = ((dropoffLocation.lat - pickupLocation.lat) * Math.PI) / 180;
      const dLng = ((dropoffLocation.lng - pickupLocation.lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((pickupLocation.lat * Math.PI) / 180) *
          Math.cos((dropoffLocation.lat * Math.PI) / 180) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km

      // Calculate fare (base fare + per km rate)
      const baseFare = 5;
      const perKmRate = 2.5;
      const fare = baseFare + distance * perKmRate;

      // Calculate estimated time (assuming average speed of 40 km/h in city)
      const duration = Math.round((distance / 40) * 60); // in minutes

      setEstimatedDistance(distance);
      setEstimatedFare(fare);
      setEstimatedTime(duration);
    } catch (error) {
      console.error("Error calculating estimate:", error);
      toast.error("Failed to calculate estimate");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleBookRide = async () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.error("Please select both pickup and dropoff locations");
      return;
    }

    if (!user) {
      toast.error("Please sign in to book a ride");
      return;
    }

    setIsBooking(true);

    try {
      const { data, error } = await supabase
        .from("rides")
        .insert([
          {
            user_id: user.id,
            pickup_latitude: pickupLocation.lat,
            pickup_longitude: pickupLocation.lng,
            pickup_address:
              pickupLocation.address ||
              `${pickupLocation.lat}, ${pickupLocation.lng}`,
            dropoff_latitude: dropoffLocation.lat,
            dropoff_longitude: dropoffLocation.lng,
            dropoff_address:
              dropoffLocation.address ||
              `${dropoffLocation.lat}, ${dropoffLocation.lng}`,
            fare_amount: estimatedFare,
            status: "requested",
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Ride requested!", {
        description: "Finding a driver nearby...",
      });

      // Reset form
      setPickupLocation(null);
      setDropoffLocation(null);
      setEstimatedFare(null);
      setEstimatedTime(null);
      setEstimatedDistance(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to book ride", {
        description: "Please try again",
      });
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* iOS Card - Booking Form */}
      <Card className="ios-card overflow-hidden">
        <CardHeader className="pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Book a Ride
              </CardTitle>
              <CardDescription className="text-[15px] text-gray-600 mt-0.5">
                Where would you like to go?
              </CardDescription>
            </div>
            {estimatedFare && (
              <div className="text-right">
                <div className="text-2xl font-bold text-[#007AFF]">
                  ${estimatedFare.toFixed(2)}
                </div>
                {estimatedTime && (
                  <div className="text-[13px] text-gray-500 flex items-center gap-1 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    {estimatedTime} min
                  </div>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-4">
          {/* Pickup Location Picker */}
          <div>
            <LocationPicker
              onLocationSelect={setPickupLocation}
              label="Pickup Location"
              placeholder="Where should we pick you up?"
              initialLocation={pickupLocation || undefined}
            />
          </div>

          {/* Dropoff Location Picker */}
          <div>
            <LocationPicker
              onLocationSelect={setDropoffLocation}
              label="Destination"
              placeholder="Where are you going?"
              initialLocation={dropoffLocation || undefined}
            />
          </div>

          {/* Route Map - Show when both locations selected */}
          {pickupLocation && dropoffLocation && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <NavigationIcon className="w-4 h-4" />
                Your Route
              </h3>
              <RideRouteMap
                pickup={pickupLocation}
                destination={dropoffLocation}
                showDetails={false}
              />
            </div>
          )}

          {/* Estimate Card - iOS Style */}
          {estimatedFare && !isCalculating && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[13px] text-gray-600 mb-1">
                      Estimated Fare
                    </p>
                    <p className="text-2xl font-bold text-[#007AFF]">
                      ${estimatedFare.toFixed(2)}
                    </p>
                  </div>
                  {estimatedTime && (
                    <div className="text-right">
                      <p className="text-[13px] text-gray-600 mb-1">Duration</p>
                      <p className="text-lg font-semibold text-gray-900 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {estimatedTime} min
                      </p>
                    </div>
                  )}
                </div>
                {estimatedDistance && (
                  <div className="pt-2 border-t border-blue-300">
                    <p className="text-[13px] text-gray-600">
                      Distance: {estimatedDistance.toFixed(2)} km
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Book Ride Button - iOS Primary */}
          <Button
            onClick={handleBookRide}
            disabled={
              isBooking || isCalculating || !pickupLocation || !dropoffLocation
            }
            className="w-full ios-button-primary text-[17px] h-12"
          >
            {isBooking ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Booking...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Car className="w-5 h-5" />
                {estimatedFare
                  ? `Book Ride - $${estimatedFare.toFixed(2)}`
                  : "Select Locations to Book"}
              </span>
            )}
          </Button>
        </CardContent>
      </Card>
    
    </div>
  );
}
