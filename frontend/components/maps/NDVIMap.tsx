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
    if (!map || !L || !data.length) return;

    try {
      // Clear existing layers
      map.eachLayer((layer: any) => {
        if (layer instanceof L.Rectangle) {
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

          rectangle.bindPopup(`
            <strong>NDVI: ${cell.ndvi.toFixed(3)}</strong><br/>
            Lat: ${cell.lat.toFixed(4)}<br/>
            Lon: ${cell.lon.toFixed(4)}<br/>
            Date: ${cell.year}-${cell.month.toString().padStart(2, '0')}
          `);

          if (onCellClick) {
            rectangle.on('click', () => onCellClick(cell));
          }
        }
      });
    } catch (error) {
      console.error('Error rendering NDVI map:', error);
    }
  }, [map, L, data, onCellClick]);

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full rounded-lg" style={{ minHeight: '500px' }} />

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
