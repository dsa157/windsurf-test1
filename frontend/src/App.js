import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { TextField, Button, Box, Typography, Grid, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [tripName, setTripName] = useState('');
  const [legs, setLegs] = useState([
    { city: '', arrivalDate: '', departureDate: '' }
  ]);
  const [confirmation, setConfirmation] = useState('');
  const [savedTrips, setSavedTrips] = useState([]);
  const [userId, setUserId] = useState('');

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
    try {
      const requestBody = {
        name: tripName,
        legs: legs.map((leg, index) => ({
          name: String(index + 1), // Use leg index as name
          ...leg,
          days: calculateDays(leg.arrivalDate, leg.departureDate)
        })),
        userId
      };
      console.log('Request Body:', requestBody);
      const response = await fetch('http://localhost:5001/trips/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      console.log('Response Status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error saving trip:', errorData);
        throw new Error(errorData.message || 'Failed to save trip');
      }
      const savedTrip = await response.json();
      console.log('Saved Trip:', savedTrip);
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
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Create Trip</Typography>
          <TextField
            label="Trip Name"
            value={tripName}
            onChange={handleTripNameChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="UserID"
            value={userId}
            onChange={handleUserIdChange}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Leg</TableCell>
                <TableCell>City Name</TableCell>
                <TableCell>Arrival Date</TableCell>
                <TableCell>Departure Date</TableCell>
                <TableCell>Total Days</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {legs.map((leg, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <TextField
                      value={leg.city}
                      onChange={(e) => handleLegChange(index, 'city', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="date"
                      value={leg.arrivalDate}
                      onChange={(e) => handleLegChange(index, 'arrivalDate', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="date"
                      value={leg.departureDate}
                      onChange={(e) => handleLegChange(index, 'departureDate', e.target.value)}
                      fullWidth
                    />
                  </TableCell>
                  <TableCell>
                    {calculateDays(leg.arrivalDate, leg.departureDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ mt: 2 }}>
            <Button variant="contained" onClick={addLeg}>
              Add City
            </Button>
            <Button variant="contained" onClick={handleSaveTrip} sx={{ ml: 2 }}>
              Save Trip
            </Button>
          </Box>
          {confirmation && (
            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography color="success.main">{confirmation}</Typography>
            </Box>
          )}
          {savedTrips.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h5" gutterBottom>Saved Trips</Typography>
              {savedTrips.map(trip => (
                <Box key={trip._id} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="h6">{trip.name}</Typography>
                  {trip.legs.map((leg, index) => (
                    <Box key={index} sx={{ mt: 1 }}>
                      <Typography>Leg {index + 1}: {leg.name}</Typography>
                      <Typography>City: {leg.city}</Typography>
                      <Typography>Arrival: {new Date(leg.arrivalDate).toLocaleDateString()}</Typography>
                      <Typography>Departure: {new Date(leg.departureDate).toLocaleDateString()}</Typography>
                      <Typography>Days: {leg.days}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          )}
        </Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
