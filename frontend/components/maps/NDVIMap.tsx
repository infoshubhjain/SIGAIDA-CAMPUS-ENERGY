'use client';

import { useEffect, useRef, useState } from 'react';
import { NDVIGridCell } from '@/lib/types';
import { getNDVIColor } from '@/lib/utils';

interface NDVIMapProps {
  data: NDVIGridCell[];
  onCellClick?: (cell: NDVIGridCell) => void;
}

export function NDVIMap({ data, onCellClick }: NDVIMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet (only client-side)
    console.log('🗺️ Loading Leaflet library...');
    import('leaflet').then((leaflet) => {
      console.log('✅ Leaflet loaded successfully');
      // Fix default icon paths for Leaflet in Next.js
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      setL(leaflet);

      // Import Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
        console.log('✅ Leaflet CSS loaded');
      }
    }).catch((error) => {
      console.error('❌ Failed to load Leaflet:', error);
    });
  }, []);

  useEffect(() => {
    if (!L) {
      console.log('⏳ Waiting for Leaflet to load...');
      return;
    }
    if (!mapRef.current) {
      console.log('⏳ Waiting for map container...', mapRef.current);
      return;
    }
    if (map) {
      console.log('✅ Map already initialized');
      return;
    }

    console.log('🗺️ Initializing NDVI map...', mapRef.current);

    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!mapRef.current) {
        console.error('❌ Map ref still not available after delay');
        return;
      }

      try {
        // Initialize map
        const newMap = L.map(mapRef.current, {
          preferCanvas: true,
        }).setView([40.1105, -88.2284], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(newMap);

        setMap(newMap);
        console.log('✅ NDVI map initialized successfully');

        // Force map to resize after initialization
        setTimeout(() => {
          newMap.invalidateSize();
          console.log('✅ Map resized');
        }, 100);
      } catch (error) {
        console.error('❌ Error initializing NDVI map:', error);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (map) {
        console.log('🗑️ Cleaning up NDVI map');
        map.remove();
      }
    };
  }, [L, map]);

  useEffect(() => {
    if (!map || !L || !data.length) return;

    try {
      // Clear existing rectangles (keep base tile layer)
      map.eachLayer((layer: any) => {
        if (layer.options && layer.options.fillOpacity !== undefined && !layer._url) {
          map.removeLayer(layer);
        }
      });

      // Add NDVI grid cells
      data.forEach((cell) => {
        const cellSize = 0.0009; // ~100m in degrees
        const bounds: [[number, number], [number, number]] = [
          [cell.lat - cellSize / 2, cell.lon - cellSize / 2],
          [cell.lat + cellSize / 2, cell.lon + cellSize / 2],
        ];

        const rectangle = L.rectangle(bounds, {
          color: getNDVIColor(cell.ndvi),
          weight: 0,
          fillOpacity: 0.7,
        });

        if (map && rectangle) {
          rectangle.addTo(map);

          // Create popup with better styling and options
          const popupContent = `
            <div style="padding: 8px; min-width: 180px;">
              <div style="font-size: 16px; font-weight: bold; color: #059669; margin-bottom: 8px;">
                NDVI: ${cell.ndvi.toFixed(3)}
              </div>
              <div style="font-size: 13px; color: #666; line-height: 1.6;">
                <strong>Location:</strong><br/>
                Lat: ${cell.lat.toFixed(4)}<br/>
                Lon: ${cell.lon.toFixed(4)}<br/>
                <strong>Date:</strong> ${cell.year}-${cell.month.toString().padStart(2, '0')}
              </div>
            </div>
          `;

          rectangle.bindPopup(popupContent, {
            closeButton: true,
            autoClose: false,
            closeOnClick: false,
            maxWidth: 300,
            className: 'ndvi-popup'
          });

          // Handle click events
          rectangle.on('click', () => {
            rectangle.openPopup();
            if (onCellClick) {
              onCellClick(cell);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error rendering NDVI map:', error);
    }
  }, [map, L, data, onCellClick]);

  return (
    <div className="relative w-full h-full" style={{ minHeight: '500px' }}>
      {!map && L && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-[999] rounded-lg">
          <div className="text-center">
            <div className="spinner mb-2 mx-auto"></div>
            <p className="text-sm text-gray-500">Initializing map...</p>
          </div>
        </div>
      )}
      {!L && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-[999] rounded-lg">
          <div className="text-center">
            <div className="spinner mb-2 mx-auto"></div>
            <p className="text-sm text-gray-500">Loading Leaflet...</p>
          </div>
        </div>
      )}
      <div
        ref={mapRef}
        id="ndvi-map"
        className="w-full h-full rounded-lg"
        style={{
          height: '100%',
          minHeight: '500px',
          visibility: map ? 'visible' : 'hidden'
        }}
      />

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white p-3 rounded-lg shadow-lg z-[1000]">
        <p className="text-xs font-semibold mb-2">NDVI Scale</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-3" style={{ backgroundColor: '#059669' }}></div>
            <span className="text-xs">0.6+ Excellent</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3" style={{ backgroundColor: '#10b981' }}></div>
            <span className="text-xs">0.5-0.6 Very Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3" style={{ backgroundColor: '#34d399' }}></div>
            <span className="text-xs">0.4-0.5 Good</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3" style={{ backgroundColor: '#6ee7b7' }}></div>
            <span className="text-xs">0.3-0.4 Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3" style={{ backgroundColor: '#d1fae5' }}></div>
            <span className="text-xs">0.2-0.3 Low</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-3" style={{ backgroundColor: '#e5e7eb' }}></div>
            <span className="text-xs">&lt;0.2 Very Low</span>
          </div>
        </div>
      </div>
    </div>
  );
}
