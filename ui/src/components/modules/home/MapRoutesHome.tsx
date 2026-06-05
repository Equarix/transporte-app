"use client";
import React, { useEffect, useState } from "react";
import { Map, useMap } from "@vis.gl/react-google-maps";
import { ResponseMapa } from "@/interface/response.interface";

function DirectionsRoute({ path, color }: { path: google.maps.LatLngLiteral[], color: string }) {
  const map = useMap();
  
  useEffect(() => {
    if (!map || !window.google) return;

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map,
      suppressMarkers: true, 
      polylineOptions: {
        strokeColor: color,
        strokeOpacity: 0.8,
        strokeWeight: 4,
      },
    });

    directionsService.route(
      {
        origin: path[0],
        destination: path[1],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Error fetching directions:", status);
          // Fallback to straight line if directions fail (e.g., no route found)
          const fallbackPolyline = new google.maps.Polyline({
            path,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 4,
          });
          fallbackPolyline.setMap(map);
        }
      }
    );

    return () => {
      directionsRenderer.setMap(null);
    };
  }, [map, path, color]);

  return null;
}

export default function MapRoutesHome({ routes }: { routes: ResponseMapa[] }) {
  // Center map around Peru by default
  const defaultCenter = { lat: -9.189967, lng: -75.015152 };
  
  // Random color generator for different routes
  const getRouteColor = (index: number) => {
    const colors = ["#e87722", "#8b5a2b", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e"];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full h-[500px] mt-12 rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative">
      <Map
        defaultZoom={5}
        defaultCenter={defaultCenter}
        mapId="DEMO_MAP_ID"
        gestureHandling={"greedy"}
        disableDefaultUI={true}
      >
        {routes.map((route, index) => {
          if (!route.checkIn || !route.checkOut) return null;
          
          const checkInLat = parseFloat(route.checkIn.lat);
          const checkInLng = parseFloat(route.checkIn.lng);
          const checkOutLat = parseFloat(route.checkOut.lat);
          const checkOutLng = parseFloat(route.checkOut.lng);
          
          if (isNaN(checkInLat) || isNaN(checkInLng) || isNaN(checkOutLat) || isNaN(checkOutLng)) return null;

          const path = [
            { lat: checkInLat, lng: checkInLng },
            { lat: checkOutLat, lng: checkOutLng }
          ];

          return <DirectionsRoute key={route.reserverId} path={path} color={getRouteColor(index)} />;
        })}
      </Map>
    </div>
  );
}
