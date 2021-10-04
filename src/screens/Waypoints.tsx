import { Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import React from 'react';

class Waypoints extends React.Component<{}, { isError: boolean, isLoaded: boolean, start: number, page: number, rowsPerPage: number, waypoints: Array<any> }> {
  constructor(props: any) {
    super(props);

    this.state = {
      isError: false,
      isLoaded: false,
      start: 0,
      page: 0,
      rowsPerPage: 50,
      waypoints: [],
    };

    this.handleChageRowsPerPage = this.handleChageRowsPerPage.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.getWaypoints = this.getWaypoints.bind(this);
  }

  componentDidMount() {

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
        this.setState({ waypoints: payload });
      },
      (error) => {
        console.log(error);
        return [];
      }
    );
  }

  render() {
    const { isLoaded, page, rowsPerPage, waypoints } = this.state;

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
                <TableCell>Geocode Attempts</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {waypoints.map((waypoint: any) => {
                const date = new Date(waypoint.timestamp * 1000)
                return (
                  <TableRow key={waypoint.timestamp}>
                    <TableCell>{date.toLocaleTimeString()}<br />{date.toDateString()}</TableCell>
                    <TableCell>{waypoint.lon}, {waypoint.lat}</TableCell>
                    <TableCell>{waypoint.label}</TableCell>
                    <TableCell>{waypoint.state}<br />{waypoint.country}</TableCell>
                    <TableCell>{waypoint.geocode_attempts}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={100}
            page={page}
            onPageChange={this.handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={this.handleChageRowsPerPage} />
        </TableContainer>
      </Container>
    )
  }
}

export default Waypoints;
