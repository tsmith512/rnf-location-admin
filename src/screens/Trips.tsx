import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography
} from '@mui/material';

import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import NoteAddIcon from '@mui/icons-material/NoteAdd';

import { timestampToDate } from '../lib/util';
import { Link } from 'react-router-dom';

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
    const { isLoaded, trips } = this.state;

    return (
      <Container maxWidth="md">
        {isLoaded && <Typography variant="h2" component="h2" gutterBottom>Trips</Typography> }
        {!isLoaded && <Typography variant="h2" component="h2" gutterBottom>Loading</Typography> }
        <Box sx={{ paddingBottom: 2 }}>
          <Button variant="contained" startIcon={<NoteAddIcon />} component={Link} to={`/trip/new`} aria-label="new">
            Create
          </Button>
        </Box>
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
                  <IconButton component={Link} to={`/trip/${trip.id}`} aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }
}


export default Trips;
