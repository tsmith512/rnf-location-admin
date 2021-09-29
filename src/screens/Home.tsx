import {
  Card,
  CardContent,
  Grid,
  Typography
} from '@mui/material';

import React from 'react';

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

  timestampToDate(input: number): string {
    const date = new Date(input * 1000);
    return date.toLocaleString();
  }

  render() {
    const { waypoint } = this.state;

    return (
      <React.Fragment>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary" gutterBottom>Location</Typography>
                <Typography variant="h5" component="div">
                  {waypoint?.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6}>
            <Card>
              <CardContent>
                <Typography variant="overline" color="text.secondary" gutterBottom>Last Reported</Typography>
                <Typography variant="h5" component="div">
                  {this.timestampToDate(waypoint?.timestamp)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>Placeholder</Typography>
                <Typography variant="h5" component="div">Map of {waypoint?.lon}, {waypoint?.lat} </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}


export default Home;
