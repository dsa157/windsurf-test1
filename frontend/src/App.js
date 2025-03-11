import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { TextField, Button, Box, Typography } from '@mui/material';

import Home from './pages/Home';
import Itinerary from './pages/Itinerary';
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
  const [cities, setCities] = useState([]);
  const [newCity, setNewCity] = useState({
    name: '',
    arrivalDate: '',
    departureDate: '',
    days: 0
  });
  const [dateError, setDateError] = useState(false);

  const isValidDate = (dateString) => {
    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d\d$/;
    if (!regex.test(dateString)) return false;
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const calculateDays = (arrival, departure) => {
    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);
    const timeDiff = departureDate.getTime() - arrivalDate.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleAddCity = () => {
    if (!isValidDate(newCity.arrivalDate) || !isValidDate(newCity.departureDate)) {
      setDateError(true);
      return;
    }
    setDateError(false);
    const arrival = new Date(newCity.arrivalDate);
    const departure = new Date(newCity.departureDate);
    if (departure > arrival) {
      const days = calculateDays(newCity.arrivalDate, newCity.departureDate);
      setCities([...cities, { ...newCity, days }]);
      setNewCity({
        name: '',
        arrivalDate: '',
        departureDate: '',
        days: 0
      });
    }
  };

  const handleSaveTrip = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post('http://localhost:5001/api/itineraries/save', {
        name: tripName,
        cities,
        userId
      });
      alert('Trip saved successfully!');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Save Your Trip</Typography>
          <TextField
            label="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Box sx={{ mb: 2 }}>
            <TextField
              label="City Name"
              value={newCity.name}
              onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Arrival Date"
              value={newCity.arrivalDate}
              onChange={(e) => setNewCity({ ...newCity, arrivalDate: e.target.value })}
              placeholder="MM/DD/YYYY"
              fullWidth
              sx={{ mb: 2 }}
              error={dateError && !isValidDate(newCity.arrivalDate)}
              helperText={dateError && !isValidDate(newCity.arrivalDate) ? 'Invalid date format' : ''}
            />
            <TextField
              label="Departure Date"
              value={newCity.departureDate}
              onChange={(e) => setNewCity({ ...newCity, departureDate: e.target.value })}
              placeholder="MM/DD/YYYY"
              fullWidth
              sx={{ mb: 2 }}
              error={dateError && !isValidDate(newCity.departureDate)}
              helperText={dateError && !isValidDate(newCity.departureDate) ? 'Invalid date format' : ''}
            />
            <Button variant="contained" onClick={handleAddCity} disabled={!newCity.name || !newCity.arrivalDate || !newCity.departureDate}>
              Add City
            </Button>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Cities:</Typography>
            {cities.map((city, index) => (
              <Box key={index} sx={{ mb: 1 }}>
                <Typography>{city.name} ({city.days} days)</Typography>
              </Box>
            ))}
          </Box>
          <Button variant="contained" onClick={handleSaveTrip} disabled={!tripName || cities.length === 0}>
            Save Trip
          </Button>
        </Box>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/itinerary" element={<Itinerary />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
