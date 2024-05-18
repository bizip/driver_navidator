/* eslint-disable no-unused-vars */
/* eslint-disable jsx-quotes */
/* eslint-disable react/jsx-indent */
/* eslint-disable prefer-template */
/* eslint-disable padded-blocks */
/* eslint-disable max-len */
/* eslint-disable no-new */
/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';

const Map = ({ driverLocation }) => {
  const mapRef = useRef(null);
  const directionsService = useRef(null);
  const mainDirectionsRenderer = useRef(null);
  const driverDirectionsRenderer = useRef(null);
  const [eta, setEta] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (!window.google) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: -1.939826787816454, lng: 30.0445426438232 },
      zoom: 12,
    });

    directionsService.current = new window.google.maps.DirectionsService();
    mainDirectionsRenderer.current = new window.google.maps.DirectionsRenderer();
    mainDirectionsRenderer.current.setMap(map);

    const stops = [
      { position: { lat: -1.9355377074007851, lng: 30.060163829002217 }, label: 'Stop A' },
      { position: { lat: -1.9358808342336546, lng: 30.08024820994666 }, label: 'Stop B' },
      { position: { lat: -1.9489196023037583, lng: 30.092607828989397 }, label: 'Stop C' },
      { position: { lat: -1.9592132952818164, lng: 30.106684061788073 }, label: 'Stop D' },
      { position: { lat: -1.9487480402200394, lng: 30.126596781356923 }, label: 'Stop E' },
      { position: { lat: -1.9365670876910166, lng: 30.13020167024439 }, label: 'Kimironko' },
    ];

    stops.forEach((stop) => {
      new window.google.maps.Marker({
        position: stop.position,
        map,
        title: stop.label,
      });
    });

    if (driverLocation) {
      new window.google.maps.Marker({
        position: { lat: driverLocation.latitude, lng: driverLocation.longitude },
        map,
        title: 'Driver',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        },
      });

      if (stops.length > 0) {
        const driverLatLng = new window.google.maps.LatLng(driverLocation.latitude, driverLocation.longitude);
        const nextStopLatLng = new window.google.maps.LatLng(stops[0].position.lat, stops[0].position.lng);

        driverDirectionsRenderer.current = new window.google.maps.DirectionsRenderer({
          polylineOptions: {
            strokeColor: '#0000FF',
            strokeOpacity: 1.0,
            strokeWeight: 2,
          },
        });

        driverDirectionsRenderer.current.setMap(map);

        const request = {
          origin: driverLatLng,
          destination: nextStopLatLng,
          travelMode: window.google.maps.TravelMode.DRIVING,
        };

        directionsService.current.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            driverDirectionsRenderer.current.setDirections(result);

            const durationInSeconds = result.routes[0].legs[0].duration.value;
            const etaInMinutes = Math.ceil(durationInSeconds / 60); // Convert to minutes
            setEta(etaInMinutes);

            const distanceInMeters = result.routes[0].legs[0].distance.value;
            const distanceInKilometers = (distanceInMeters / 1000).toFixed(2); // Convert to kilometers
            setDistance(distanceInKilometers);
          }
        });
      }
    }

    const waypoints = stops.slice(1, -1).map((stop) => ({
      location: stop.position,
      stopover: true,
    }));

    const routeRequest = {
      origin: stops[0].position,
      destination: stops[stops.length - 1].position,
      waypoints,
      optimizeWaypoints: false,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.current.route(routeRequest, (result, status) => {
      if (status === 'OK') {
        mainDirectionsRenderer.current.setDirections(result);
      }
    });

  }, [driverLocation]);

  return (
    <div>
         <div className='header'>
        <div>
           <h2>Nyabugogo - Kimiromko</h2>
            Next stop:
        </div>
        {eta !== null && distance !== null ? (
          `Distance: ${distance} km, ETA: ${eta} minutes`
        ) : (
          'Calculating ETA and Distance...'
        )}
         </div>
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default Map;
