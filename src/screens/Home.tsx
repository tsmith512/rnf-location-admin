import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography
} from '@mui/material';

import React, { useCallback, useEffect, useState } from 'react';

import { timestampToDate } from '../lib/util';

import { Link } from 'react-router-dom';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

export default function Home() {
  const [waypoint, setWaypoint] = useState(null as any);
  const [isLoaded, setLoaded] = useState(false as boolean);
  const [isError, setError] = useState(false as boolean);
  const [map, setMap] = useState(null as any);

  const mapsLoader = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GMAPS_API_KEY || '',
  });

  const mapOnLoad = useCallback((map) => {
    map.setCenter({lat: waypoint.lat, lng: waypoint.lon});
    map.setZoom(10);

    new window.google.maps.Marker({
      position: {lat: waypoint.lat, lng: waypoint.lon},
      map: map,
    });

    setMap(map);
  }, [waypoint]);

  const mapOnUnload = useCallback((map) => {
    setMap(null);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOSTNAME}/waypoints`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
        'Range': '0-1',
      }
    })
    .then(res => res.json())
    .then(
      (payload) => {
        const waypoint = payload[0];
        setWaypoint(payload[0]);
        setLoaded(true);
        setError(false);

        // const position = { lat: waypoint.lat, lng: waypoint.lon };
      },
      (error) => {
        console.log(error);
        setWaypoint(null);
        setLoaded(false);
        setError(true);
      }
    );
  }, []);

  return (
    <Container maxWidth="md">
      {isLoaded && <Typography variant="h2" component="h2" gutterBottom>Latest</Typography> }
      {!isLoaded && <Typography variant="h2" component="h2" gutterBottom>Loading</Typography> }

      <Grid container spacing={2}>
        <Grid item xs={12} md={(waypoint?.trips ? 4 : 6)}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary" gutterBottom>Location</Typography>
              <Typography variant="h5" component="div">
                {waypoint?.label}
              </Typography>
              <Typography variant="caption" component="div">
                {waypoint?.lon}, {waypoint?.lat}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={(waypoint?.trips ? 4 : 6)}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="overline" color="text.secondary" gutterBottom>Last Reported</Typography>
              <Typography variant="h5" component="div">
                {timestampToDate(waypoint?.timestamp)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {waypoint?.trips?.length &&
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary" gutterBottom>Trip(s)</Typography>
                <Typography variant="h5" component="div">
                  {waypoint.trips.map((id: number) => (
                    <Link to={`/trip/${id}`}>#{id}</Link>
                  ))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        }
        <Grid item xs={12}>
          <Card>
            { mapsLoader.isLoaded && waypoint && <GoogleMap
              mapContainerStyle={{
                width: '100%',
                height: '400px',
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
