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

import React from 'react';

import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// These two nested types made Typescript happy using withRouter & params.
type PathParamsType = {
  id: string,
}

type PropsType = RouteComponentProps<PathParamsType>;

class TripDetails extends React.Component<PropsType, { isError: boolean, isLoaded: boolean, isCreate: boolean, trip: any }> {
  constructor(props: any) {
    super(props);

    this.state = {
      isError: false,
      isLoaded: false,
      isCreate: false,
      trip: {},
    };

    this.handleUpdate = this.handleUpdate.bind(this);
    this.saveRecord = this.saveRecord.bind(this);
    this.deleteRecord = this.deleteRecord.bind(this);

    dayjs.extend(utc);
    dayjs.extend(timezone);
  }

  componentDidMount() {
    const id = this.props.match.params.id;

    if (id) {
      fetch(`${process.env.REACT_APP_API_HOSTNAME}/trip/${id}`, {
        headers: {
          'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
        },
      })
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            isError: false,
            isCreate: false,
            trip: result,
          });
        },
        (error) => {
          console.log(error);
          this.setState({
            isLoaded: false,
            isError: true,
            isCreate: false,
            trip: {},
          });
        }
      );
    } else {
      this.setState({
        isLoaded: true,
        isCreate: true,
        trip: {
          label: '',
          slug: '',
        }
      });
    }
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

        if (result.id !== this.props.match.params.id) {
          // Most likely case is that a trip was created.
          this.props.history.push(`/trip/${result.id}`);
        }

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
          trip: {},
        });
      }
    );
  }

  deleteRecord(): void {
    if (window.confirm('Delete this trip?')) {
      fetch(`${process.env.REACT_APP_API_HOSTNAME}/trip/${this.state.trip.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
        },
      })
      .then(
        (response) => {
          if (response.ok) {
            alert('Deleted');
            this.props.history.push(`/trips`);
          } else {
            // @TODO: Render these in the body area
            console.log(response);

            // Start over
            this.componentDidMount();
          }
        },
        (error) => {
          // @TODO: Render these in the body area
          console.log(error);

          // Start over
          this.componentDidMount();
        }
      );
    }
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
      const start = trip.start ? dayjs.unix(trip.start).local() : dayjs();
      const end = trip.start ? dayjs.unix(trip.end).local() : dayjs();

      return (
        <Container maxWidth="md">
          <IconButton component={Link} to={`/trips`} aria-label="back">
            <ArrowBackIcon />
          </IconButton>
          { trip.id && <Typography variant="h2" component="h2" gutterBottom>Details #{trip.id}</Typography> }
          { !trip.id && <Typography variant="h2" component="h2" gutterBottom>Create</Typography> }
          <Card>
            <CardContent>
              <Box component="form" sx={{ m: [1, 0],
                '& > :not(style)': { marginBottom: 2, width: '100%' },
              }}
              noValidate
              autoComplete="off">
                <TextField defaultValue={trip.slug} label="Slug" name="slug" variant="outlined" onChange={this.handleUpdate} />
                <TextField defaultValue={trip.label} label="Label" name="label" variant="outlined" onChange={this.handleUpdate} />
              </Box>
              <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
                <Box sx={{ m: [1, 0],
                  '& > :not(style)': { marginBottom: 2, width: '100%' },
                }}>
                  <DateTimePicker
                    label="Start"
                    value={start}
                    onChange={(n: any) => {this.handleTimeUpdate('start', n)}}
                    />
                  <DateTimePicker
                    label="End"
                    value={end}
                    onChange={(n: any) => {this.handleTimeUpdate('end', n)}}
                    />
                    <Typography variant="caption" component="p"><em>* Device local time</em></Typography>
                </Box>
              </LocalizationProvider>
            </CardContent>
            <CardActions disableSpacing>
              <IconButton aria-label="save" onClick={this.saveRecord}>
                <SaveIcon />
              </IconButton>
              <IconButton aria-label="delete" onClick={this.deleteRecord}>
                <DeleteForeverIcon />
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
