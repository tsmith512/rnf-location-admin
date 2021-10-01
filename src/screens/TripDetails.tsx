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

import AdapterDateFns from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import React from 'react';

import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { StaticMap } from '../components/StaticMap';
import { DateTimePicker } from '@mui/lab';

var polyline = require('@mapbox/polyline');

// These two nested types made Typescript happy using withRouter & params.
type PathParamsType = {
  id: string,
}

type PropsType = RouteComponentProps<PathParamsType>;

class TripDetails extends React.Component<PropsType, { isError: boolean, isLoaded: boolean, trip: any }> {
  constructor(props: any) {
    super(props);

    this.state = {
      isError: false,
      isLoaded: false,
      trip: {},
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.saveRecord = this.saveRecord.bind(this);
  }

  componentDidMount() {
    const id = this.props.match.params.id;

    fetch(`${process.env.REACT_APP_API_HOSTNAME}/trip/${id}`)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          isError: false,
          trip: result,
        })
      },
      (error) => {
        console.log(error);
        this.setState({
          isLoaded: false,
          isError: true,
          trip: [],
        });
      }
    );
  }

  saveRecord(): void {
    const trip = Object.assign({}, this.state.trip);

    const payload = {
      id: trip.id,
      label: trip.label || '',
      slug: trip.slug,
      start: trip.start,
      end: trip.end,
    };

    fetch(`${process.env.REACT_APP_API_HOSTNAME}/trip`, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
      },
      body: JSON.stringify(payload),
    })
    .then(res => res.json())
    .then(
      (result) => {
        // @TODO: Check if 201 and throw a toast.
        alert('Saved');

        // Rerun the initial fetch. The upsert hits a table, not the view that
        // assembles the GeoJSON line and boundaries box.
        this.componentDidMount();
      },
      (error) => {
        // @TODO: Render these in the body area
        console.log(error);
        this.setState({
          isLoaded: false,
          isError: true,
          trip: [],
        });
      }
    );
  }

  handleUpdate(e: any): void {
    const trip = Object.assign({}, this.state.trip);
    trip[e.target.name] = e.target.value;

    this.setState((state, props) => {
      return {
        trip: trip,
      }
    });
  }

  handleTimeUpdate(type: string, val: any): void {
    const trip = Object.assign({}, this.state.trip);
    trip[type] = val.unix();

    this.setState((state, props) => {
      return {
        trip: trip,
      }
    });
  }

  render() {
    const { isLoaded, trip } = this.state;

    if (isLoaded) {
      const start = new Date(trip.start * 1000);
      const end = new Date(trip.end * 1000);

      return (
        <Container maxWidth="md">
          <IconButton component={Link} to={`/trips`} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2" component="h2" gutterBottom>Details #{trip.id}</Typography>
          <Card>
            { trip.line && <StaticMap line={polyline.fromGeoJSON(trip.line)} /> }
            <CardContent>
              <Box component="form" sx={{ m: [1, 0],
                '& > :not(style)': { marginBottom: 2, width: '100%' },
              }}
              noValidate
              autoComplete="off">
                <TextField defaultValue={trip.slug} label="Slug" name="slug" variant="outlined" onChange={this.handleUpdate} />
                <TextField defaultValue={trip.label} label="Label" name="label" variant="outlined" onChange={this.handleUpdate} />
              </Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ m: [1, 0],
                  '& > :not(style)': { marginBottom: 2, width: '100%' },
                }}>
                  <DateTimePicker renderInput={(props) => <TextField {...props} />}
                    label="Start"
                    value={start}
                    onChange={n => {this.handleTimeUpdate('start', n)}}
                    />
                  <DateTimePicker renderInput={(props) => <TextField {...props} />}
                    label="End"
                    value={end}
                    onChange={n => {this.handleTimeUpdate('end', n)}}
                    />
                </Box>
              </LocalizationProvider>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="save" onClick={this.saveRecord}>
                <SaveIcon />
              </IconButton>
            </CardActions>
          </Card>
        </Container>
      );
    } else {
      return (
        <Container maxWidth="md">
          <IconButton component={Link} to={`/trips`} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h2" component="h2" gutterBottom>Loading</Typography>
        </Container>
      )
    }
  }
}


export default withRouter(TripDetails);
