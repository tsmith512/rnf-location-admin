import {
  Card,
  Container,
  Grid,
  Typography
} from '@mui/material';

import React from 'react';

import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: process.env.REACT_APP_GMAPS_API_KEY || '',
  version: 'weekly',
});

class TripMaps extends React.Component {
  map!: google.maps.Map;

  constructor(props: any) {
    super(props);
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

    let totalLatLngBounds = new google.maps.LatLngBounds();

    fetch(`${process.env.REACT_APP_API_HOSTNAME}/trips`)
    .then(res => res.json())
    .then((index) => {
      index.forEach((trip: any) => {
        fetch(`${process.env.REACT_APP_API_HOSTNAME}/trip/${trip.id}`, {
          headers: {
            'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
          },
        })
        .then(res => res.json())
        .then(
          (result) => {
            if (result.line && result.boundaries) {
              this.map.data.addGeoJson({
                type: 'Feature',
                geometry: result.line,
              });

              this.map.data.setStyle({
                strokeColor: '#FF3300',
                strokeWeight: 2,
              });

              const boundaries = result.boundaries.match(/-?\d+\.\d+/g);

              totalLatLngBounds.extend({
                lng: parseFloat(boundaries[0]),
                lat: parseFloat(boundaries[1])
              });
              totalLatLngBounds.extend({
                lng: parseFloat(boundaries[2]),
                lat: parseFloat(boundaries[3]),
              });

              this.map.fitBounds(totalLatLngBounds);
            }
          },
          (error) => {
            console.log(error);
          }
        );
      })
    });
  };

  render() {
    return (
      <Container maxWidth="md">
        <Typography variant="h2" component="h2" gutterBottom>Trip Maps</Typography>

        <Grid container spacing={2}>
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

export default TripMaps;
