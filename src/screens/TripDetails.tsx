import {
  Card,
  CardActions,
  CardContent,
  Grid,
  IconButton,
  Typography
} from '@mui/material';

import React from 'react';

import { timestampToDate } from '../lib/util';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import { StaticMap } from '../components/StaticMap';

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
      return (
        <React.Fragment>
          <Card>
            <StaticMap line={polyline.fromGeoJSON(trip.line)} />
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
          </Card>
        </React.Fragment>
      );
    } else {
      return (
        <React.Fragment>
          <Typography>Loading</Typography>
        </React.Fragment>
      )
    }
  }
}


export default withRouter(TripDetails);
