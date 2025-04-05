import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet';
import L, { LatLngExpression, GeoJSON as LeafletGeoJSON, StyleFunction } from 'leaflet';
import { kml } from '@tmcw/togeojson';
import { Feature, FeatureCollection, GeoJsonObject } from 'geojson'; // Import GeoJSON types
import LoadingSpinner from '../common/LoadingSpinner'; // Assuming you have a spinner

// Function to parse KML color (aabbggrr) to CSS rgba
const kmlColorToCSS = (kmlColor: string | undefined): string => {
  if (!kmlColor || kmlColor.length !== 8) return 'rgba(0,0,0,0.5)'; // Default color
  const aa = kmlColor.substring(0, 2);
  const bb = kmlColor.substring(2, 4);
  const gg = kmlColor.substring(4, 6);
  const rr = kmlColor.substring(6, 8);
  const alpha = parseInt(aa, 16) / 255;
  return `rgba(${parseInt(rr, 16)}, ${parseInt(gg, 16)}, ${parseInt(bb, 16)}, ${alpha})`;
};

// Function to extract style from KML feature properties (simplified)
const getStyleFromProperties = (properties: any): L.PathOptions => {
  // Basic styling based on common KML properties or default
  // This is a simplified example; KML styling can be complex
  // We'll try to read the color from the styleUrl or properties if available
  // For simplicity, we'll use a default style for now, but you can expand this
  // based on the specific structure of your KML's Style/StyleMap elements.

  // Example: Try to parse color from a 'fill' or 'stroke' property if added by the parser
  // or use defaults. The @tmcw/togeojson parser might add style properties.
  const fillColor = properties?.fill ? properties.fill : kmlColorToCSS(properties?.polyColor); // Example property names
  const color = properties?.stroke ? properties.stroke : kmlColorToCSS(properties?.lineColor);
  const weight = properties?.['stroke-width'] ?? 1.2;
  const fillOpacity = properties?.['fill-opacity'] ?? 0.5; // Default opacity

  return {
    color: color || '#3388ff', // Default line color
    weight: weight,
    opacity: 1,
    fillColor: fillColor || '#3388ff', // Default fill color
    fillOpacity: fillOpacity,
  };
};

const MapComponent: React.FC = () => {
  const [geoJsonData, setGeoJsonData] = useState<GeoJsonObject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKmlData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/data/secteurs.kml'); // Fetch from public folder
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const kmlText = await response.text();
        const parser = new DOMParser();
        const kmlDoc = parser.parseFromString(kmlText, 'text/xml');

        // Check for parser errors
        const parserError = kmlDoc.querySelector('parsererror');
        if (parserError) {
            console.error("KML Parsing Error:", parserError.textContent);
            throw new Error("Failed to parse KML file.");
        }

        const converted = kml(kmlDoc) as FeatureCollection; // Convert KML to GeoJSON

        // Ensure coordinates are in [lat, lng] order for Leaflet if necessary
        // @tmcw/togeojson usually outputs [lng, lat], Leaflet expects [lat, lng]
        // However, react-leaflet's GeoJSON component often handles this automatically.
        // If polygons are misplaced, uncomment and adapt the coordinate swapping logic below.
        /*
        converted.features.forEach(feature => {
          if (feature.geometry.type === 'Polygon') {
            feature.geometry.coordinates.forEach(ring => {
              ring.forEach(coord => {
                // Swap lng, lat to lat, lng
                [coord[0], coord[1]] = [coord[1], coord[0]];
              });
            });
          } else if (feature.geometry.type === 'MultiPolygon') {
             feature.geometry.coordinates.forEach(polygon => {
                polygon.forEach(ring => {
                    ring.forEach(coord => {
                        [coord[0], coord[1]] = [coord[1], coord[0]];
                    });
                });
             });
          }
          // Add cases for other geometry types if needed
        });
        */

        setGeoJsonData(converted);

      } catch (err) {
        console.error("Error fetching or parsing KML:", err);
        setError(err instanceof Error ? err.message : 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    };

    fetchKmlData();
  }, []);

  // Define the style function for GeoJSON layers
  const styleGeoJSON: StyleFunction = (feature?: Feature) => {
    if (feature?.properties) {
      // Attempt to get style from properties (may need adjustment based on parser output)
      return getStyleFromProperties(feature.properties);
    }
    // Default style if no properties or feature
    return {
      color: '#ff7800',
      weight: 2,
      opacity: 0.8,
      fillColor: '#ff7800',
      fillOpacity: 0.3,
    };
  };

  // Function to handle actions on each feature (e.g., adding popups)
  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    if (feature.properties && feature.properties.name) {
      // Using Leaflet's bindPopup method directly on the layer
       layer.bindPopup(`<b>${feature.properties.name}</b><br>${feature.properties.description || ''}`);
    }
  };


  // Set initial map view (latitude, longitude) and zoom level
  const initialPosition: LatLngExpression = [45.5, 5.8]; // Centered roughly in the Rhône-Alpes region
  const initialZoom = 8;

  if (loading) {
    return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Erreur de chargement de la carte: {error}</div>;
  }

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden shadow-lg z-0"> {/* Ensure z-index is low */}
      {geoJsonData && (
        <MapContainer center={initialPosition} zoom={initialZoom} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
             key={JSON.stringify(geoJsonData)} // Force re-render if data changes
             data={geoJsonData}
             style={styleGeoJSON}
             onEachFeature={onEachFeature}
           />
        </MapContainer>
      )}
    </div>
  );
};

export default MapComponent;
