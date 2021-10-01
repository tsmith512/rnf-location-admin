import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography
} from '@mui/material';

import React from 'react';
import { StaticMap } from '../components/StaticMap';

import { timestampToDate } from '../lib/util';

class Home extends React.Component<{}, { isError: boolean, isLoaded: boolean, waypoint: any }> {
  constructor(props: any) {
    super(props);

    this.state = {
      isError: false,
      isLoaded: false,
      waypoint: null,
    };
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_HOSTNAME}/waypoints`, {
      headers: {
        // @TODO: /waypoint is filtered, but /waypoints isn't for a single item
        'Range': '0-1',
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
      }
    })
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          isError: false,
          waypoint: result[0],
        })
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
          <Grid item xs={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary" gutterBottom>Location</Typography>
                <Typography variant="h5" component="div">
                  {waypoint?.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography variant="overline" color="text.secondary" gutterBottom>Last Reported</Typography>
                <Typography variant="h5" component="div">
                  {timestampToDate(waypoint?.timestamp)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              {isLoaded && <StaticMap lat={waypoint.lat} lon={waypoint.lon} marker />}
              <CardContent>
                <Typography variant="overline" component="div">Map of {waypoint?.lon}, {waypoint?.lat} </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    );
  }
}


export default Home;
