"use client";

import { useState, useEffect } from "react";
import { MapComponent } from "./map-component";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, DollarSign } from "lucide-react";

type RideRouteMapProps = {
  pickup: {
    lat: number;
    lng: number;
    address?: string;
  };
  destination: {
    lat: number;
    lng: number;
    address?: string;
  };
  showDetails?: boolean;
  className?: string;
};

export function RideRouteMap({
  pickup,
  destination,
  showDetails = true,
  className,
}: RideRouteMapProps) {
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
    estimatedFare?: number;
  } | null>(null);

  // Calculate route information using Mapbox Directions API
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token || token === "your_mapbox_access_token_here") return;

    const fetchRouteInfo = async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${pickup.lng},${pickup.lat};${destination.lng},${destination.lat}?access_token=${token}`,
        );

        const data = await response.json();

        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distanceInMiles = route.distance / 1609.34;
          const durationInMinutes = route.duration / 60;

          // Format distance
          const distanceText =
            distanceInMiles < 0.1
              ? `${Math.round(route.distance)} m`
              : `${distanceInMiles.toFixed(1)} mi`;

          // Format duration
          const durationText =
            durationInMinutes < 1
              ? `${Math.round(route.duration)} sec`
              : durationInMinutes < 60
                ? `${Math.round(durationInMinutes)} min`
                : `${Math.floor(durationInMinutes / 60)} hr ${Math.round(durationInMinutes % 60)} min`;

          // Calculate estimated fare (example: $2 base + $1.5 per mile)
          const estimatedFare = 2 + distanceInMiles * 1.5;

          setRouteInfo({
            distance: distanceText,
            duration: durationText,
            estimatedFare: Math.round(estimatedFare * 100) / 100,
          });
        }
      } catch (error) {
        console.error("Error fetching route info:", error);
      }
    };

    fetchRouteInfo();
  }, [pickup.lat, pickup.lng, destination.lat, destination.lng]);

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Route Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Route Details */}
          {showDetails && (
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Pickup Location
                  </p>
                  <p className="text-sm font-medium break-words">
                    {pickup.address ||
                      `${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}`}
                  </p>
                </div>
              </div>

              <div className="pl-4 border-l-2 border-dashed border-muted ml-4 py-2">
                {routeInfo && (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="gap-1">
                      <Navigation className="w-3 h-3" />
                      {routeInfo.distance}
                    </Badge>
                    <Badge variant="secondary" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {routeInfo.duration}
                    </Badge>
                    {routeInfo.estimatedFare && (
                      <Badge variant="secondary" className="gap-1">
                        <DollarSign className="w-3 h-3" />$
                        {routeInfo.estimatedFare.toFixed(2)}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Destination
                  </p>
                  <p className="text-sm font-medium break-words">
                    {destination.address ||
                      `${destination.lat.toFixed(4)}, ${destination.lng.toFixed(4)}`}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Map */}
          <MapComponent
            center={{
              lat: (pickup.lat + destination.lat) / 2,
              lng: (pickup.lng + destination.lng) / 2,
            }}
            showDirections={true}
            origin={pickup}
            destination={destination}
            markers={[
              {
                ...pickup,
                label: "A",
                title: pickup.address || "Pickup",
              },
              {
                ...destination,
                label: "B",
                title: destination.address || "Destination",
              },
            ]}
            className="h-[400px] rounded-lg"
            zoom={12}
          />
        </CardContent>
      </Card>
    </div>
  );
}
