import {
  Box,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import AdapterDateFns from '@mui/lab/AdapterDayjs';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import React from 'react';

import { timestampToDate } from '../lib/util';

import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { StaticMap } from '../components/StaticMap';
import { DateTimePicker } from '@mui/lab';

var polyline = require('@mapbox/polyline');

// Type whatever you expect in 'this.props.match.params.*'
type PathParamsType = {
  id: string,
}

// Your component own properties
type PropsType = RouteComponentProps<PathParamsType> & {
  someString: string,
}

class TripDetails extends React.Component<PropsType, { isError: boolean, isLoaded: boolean, trip: any }> {
  constructor(props: any) {
    super(props);

    this.state = {
      isError: false,
      isLoaded: false,
      trip: {},
    };
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
    )
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
            <StaticMap line={polyline.fromGeoJSON(trip.line)} />
            <CardContent>
              <Box component="form" sx={{ m: [1, 0],
                '& > :not(style)': { marginBottom: 2, width: '100%' },
              }}
              noValidate
              autoComplete="off">
                <TextField defaultValue={trip.slug} label="Slug" variant="outlined" />
                <TextField defaultValue={trip.label} label="Label" variant="outlined" />
              </Box>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ m: [1, 0],
                  '& > :not(style)': { marginBottom: 2, width: '100%' },
                }}>
                  <DateTimePicker renderInput={(props) => <TextField {...props} />}
                    label="Start"
                    value={start}
                    onChange={(newValue) => { alert(newValue); } }
                    />
                  <DateTimePicker renderInput={(props) => <TextField {...props} />}
                    label="End"
                    value={end}
                    onChange={(newValue) => { alert(newValue); } }
                    />
                </Box>
              </LocalizationProvider>
            </CardContent>
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
