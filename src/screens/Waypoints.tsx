import {
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';

import EditLocationIcon from '@mui/icons-material/EditLocation';
import React from 'react';

import { Loader } from '@googlemaps/js-api-loader';
const loader = new Loader({
  apiKey: process.env.REACT_APP_GMAPS_API_KEY || '',
  version: 'weekly',
});

class Waypoints extends React.Component<{}, {
  isError: boolean,
  isLoaded: boolean,
  start: number,
  page: number,
  rowsPerPage: number,
  detailsOpen: boolean,
  detailsWaypoint: any, /* @TODO: Define a Waypoint type */
  waypoints: Array<any>,
}> {
  map!: google.maps.Map;


  constructor(props: any) {
    super(props);

    this.state = {
      isError: false,
      isLoaded: false,
      start: 0,
      page: 0,
      rowsPerPage: 50,
      detailsOpen: false,
      detailsWaypoint: null,
      waypoints: [],
    };

    this.handleChageRowsPerPage = this.handleChageRowsPerPage.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleDetailsOpen = this.handleDetailsOpen.bind(this);
    this.handleDetailsClose = this.handleDetailsClose.bind(this);
    this.getWaypoints = this.getWaypoints.bind(this);
  }

  componentDidMount() {
    this.getWaypoints();
    loader.load();
  }

  handleChangePage(e: React.MouseEvent<HTMLButtonElement> | null, input: number) {
    this.setState({
      page: input,
    }, this.getWaypoints);
  }

  handleChageRowsPerPage(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    this.setState({
      rowsPerPage: parseInt(e.target.value),
    }, this.getWaypoints);
  }

  handleDetailsOpen(waypoint: any) {
    this.setState({
      detailsOpen: true,
      detailsWaypoint: waypoint,
    }, () => {
      /* @TODO: This is obviously shitty. #map doesn't exist until the modal is
         opened and re-rendered. Just putting this in a setState() callback was
         not long enough... */
         setTimeout(() => {
          const position = {
            lat: this.state.detailsWaypoint.lat,
            lng: this.state.detailsWaypoint.lon,
          };
          this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
            center: position,
            zoom: 8,
            mapTypeId: 'terrain',
          });

          new google.maps.Marker({
            position: position,
            map: this.map,
          });
        }, 500);
    });
  }

  handleDetailsClose() {
    this.setState({
      detailsOpen: false,
      detailsWaypoint: null,
    });
  }

  modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    boxShadow: 24,
  }

  async getWaypoints() {
    const { page, rowsPerPage } = this.state;

    const start = page * rowsPerPage;
    const end = start + rowsPerPage;

    await fetch(`${process.env.REACT_APP_API_HOSTNAME}/waypoints`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
        'Range': `${start}-${end}`,
      }
    })
    .then(res => res.json())
    .then(
      (payload) => {
        this.setState({
          waypoints: payload,
          isLoaded: true,
        });
      },
      (error) => {
        console.log(error);
        return [];
      }
    );
  }

  render() {
    const {
      isLoaded,
      page,
      rowsPerPage,
      waypoints,
      detailsOpen,
      detailsWaypoint,
    } = this.state;

    return (
      <Container maxWidth="md">
        {isLoaded && <Typography variant="h2" component="h2" gutterBottom>Waypoints</Typography> }
        {!isLoaded && <Typography variant="h2" component="h2" gutterBottom>Loading</Typography> }

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Timestamp</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>State</TableCell>
                <TableCell>Details</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {waypoints.map((waypoint: any) => {
                const date = new Date(waypoint.timestamp * 1000)
                return (
                  <TableRow key={waypoint.timestamp} hover={true}>
                    <TableCell>{date.toLocaleTimeString()}<br />{date.toDateString()}</TableCell>
                    <TableCell>{waypoint.lon}, {waypoint.lat}</TableCell>
                    <TableCell>{waypoint.label}</TableCell>
                    <TableCell>{waypoint.state}<br />{waypoint.country}</TableCell>
                    <TableCell><IconButton aria-label="details" onClick={() => {this.handleDetailsOpen(waypoint)}}><EditLocationIcon></EditLocationIcon></IconButton></TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            /* @TODO: Can we get a quick count of all? This is dumb. */
            count={10000000}
            page={page}
            onPageChange={this.handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={this.handleChageRowsPerPage} />
        </TableContainer>

        <Modal
          open={detailsOpen}
          onClose={this.handleDetailsClose}
        >
          <Box sx={this.modalStyle}>
            <Card>
              <div id="map"></div>
              <CardContent>
                <Typography variant="h6" component="h2">Details</Typography>
                <pre>
                  {JSON.stringify(detailsWaypoint, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </Box>
        </Modal>
      </Container>
    )
  }
}

export default Waypoints;
