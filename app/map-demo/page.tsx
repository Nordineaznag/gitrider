"use client";

import { useState } from "react";
import { MapComponent } from "@/components/map/map-component";
import { LocationPicker } from "@/components/map/location-picker";
import { RideRouteMap } from "@/components/map/ride-route-map";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Route } from "lucide-react";

export default function MapDemoPage() {
  const [basicMapCenter] = useState({ lat: 40.7128, lng: -74.006 });
  const [selectedPickup, setSelectedPickup] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);

  // Example locations
  const examplePickup = {
    lat: 40.7128,
    lng: -74.006,
    address: "Times Square, New York, NY",
  };

  const exampleDestination = {
    lat: 40.7589,
    lng: -73.9851,
    address: "Central Park, New York, NY",
  };

  const handleSetExampleRoute = () => {
    setSelectedPickup(examplePickup);
    setSelectedDestination(exampleDestination);
  };

  const handleClearRoute = () => {
    setSelectedPickup(null);
    setSelectedDestination(null);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Mapbox Integration Demo</h1>
        <p className="text-muted-foreground">
          Test all Mapbox features and components
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="outline" className="gap-1">
            <MapPin className="w-3 h-3" />
            Maps API
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Navigation className="w-3 h-3" />
            Directions API
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Route className="w-3 h-3" />
            Geocoding API
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Map</TabsTrigger>
          <TabsTrigger value="picker">Location Picker</TabsTrigger>
          <TabsTrigger value="directions">Directions</TabsTrigger>
          <TabsTrigger value="full">Full Demo</TabsTrigger>
        </TabsList>

        {/* Basic Map Tab */}
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Map Component</CardTitle>
              <CardDescription>
                Simple map with markers and click-to-select functionality
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MapComponent
                center={basicMapCenter}
                markers={[
                  {
                    lat: 40.7128,
                    lng: -74.006,
                    label: "A",
                    title: "Times Square",
                  },
                  {
                    lat: 40.7589,
                    lng: -73.9851,
                    label: "B",
                    title: "Central Park",
                  },
                  {
                    lat: 40.7484,
                    lng: -73.9857,
                    label: "C",
                    title: "Grand Central Terminal",
                  },
                ]}
                zoom={13}
                className="h-[500px] rounded-lg"
                onLocationSelect={(location) => {
                  console.log("Selected location:", location);
                }}
              />
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Features:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Interactive map with zoom controls</li>
                  <li>✓ Multiple markers with labels</li>
                  <li>✓ Click on map to select location</li>
                  <li>✓ Info windows on marker click</li>
                  <li>✓ Auto-fit bounds for multiple markers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Picker Tab */}
        <TabsContent value="picker" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Location Picker Component</CardTitle>
              <CardDescription>
                Search addresses with autocomplete and select on map
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationPicker
                onLocationSelect={(location) => {
                  console.log("Location selected:", location);
                }}
                label="Search and Select Location"
                placeholder="Type an address or place name..."
              />
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Features:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Mapbox geocoding autocomplete</li>
                  <li>✓ Search by address or place name</li>
                  <li>✓ Click on map to select location</li>
                  <li>✓ &quot;Use current location&quot; button</li>
                  <li>✓ Reverse geocoding (coordinates → address)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Directions Tab */}
        <TabsContent value="directions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Route & Directions Component</CardTitle>
              <CardDescription>
                Display routes between pickup and destination with details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RideRouteMap
                pickup={examplePickup}
                destination={exampleDestination}
                showDetails={true}
              />
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Features:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✓ Route visualization on map</li>
                  <li>✓ Distance calculation</li>
                  <li>✓ Duration estimate</li>
                  <li>✓ Estimated fare calculation</li>
                  <li>✓ Pickup and destination markers</li>
                  <li>✓ Detailed route information</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Full Demo Tab */}
        <TabsContent value="full" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Complete Ride Booking Flow</CardTitle>
              <CardDescription>
                Select pickup and destination to see the full route
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <Button
                  onClick={handleSetExampleRoute}
                  variant="outline"
                  size="sm"
                >
                  Load Example Route
                </Button>
                <Button
                  onClick={handleClearRoute}
                  variant="outline"
                  size="sm"
                  disabled={!selectedPickup && !selectedDestination}
                >
                  Clear
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <LocationPicker
                    onLocationSelect={setSelectedPickup}
                    initialLocation={selectedPickup || undefined}
                    label="Pickup Location"
                    placeholder="Where should we pick you up?"
                  />
                </div>

                <div>
                  <LocationPicker
                    onLocationSelect={setSelectedDestination}
                    initialLocation={selectedDestination || undefined}
                    label="Destination"
                    placeholder="Where are you going?"
                  />
                </div>
              </div>

              {selectedPickup && selectedDestination && (
                <div className="space-y-4">
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-4">Route Preview</h3>
                    <RideRouteMap
                      pickup={selectedPickup}
                      destination={selectedDestination}
                      showDetails={true}
                    />
                  </div>

                  <Button className="w-full" size="lg">
                    <Navigation className="w-4 h-4 mr-2" />
                    Book This Ride
                  </Button>
                </div>
              )}

              {!selectedPickup && !selectedDestination && (
                <div className="border rounded-lg p-8 text-center text-muted-foreground">
                  <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>
                    Select pickup and destination locations to see the route
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* API Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">API Configuration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN &&
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN !==
              "your_mapbox_access_token_here" ? (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm">
                    Mapbox access token configured
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pl-4">
                  Token:{" "}
                  {process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN.substring(0, 10)}
                  ...
                </p>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm">
                    Mapbox access token needs configuration
                  </span>
                </div>
                <p className="text-xs text-muted-foreground pl-4">
                  Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="mt-6 border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">
              1. Get your Mapbox access token
            </p>
            <p className="text-xs text-muted-foreground pl-4">
              Visit{" "}
              <a
                href="https://account.mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                Mapbox Account
              </a>{" "}
              and create a new access token with all scopes enabled
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">2. Add API key to environment</p>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-xs font-mono">
                NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
              </code>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">3. Restart development server</p>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-xs font-mono">npm run dev</code>
            </div>
          </div>
          <p className="text-xs text-muted-foreground pt-2">
            For detailed setup instructions, see{" "}
            <code className="text-primary">MAPBOX_SETUP.md</code>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
