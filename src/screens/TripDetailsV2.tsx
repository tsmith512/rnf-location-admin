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

import { Link, useParams } from 'react-router-dom';
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

// These two nested types made Typescript happy using withRouter & params.
type PathParamsType = {
  id: string,
}

export default function TripDetailsV2() {
  const { id } = useParams() as any;

  const mapsLoader = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GMAPS_API_KEY || '',
  });

  const [isError, setError] = useState(null as boolean | null);
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
    console.log(trip);
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

  // saveRecord() -- save or create a trip
  // deleteRecord() -- delete a trip

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

      { trip.id && <Typography variant="h2" component="h2" gutterBottom>Details #{trip.id}</Typography> }
      { !trip.id && <Typography variant="h2" component="h2" gutterBottom>Create</Typography> }

      { isLoaded && (
        <Card>
          { trip.line && mapsLoader.isLoaded && <GoogleMap
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
            <IconButton aria-label="save">
              <SaveIcon />
            </IconButton>
            <IconButton aria-label="delete">
              <DeleteForeverIcon />
            </IconButton>
          </CardActions>
        </Card>
      ) }
    </Container>
  );
}
