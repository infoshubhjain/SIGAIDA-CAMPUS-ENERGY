'use client';

import { useEffect, useRef, useState } from 'react';
import { getTransitStops, getTransitRoutes } from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TransitStop, TransitRoute } from '@/lib/types';
import { Bus, MapPin } from 'lucide-react';

export default function TransitPage() {
  const [stops, setStops] = useState<TransitStop[]>([]);
  const [routes, setRoutes] = useState<TransitRoute[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet
    import('leaflet').then((leaflet) => {
      setL(leaflet);

      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stopsData, routesData] = await Promise.all([
          getTransitStops(),
          getTransitRoutes(),
        ]);
        setStops(stopsData.data);
        setRoutes(routesData.data);
      } catch (err) {
        console.error('Error fetching transit data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!L || !mapRef.current || map) return;

    // Initialize map
    const newMap = L.map(mapRef.current).setView([40.1105, -88.2284], 14);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(newMap);

    setMap(newMap);

    return () => {
      newMap.remove();
    };
  }, [L, map]);

  useEffect(() => {
    if (!map || !L || !stops.length) return;

    try {
      // Clear existing markers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Custom icon for bus stops
      const busIcon = L.divIcon({
        className: 'custom-bus-icon',
        html: '<div style="background-color: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 12px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">🚌</div>',
        iconSize: [24, 24],
      });

      // Add markers for each stop
      stops.forEach((stop) => {
        if (map) {
          const marker = L.marker([stop.stop_lat, stop.stop_lon], { icon: busIcon });
          marker.addTo(map);
          marker.bindPopup(`
            <div style="padding: 4px;">
              <strong>${stop.stop_name}</strong><br/>
              <span style="font-size: 12px; color: #666;">ID: ${stop.stop_id}</span>
            </div>
          `);
        }
      });
    } catch (error) {
      console.error('Error rendering transit map:', error);
    }
  }, [map, L, stops]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 flex items-center">
          <Bus className="mr-3 h-10 w-10 text-blue-600" />
          Campus Transit System
        </h1>
        <p className="text-gray-600 mt-2">
          MTD bus stops and routes serving UIUC campus
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="mr-2 h-4 w-4" />
              Total Bus Stops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{stops.length}</div>
            <p className="text-xs text-gray-500 mt-1">Across campus area</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bus className="mr-2 h-4 w-4" />
              Total Routes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">{routes.length}</div>
            <p className="text-xs text-gray-500 mt-1">MTD transit routes</p>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transit Stop Locations</CardTitle>
          <CardDescription>
            Interactive map showing all MTD bus stops in the campus area
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div ref={mapRef} className="w-full rounded-lg" style={{ height: '500px' }} />
        </CardContent>
      </Card>

      {/* Routes List */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Available Routes</CardTitle>
          <CardDescription>MTD bus routes serving the campus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {routes.map((route) => (
              <div
                key={route.route_id}
                className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedRoute === route.route_id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() =>
                  setSelectedRoute(selectedRoute === route.route_id ? null : route.route_id)
                }
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500 text-white rounded-md px-2 py-1 font-bold text-sm">
                    {route.route_short_name || route.route_id}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{route.route_long_name}</p>
                    <p className="text-xs text-gray-500 mt-1">Route ID: {route.route_id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stops List */}
      <Card>
        <CardHeader>
          <CardTitle>All Bus Stops</CardTitle>
          <CardDescription>
            Complete list of transit stops ({stops.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {stops.map((stop) => (
              <div
                key={stop.stop_id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{stop.stop_name}</p>
                  <p className="text-xs text-gray-500">
                    {stop.stop_lat.toFixed(4)}°N, {stop.stop_lon.toFixed(4)}°W
                  </p>
                </div>
                <div className="text-xs text-gray-500">ID: {stop.stop_id}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
