"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Loader as LoaderIcon } from "lucide-react";

type MapComponentProps = {
  center?: { lat: number; lng: number };
  markers?: Array<{ lat: number; lng: number; label?: string; title?: string }>;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  className?: string;
  zoom?: number;
  showDirections?: boolean;
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
};

const DEFAULT_CENTER = { lat: 40.7128, lng: -74.006 }; // New York City
const DEFAULT_ZOOM = 13;

export function MapComponent({
  center = DEFAULT_CENTER,
  markers = [],
  onLocationSelect,
  className,
  zoom = DEFAULT_ZOOM,
  showDirections = false,
  origin,
  destination,
}: MapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize Mapbox
  useEffect(() => {
    const token = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!token || token === "your_mapbox_access_token_here") {
      setMapError("Mapbox access token not configured");
      setIsLoading(false);
      return;
    }

    if (!mapContainerRef.current) return;

    try {
      mapboxgl.accessToken = token;

      // Initialize the map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [center.lng, center.lat],
        zoom: zoom,
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");

      // Handle map click for location selection
      if (onLocationSelect) {
        map.on("click", (e) => {
          onLocationSelect({
            lat: e.lngLat.lat,
            lng: e.lngLat.lng,
          });
        });
      }

      map.on("load", () => {
        setIsLoading(false);
      });

      map.on("error", (e) => {
        console.error("Mapbox error:", e);
        setMapError("Failed to load map");
        setIsLoading(false);
      });

      mapRef.current = map;

      return () => {
        map.remove();
      };
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      setMapError("Failed to initialize map");
      setIsLoading(false);
    }
  }, []);

  // Update map center
  useEffect(() => {
    if (mapRef.current && !isLoading) {
      mapRef.current.setCenter([center.lng, center.lat]);
    }
  }, [center.lat, center.lng, isLoading]);

  // Update map zoom
  useEffect(() => {
    if (mapRef.current && !isLoading) {
      mapRef.current.setZoom(zoom);
    }
  }, [zoom, isLoading]);

  // Handle markers
  useEffect(() => {
    if (!mapRef.current || isLoading) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData, index) => {
      const el = document.createElement("div");
      el.className = "mapbox-marker";
      el.style.width = "32px";
      el.style.height = "32px";
      el.style.borderRadius = "50%";
      el.style.backgroundColor = index === 0 ? "#10b981" : "#ef4444";
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = "white";
      el.style.fontWeight = "bold";
      el.style.fontSize = "14px";
      el.style.cursor = "pointer";

      if (markerData.label) {
        el.textContent = markerData.label;
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.lng, markerData.lat])
        .addTo(mapRef.current!);

      // Add popup if title exists
      if (markerData.title) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setText(
          markerData.title,
        );
        marker.setPopup(popup);
      }

      markersRef.current.push(marker);
    });

    // Fit bounds if multiple markers
    if (markers.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      markers.forEach((marker) => {
        bounds.extend([marker.lng, marker.lat]);
      });
      mapRef.current.fitBounds(bounds, { padding: 50 });
    }
  }, [markers, isLoading]);

  // Handle directions
  useEffect(() => {
    if (
      !mapRef.current ||
      isLoading ||
      !showDirections ||
      !origin ||
      !destination
    )
      return;

    const map = mapRef.current;

    // Wait for map to load before adding route
    if (!map.isStyleLoaded()) {
      map.once("load", () => {
        addRoute(map, origin, destination);
      });
    } else {
      addRoute(map, origin, destination);
    }

    return () => {
      // Clean up route layer
      if (map && map.getStyle()) {
        if (map.getLayer("route")) {
          map.removeLayer("route");
        }
        if (map.getSource("route")) {
          map.removeSource("route");
        }
      }
    };
  }, [origin, destination, showDirections, isLoading]);

  const addRoute = async (
    map: mapboxgl.Map,
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
  ) => {
    try {
      // Check if map still exists and is loaded
      if (!map || !map.getStyle()) {
        return;
      }

      // Fetch directions from Mapbox Directions API
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`,
        { method: "GET" },
      );

      const json = await query.json();

      if (!json.routes || json.routes.length === 0) {
        console.error("No route found");
        return;
      }

      const data = json.routes[0];
      const route = data.geometry.coordinates;

      // Check again if map still exists before modifying
      if (!map || !map.getStyle()) {
        return;
      }

      // Remove existing route if any
      if (map.getLayer("route")) {
        map.removeLayer("route");
      }
      if (map.getSource("route")) {
        map.removeSource("route");
      }

      // Add route to map
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        },
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#4F46E5",
          "line-width": 5,
          "line-opacity": 0.8,
        },
      });

      // Fit map to route
      const bounds = new mapboxgl.LngLatBounds();
      route.forEach((coord: number[]) => {
        bounds.extend(coord as [number, number]);
      });
      map.fitBounds(bounds, { padding: 50 });
    } catch (error) {
      console.error("Error fetching directions:", error);
    }
  };

  if (mapError) {
    return (
      <div className={`relative ${className}`}>
        <div className="w-full h-full rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center border-2 border-dashed border-muted">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-sm font-medium text-foreground mb-2">
              Map Configuration Required
            </p>
            <p className="text-xs text-muted-foreground">{mapError}</p>
            <div className="mt-4 p-3 bg-muted rounded-lg text-left">
              <p className="text-xs font-mono text-muted-foreground">
                Add to .env.local:
                <br />
                <span className="text-primary">
                  NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
                </span>
                =your_token
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/20 backdrop-blur-sm z-10 rounded-lg">
          <div className="text-center">
            <LoaderIcon className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Loading map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapContainerRef}
        className="w-full h-full rounded-lg"
        style={{ minHeight: "300px" }}
      />
    </div>
  );
}
