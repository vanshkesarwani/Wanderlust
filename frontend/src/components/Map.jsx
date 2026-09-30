import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export default function Map({ coordinates, location, country, mapToken }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [tokenMissing, setTokenMissing] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;
    const token = mapToken || import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      setTokenMissing(true);
      return;
    }
    setTokenMissing(false);
    mapboxgl.accessToken = token;

    const coords = (coordinates && coordinates.length === 2 && !isNaN(coordinates[0]) && !isNaN(coordinates[1]))
      ? coordinates
      : [77.2090, 28.6139]; // Default coordinates

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: coords,
        zoom: 9
      });

      // Navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Create Custom Marker
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<div style="font-family: sans-serif; padding: 4px;">
           <h4 style="margin: 0; font-size: 14px; font-weight: 700; color: #ff385c;">${location || 'Stay Location'}</h4>
           <p style="margin: 4px 0 0 0; font-size: 12px; color: #555;">Exact location provided after booking</p>
         </div>`
      );

      new mapboxgl.Marker({ color: '#ff385c' })
        .setLngLat(coords)
        .setPopup(popup)
        .addTo(map.current);

    } catch (err) {
      console.warn("Mapbox initialization error:", err);
      setTokenMissing(true);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [coordinates, location, country, mapToken]);

  if (tokenMissing) {
    return (
      <div className="map-container fallback-map-view">
        <div className="fallback-map-inner">
          <div className="fallback-map-pin">
            <i className="fa-solid fa-location-dot"></i>
          </div>
          <h4>{location || 'Scenic Stay Location'}, {country || 'World'}</h4>
          <p>Exact retreat location and check-in instructions are shared upon reservation confirmation.</p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="map-container" />;
}
