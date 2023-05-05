import {
  Alert,
  AlertTitle,
  Box,
  Button,
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
import React, { useEffect, useState } from 'react';

export default function Waypoints() {
// class Waypoints extends React.Component<{}, {
  const [isError, setError] = useState(false as boolean);
  const [isLoaded, setLoaded] = useState(false as boolean);
  const [start, setStart] = useState(0 as number);
  const [page, setPage] = useState(0 as number);
  const [rowsPerPage, setRowsPerPage] = useState(50 as number);
  const [detailsOpen, setDetailsOpen] = useState(false as boolean);
  const [pendingCount, setPendingCount] = useState(0 as number);
  /* @TODO: Define a Waypoint type */
  const [detailsWaypoint, setDetailsWaypoint] = useState(null as any);
  const [waypoints, setWaypoints] = useState([] as any[]);
  const [reload, setReload] = useState(0 as number);

  useEffect(() => {
    getWaypoints();
  }, [page, rowsPerPage, reload]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_HOSTNAME}/waypoints/pending`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
      }
    })
    .then(res => res.json())
    .then(
      (count) => {
        setPendingCount(count);
      },
      (error) => {
        console.log(error);
        setPendingCount(0);
      }
    );
  }, [reload]);

  const handleChangePage = (e: React.MouseEvent<HTMLButtonElement> | null, input: number) => {
    setPage(input);
  };

  const handleChageRowsPerPage = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(e.target.value));
  };

  const handleDetailsOpen = (waypoint: any) => {
    setDetailsOpen(true);
    setDetailsWaypoint(waypoint);
  };

  const handleDetailsClose = () => {
    setDetailsOpen(false);
    setDetailsWaypoint(null);
  }

  const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    boxShadow: 24,
  }

  const getWaypoints = async () => {
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
        setWaypoints(payload);
        setLoaded(true);
      },
      (error) => {
        console.log(error);
        setError(true);
        setLoaded(false);
      }
    );
  }

  const handlePending = async () => {
    await fetch(`${process.env.REACT_APP_API_HOSTNAME}/waypoints/pending/process`, {
      headers: {
        'Authorization': 'Basic ' + btoa(`${process.env.REACT_APP_API_USERNAME}:${process.env.REACT_APP_API_PASSWORD}`),
      }
    })
    .then(res => res.json())
    .then(
      (payload) => {
        console.log(payload);
        if (payload?.message) {
          alert(payload.message);
        }
         setReload(reload + 1);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  return (
    <Container maxWidth="md">
      {isLoaded && <Typography variant="h2" component="h2" gutterBottom>Waypoints</Typography> }
      {!isLoaded && <Typography variant="h2" component="h2" gutterBottom>Loading</Typography> }

      { pendingCount && (
        <Alert
          severity="warning"
          style={{marginBottom: '16px'}}
          action={
            <Button color="inherit" size="small" onClick={handlePending}>
              Process
            </Button>
          }
        >
          There are {pendingCount} waypoints missing a geocode response.
        </Alert>
      )}

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
                  <TableCell><IconButton aria-label="details" onClick={() => {handleDetailsOpen(waypoint)}}><EditLocationIcon></EditLocationIcon></IconButton></TableCell>
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
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChageRowsPerPage} />
      </TableContainer>

      <Modal
        open={detailsOpen}
        onClose={handleDetailsClose}
      >
        <Box sx={modalStyle}>
          <Card>
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
  );
}
