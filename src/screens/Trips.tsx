import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography
} from '@mui/material';

import React from 'react';

import EditIcon from '@mui/icons-material/Edit';

import { timestampToDate } from '../lib/util';

class Trips extends React.Component<{}, { isError: boolean, isLoaded: boolean, trips: Array<{}> }> {
  constructor(props: any) {
    super(props);

    this.state = {
      isError: false,
      isLoaded: false,
      trips: [],
    };
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_API_HOSTNAME}/trips`)
    .then(res => res.json())
    .then(
      (result) => {
        this.setState({
          isLoaded: true,
          isError: false,
          trips: result,
        })
      },
      (error) => {
        console.log(error);
        this.setState({
          isLoaded: false,
          isError: true,
          trips: [],
        });
      }
    )
  }

  render() {
    const { trips } = this.state;

    return (
      <React.Fragment>
        <Grid container spacing={2}>
          {trips.map((trip: any, index: number) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="overline" color="text.secondary" gutterBottom>
                    {trip.id} / {trip.slug}
                  </Typography>
                  <Typography variant="h5" component="div" gutterBottom>
                    {trip.label}
                  </Typography>
                  <Typography variant="caption" component="div" gutterBottom>
                    Start: {timestampToDate(trip.start)}
                  </Typography>
                  <Typography variant="caption" component="div" gutterBottom>
                    End: {timestampToDate(trip.end)}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </React.Fragment>
    );
  }
}


export default Trips;
