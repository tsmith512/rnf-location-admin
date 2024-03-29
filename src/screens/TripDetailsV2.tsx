import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  IconButton,
  TextField,
  Typography
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import React, { useCallback, useEffect, useState } from 'react';

import { Link, useHistory, useParams } from 'react-router-dom';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/en';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';


export interface TripProps {
  id?: number | null;
  label: string | null;
  slug: string | null;
  start: number;
  end: number;
  line?: GeoJSON.GeoJSON;
  boundaries?: string;
}

const blankTrip: TripProps = {
  id: null,
  label: '',
  slug: '',
  start: Math.floor(Date.now() / 1000),
  end: Math.floor(Date.now() / 1000),
};

export default function TripDetailsV2() {
  const { id } = useParams() as any;

  const mapsLoader = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GMAPS_API_KEY || '',
  });

  const history = useHistory();

  const [isError, setError] = useState(false as boolean);
  const [isLoaded, setLoaded] = useState(false as boolean);
  const [isCreate, setCreate] = useState(false as boolean);
  // @TODO: Trip is a type in rnf-location-service, use it here?
  const [trip, setTrip] = useState(Object.assign({}, blankTrip) as TripProps);
  const [map, setMap] = React.useState(null);

  dayjs.extend(utc);
  dayjs.extend(timezone);

  // Initial setup
  useEffect(() => {
    if (isFinite(id)) {
      fetch(`${process.env.REACT_APP_API_HOSTNAME}/trip/${id}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
        },
      })
      .then(res => res.json())
      .then(result => {
        setLoaded(true);
        setError(false);
        setCreate(false);
        setTrip(result);
      },
      (error) => {
        console.log(error);
        setLoaded(false);
        setError(true);
        setCreate(false);
        setTrip(Object.assign({}, blankTrip));
      });
    } else {
      // id isn't a number, so we must be creating something new
      setLoaded(false);
      setCreate(true);
      setTrip(Object.assign({}, blankTrip));
    }
  }, [id]);

  const mapOnLoad = useCallback((map) => {
    if (trip.boundaries) {
      const boundaries = trip.boundaries.match(/-?\d+\.\d+/g);
      map.fitBounds({
        /* @ts-ignore */
        west: parseFloat(boundaries[0]),
        /* @ts-ignore */
        south: parseFloat(boundaries[1]),
        /* @ts-ignore */
        east: parseFloat(boundaries[2]),
        /* @ts-ignore */
        north: parseFloat(boundaries[3]),
      });
    }

    if (trip.line) {
      map.data.addGeoJson({
        type: 'Feature',
        geometry: trip.line,
      });

      map.data.setStyle({
        strokeColor: '#FF3300',
        strokeWeight: 2,
      })
    }

    setMap(map);
  }, [trip]);

  const mapOnUnload = useCallback((map) => {
    setMap(null);
  }, []);

  const saveRecord = (): void => {
    fetch(`${process.env.REACT_APP_API_HOSTNAME}/trip`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
      },
      body: JSON.stringify(trip),
    })
    .then(res => res.json())
    .then(
      (result) => {
        // @TODO: Check if 201 and throw a toast.
        alert('Saved');

        if (result.id !== id) {
          // Most likely case is that a trip was created.
          history.replace(`/trip/${result.id}`)
        }

        // Rerun the initial fetch. The upsert hits a table, not the view that
        // assembles the GeoJSON line and boundaries box.
        setTrip(result);
      },
      (error) => {
        // @TODO: Render these in the body area
        console.log(error);
        setLoaded(false);
        setError(true);
        setTrip(Object.assign({}, blankTrip));
      }
    );
  }

  const deleteRecord = (): void => {
    if (window.confirm('Delete this trip?')) {
      fetch(`${process.env.REACT_APP_API_HOSTNAME}/trip/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
        },
      })
      .then(
        (response) => {
          if (response.ok) {
            alert('Deleted');
            history.push('/trips');
          } else {
            // @TODO: Render these in the body area
            console.log(response);
          }
        },
        (error) => {
          // @TODO: Render these in the body area
          console.log(error);
        }
      );
    }
  }

  const handleSimpleUpdate = (e: any): void => {
    const newTrip = Object.assign({}, trip) as TripProps;
    const attribute = e.target.name as keyof typeof newTrip;
    /* @ts-ignore */
    newTrip[attribute] = e.target.value;
    setTrip(newTrip);
  }

  const handleTimeUpdate = (type: 'start' | 'end', val: Dayjs | null): void => {
    const newTrip = Object.assign({}, trip) as TripProps;

    if (val) {
      newTrip[type] = val.unix();
      setTrip(newTrip);
    }
  }

  return (
    <Container maxWidth="md">
      <IconButton component={Link} to={`/trips`} aria-label="back">
        <ArrowBackIcon />
      </IconButton>

      { isLoaded && trip.id && <Typography variant="h2" component="h2" gutterBottom>Details #{trip.id}</Typography> }
      { isCreate && <Typography variant="h2" component="h2" gutterBottom>Create</Typography> }
      { isError && <Typography variant="h2" component="h2" gutterBottom>Error...</Typography> }

      <Card>
        { isLoaded && mapsLoader.isLoaded && trip.line && <GoogleMap
          mapContainerStyle={{
            width: '100%',
            height: '400px',
          }}
          onLoad={mapOnLoad}
          onUnmount={mapOnUnload}
          mapTypeId='terrain'
        /> }
        <CardContent>
          <Box component="form" sx={{ m: [1, 0],
            '& > :not(style)': { marginBottom: 2, width: '100%' },
          }}
          noValidate
          autoComplete="off">
            <TextField value={trip.slug} label="Slug" name="slug" variant="outlined" onChange={handleSimpleUpdate} />
            <TextField value={trip.label} label="Label" name="label" variant="outlined" onChange={handleSimpleUpdate} />
          </Box>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <Box sx={{ m: [1, 0],
              '& > :not(style)': { marginBottom: 2, width: '100%' },
            }}>
              <DateTimePicker
                label="Start"
                value={trip.start ? dayjs.unix(trip.start).local() : dayjs()}
                onChange={(n: Dayjs | null) => {handleTimeUpdate('start', n)}}
                />
              <DateTimePicker
                label="End"
                value={trip.start ? dayjs.unix(trip.end).local() : dayjs()}
                onChange={(n: Dayjs | null) => {handleTimeUpdate('end', n)}}
                />
                <Typography variant="caption" component="p"><em>* Device local time</em></Typography>
            </Box>
          </LocalizationProvider>
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="save" onClick={saveRecord}>
            <SaveIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={deleteRecord}>
            <DeleteForeverIcon />
          </IconButton>
        </CardActions>
      </Card>
    </Container>
  );
}
