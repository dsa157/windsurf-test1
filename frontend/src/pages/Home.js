import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Box, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
};

const formatDateInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date)) return '';
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: '2-digit' });
};

const parseDateInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return isNaN(date) ? '' : date;
};

const getTripSummary = (trip) => {
  const arrivalDates = trip.legs.map(leg => new Date(leg.arrivalDate));
  const departureDates = trip.legs.map(leg => new Date(leg.departureDate));
  return {
    name: trip.name,
    earliestArrival: formatDate(new Date(Math.min(...arrivalDates))),
    latestDeparture: formatDate(new Date(Math.max(...departureDates)))
  };
};

const validateTrip = (trip) => {
  if (!trip.name || trip.name.trim() === '') {
    return 'Trip name is required';
  }
  if (!trip.userId || trip.userId.trim() === '') {
    return 'User ID is required';
  }
  for (let i = 0; i < trip.legs.length; i++) {
    const leg = trip.legs[i];
    if (!leg.city || leg.city.trim() === '') {
      return `City is required for leg ${i + 1}`;
    }
    if (!leg.arrivalDate || isNaN(new Date(leg.arrivalDate))) {
      return `Invalid arrival date for leg ${i + 1}`;
    }
    if (!leg.departureDate || isNaN(new Date(leg.departureDate))) {
      return `Invalid departure date for leg ${i + 1}`;
    }
    if (new Date(leg.arrivalDate) > new Date(leg.departureDate)) {
      return `Arrival date must be before departure date for leg ${i + 1}`;
    }
    if (i > 0 && new Date(trip.legs[i - 1].departureDate) > new Date(leg.arrivalDate)) {
      return `Leg ${i} arrival date must be after previous leg's departure date`;
    }
  }
  return null;
};

const Home = () => {
  const [cities, setCities] = useState(['', '']);
  const [tripName, setTripName] = useState('');
  const [legs, setLegs] = useState([
    { city: '', arrivalDate: '', departureDate: '' }
  ]);
  const [confirmation, setConfirmation] = useState('');
  const [savedTrips, setSavedTrips] = useState([]);
  const [userId, setUserId] = useState('dsa157');

  const handleCityChange = (index, value) => {
    const newCities = [...cities];
    newCities[index] = value;
    setCities(newCities);
  };

  const handleAddCity = () => {
    setCities([...cities, '']);
  };

  const handleTripNameChange = (e) => {
    setTripName(e.target.value);
    setConfirmation('');
  };

  const handleUserIdChange = (e) => {
    setUserId(e.target.value);
    setConfirmation('');
  };

  const handleLegChange = (index, field, value) => {
    const updatedLegs = [...legs];
    updatedLegs[index][field] = value;
    if (field === 'departureDate' && index < legs.length - 1) {
      updatedLegs[index + 1].arrivalDate = value;
    }
    setLegs(updatedLegs);
    setConfirmation('');
  };

  const addLeg = () => {
    const lastLeg = legs[legs.length - 1];
    setLegs([...legs, { city: '', arrivalDate: lastLeg.departureDate, departureDate: '' }]);
  };

  const calculateDays = (arrivalDate, departureDate) => {
    if (!arrivalDate || !departureDate) return 0;
    const arrival = new Date(arrivalDate);
    const departure = new Date(departureDate);
    return Math.ceil((departure - arrival) / (1000 * 60 * 60 * 24));
  };

  const fetchSavedTrips = async () => {
    try {
      const response = await fetch(`http://localhost:5001/trips?userId=${userId}`);
      const data = await response.json();
      setSavedTrips(data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleSaveTrip = async () => {
    const validationError = validateTrip({
      name: tripName,
      userId: userId,
      legs: legs
    });
    if (validationError) {
      setConfirmation(validationError);
      return;
    }
    try {
      const requestBody = {
        name: tripName,
        legs: legs.map((leg, index) => ({
          name: String(index + 1),
          ...leg,
          days: calculateDays(leg.arrivalDate, leg.departureDate)
        })),
        userId
      };
      const response = await fetch('http://localhost:5001/trips/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save trip');
      }
      const savedTrip = await response.json();
      setConfirmation(`Trip '${savedTrip.name}' saved successfully!`);
      fetchSavedTrips();
    } catch (error) {
      console.error('Error saving trip:', error);
      setConfirmation('Error saving trip. Please try again.');
    }
  };

  useEffect(() => {
    fetchSavedTrips();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Create Trip</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Trip Name"
            value={tripName}
            onChange={handleTripNameChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="UserID"
            value={userId}
            onChange={handleUserIdChange}
            fullWidth
          />
        </Grid>
      </Grid>
      {legs.map((leg, index) => (
        <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={2}>
              <Typography variant="h6">Leg {index + 1}</Typography>
            </Grid>
            <Grid item xs={12} sm={10}>
              <TextField
                label="City"
                value={leg.city}
                onChange={(e) => handleLegChange(index, 'city', e.target.value)}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                type="date"
                label="Arrive"
                value={leg.arrivalDate || ''}
                onChange={(e) => handleLegChange(index, 'arrivalDate', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                type="date"
                label="Depart"
                value={leg.departureDate || ''}
                onChange={(e) => handleLegChange(index, 'departureDate', e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Days"
                value={calculateDays(leg.arrivalDate, leg.departureDate)}
                fullWidth
                disabled
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Box sx={{ mt: 2 }}>
        <Button variant="contained" onClick={addLeg}>Add Leg</Button>
        <Button variant="contained" onClick={handleSaveTrip} sx={{ ml: 2 }}>Save Trip</Button>
      </Box>
      {confirmation && (
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography color="success.main">{confirmation}</Typography>
        </Box>
      )}
      {savedTrips.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Saved Trips</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Trip Name</TableCell>
                <TableCell>Earliest Arrival Date</TableCell>
                <TableCell>Latest Departure Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {savedTrips.map(trip => {
                const summary = getTripSummary(trip);
                return (
                  <TableRow key={trip._id}>
                    <TableCell>{summary.name}</TableCell>
                    <TableCell>{summary.earliestArrival}</TableCell>
                    <TableCell>{summary.latestDeparture}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      )}
      {savedTrips.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Saved Trips Details</Typography>
          {savedTrips.map(trip => (
            <Box key={trip._id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
              <Typography variant="h6">{trip.name}</Typography>
              {trip.legs.map((leg, index) => (
                <Box key={index} sx={{ mt: 1 }}>
                  <Typography>Leg {index + 1}: {leg.name}</Typography>
                  <Typography>City: {leg.city}</Typography>
                  <Typography>Arrival: {formatDate(leg.arrivalDate)}</Typography>
                  <Typography>Departure: {formatDate(leg.departureDate)}</Typography>
                  <Typography>Days: {leg.days}</Typography>
                </Box>
              ))}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Home;
