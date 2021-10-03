import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography
} from '@mui/material';

import React from 'react';

import { timestampToDate } from '../lib/util';

import { Loader } from '@googlemaps/js-api-loader';
import { Link } from 'react-router-dom';

const loader = new Loader({
  apiKey: process.env.REACT_APP_GMAPS_API_KEY || '',
  version: 'weekly',
});

class Home extends React.Component<{}, { isError: boolean, isLoaded: boolean, waypoint: any }> {
  map!: google.maps.Map;

  constructor(props: any) {
    super(props);

    this.state = {
      isError: false,
      isLoaded: false,
      waypoint: null,
    };
  }

  componentDidMount() {
    loader.load().then(() => {
      this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
        center: {
          lat: 36.156900,
          lng: -95.991500,
        },
        zoom: 4,
        mapTypeId: 'terrain',
      });
    });

    fetch(`${process.env.REACT_APP_API_HOSTNAME}/waypoint`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
      }
    })
    .then(res => res.json())
    .then(
      (waypoint) => {
        this.setState({
          isLoaded: true,
          isError: false,
          waypoint: waypoint,
        });

        const position = { lat: waypoint.lat, lng: waypoint.lon };
        new google.maps.Marker({
          position: position,
          map: this.map,
        })

        this.map.setCenter(position);
        this.map.setZoom(12);
      },
      (error) => {
        console.log(error);
        this.setState({
          isLoaded: false,
          isError: true,
          waypoint: null,
        });
      }
    )
  }

  render() {
    const { isLoaded, waypoint } = this.state;

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
              <div id="map"></div>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
}


export default Home;
