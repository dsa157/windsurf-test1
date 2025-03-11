import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

const Trips = () => {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch('http://localhost:5001/trips/dsa157');
        const data = await response.json();
        setTrips(data);
      } catch (error) {
        console.error('Error fetching trips:', error);
      }
    };

    fetchTrips();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        My Trips
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Trip Name</TableCell>
            <TableCell>Start Date</TableCell>
            <TableCell>End Date</TableCell>
            <TableCell>Number of Legs</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {trips.map((trip) => (
            <TableRow key={trip._id}>
              <TableCell>{trip.name}</TableCell>
              <TableCell>{new Date(trip.legs[0].arrivalDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(trip.legs[trip.legs.length - 1].departureDate).toLocaleDateString()}</TableCell>
              <TableCell>{trip.legs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  );
};

export default Trips;
