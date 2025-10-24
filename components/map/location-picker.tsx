"use client";

import { useState, useRef, useEffect } from "react";
import { MapComponent } from "./map-component";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Loader2, Navigation } from "lucide-react";

type LocationPickerProps = {
  onLocationSelect: (location: {
    lat: number;
    lng: number;
    address?: string;
  }) => void;
  initialLocation?: { lat: number; lng: number };
  label?: string;
  placeholder?: string;
};

type SearchResult = {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  place_type?: string[];
  text?: string;
  context?: any[];
};

export function LocationPicker({
  onLocationSelect,
  initialLocation,
  label = "Select Location",
  placeholder = "Search for a location...",
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(initialLocation || null);
  const [currentUserLocation, setCurrentUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [address, setAddress] = useState("");
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Get user's current location on mount for proximity bias
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Location permission denied or unavailable");
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        },
      );
    }
  }, []);

  // Handle address search with Mapbox Geocoding API
  const handleAddressSearch = async (value: string) => {
    setAddress(value);

    if (value.length < 2) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce search
    debounceTimerRef.current = setTimeout(async () => {
      const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
      if (!token || token === "your_mapbox_access_token_here") return;

      setIsSearching(true);

      try {
        // Build URL with proximity bias if user location available
        let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value,
        )}.json?access_token=${token}&autocomplete=true&limit=8&types=address,poi,place,locality,neighborhood`;

        // Add proximity bias to search near user
        if (currentUserLocation) {
          url += `&proximity=${currentUserLocation.lng},${currentUserLocation.lat}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        if (data.features) {
          setSearchResults(
            data.features.map((feature: any) => ({
              id: feature.id,
              place_name: feature.place_name,
              center: feature.center,
              place_type: feature.place_type,
              text: feature.text,
              context: feature.context,
            })),
          );
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Error searching locations:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Handle suggestion selection
  const handleSuggestionClick = (result: SearchResult) => {
    setAddress(result.place_name);
    setShowSuggestions(false);

    const location = {
      lat: result.center[1],
      lng: result.center[0],
      address: result.place_name,
    };

    setSelectedLocation(location);
    onLocationSelect(location);
  };

  // Handle map click to select location
  const handleMapClick = async (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    setIsLoadingAddress(true);

    // Reverse geocode to get address
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
    if (!token || token === "your_mapbox_access_token_here") {
      onLocationSelect(location);
      setIsLoadingAddress(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${location.lng},${location.lat}.json?access_token=${token}&types=address,poi,place`,
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const formattedAddress = data.features[0].place_name;
        setAddress(formattedAddress);
        onLocationSelect({
          ...location,
          address: formattedAddress,
        });
      } else {
        onLocationSelect(location);
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      onLocationSelect(location);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  // Get user's current location with high accuracy
  const handleUseCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsGettingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentUserLocation(location);
          handleMapClick(location);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGettingLocation(false);

          let errorMessage = "Unable to get your location. ";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage +=
                "Please enable location permissions in your browser.";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information is unavailable.";
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              break;
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="location-search">{label}</Label>
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              id="location-search"
              type="text"
              placeholder={placeholder}
              value={address}
              onChange={(e) => handleAddressSearch(e.target.value)}
              onFocus={() => {
                if (searchResults.length > 0) setShowSuggestions(true);
              }}
              className="pl-10 pr-10"
              autoComplete="off"
            />
            {(isLoadingAddress || isSearching) && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search Suggestions */}
          {showSuggestions && searchResults.length > 0 && (
            <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-[400px] overflow-y-auto shadow-lg">
              <CardContent className="p-0">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleSuggestionClick(result)}
                    className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-start gap-3 border-b last:border-b-0"
                  >
                    <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {result.text || result.place_name.split(",")[0]}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {result.place_name}
                      </p>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleUseCurrentLocation}
          disabled={isLoadingAddress || isGettingLocation}
          className="w-full"
        >
          {isGettingLocation ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 mr-2" />
          )}
          {isGettingLocation
            ? "Getting Location..."
            : "Use My Current Location"}
        </Button>
      </div>

      {/* Map Display */}
      <Card>
        <CardContent className="p-0">
          <MapComponent
            center={
              selectedLocation ||
              currentUserLocation || { lat: 40.7128, lng: -74.006 }
            }
            markers={
              selectedLocation
                ? [
                    {
                      ...selectedLocation,
                      label: "📍",
                      title: address || "Selected Location",
                    },
                  ]
                : []
            }
            onLocationSelect={handleMapClick}
            className="h-[400px] rounded-lg"
            zoom={selectedLocation ? 16 : currentUserLocation ? 13 : 11}
          />
        </CardContent>
      </Card>

      {selectedLocation && (
        <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
          <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              Selected Location
            </p>
            {address ? (
              <p className="text-sm font-medium break-words">{address}</p>
            ) : (
              <p className="text-sm font-medium">
                {selectedLocation.lat.toFixed(6)},{" "}
                {selectedLocation.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
