import {
  Card,
  Container,
  Grid,
  Typography
} from '@mui/material';

import React, { useCallback, useEffect, useState } from 'react';

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

import { TripProps } from './TripDetailsV2';

export default function TripMaps() {
  const [map, setMap] = useState(null as any);
  // @TODO: but you do have a type written for this...
  const [trips, setTrips] = useState([] as TripProps[]);

  const mapsLoader = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GMAPS_API_KEY || '',
  });

  const mapOnLoad = useCallback((map) => {
    let totalLatLngBounds = new window.google.maps.LatLngBounds();

    trips.forEach((trip) => {
      if (trip.line && trip.boundaries) {
        map.data.addGeoJson({
          type: 'Feature',
          geometry: trip.line,
        });

        map.data.setStyle({
          strokeColor: '#FF3300',
          strokeWeight: 2,
        });

        // Type hacking here but boundaries is calculatd by PostGIS and return
        // as string "BOX(lon lat, lon lat)" so if the prop is set, it'll be this
        const boundaries = trip.boundaries.match(/-?\d+\.\d+/g) as unknown as string[4];
        totalLatLngBounds.extend({
          lng: parseFloat(boundaries[0]),
          lat: parseFloat(boundaries[1])
        });
        totalLatLngBounds.extend({
          lng: parseFloat(boundaries[2]),
          lat: parseFloat(boundaries[3]),
        });
      }
    });
    map.fitBounds(totalLatLngBounds);
    setMap(map);
  }, [trips]);

  const mapOnUnload = useCallback((map) => {
    setMap(null);
  }, []);

  useEffect(() => {
    // The first fetch gives us the list of trip summaries
    fetch(`${process.env.REACT_APP_API_HOSTNAME}/trips`)
      .then(res => res.json())
      .then((index) => {
        return index.map((trip: TripProps) => {
          // Fetch for details to get all the lines
          return fetch(`${process.env.REACT_APP_API_HOSTNAME}/trip/${trip.id}`, {
            headers: {
              'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
            },
          })
          .then(res => res.json() as Promise<TripProps>)
          .then(trip => {
            return trip;
          });
        });
    })
      .then((trips: Promise<TripProps>[]) => {
        Promise.all(trips).then((allTrips) => {
          setTrips(allTrips);
        })
      });
  }, []);

  return (
    <Container maxWidth="md">
      <Typography variant="h2" component="h2" gutterBottom>Trip Maps</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Card>
            { mapsLoader.isLoaded && trips.length && <GoogleMap
                mapContainerStyle={{
                  width: '100%',
                  height: '600px',
                }}
                onLoad={mapOnLoad}
                onUnmount={mapOnUnload}
                mapTypeId='terrain'
            /> }
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
