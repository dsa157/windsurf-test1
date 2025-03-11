import React, { useState } from 'react';
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

  const handleLegChange = (index, field, value) => {
    const updatedLegs = [...legs];
    updatedLegs[index][field] = value;
    if (field === 'departureDate' && index < legs.length - 1) {
      updatedLegs[index + 1].arrivalDate = value;
    }
    setLegs(updatedLegs);
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

  const handleSaveTrip = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch('http://localhost:5001/itineraries/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: tripName,
          legs: legs.map(leg => ({
            ...leg,
            days: calculateDays(leg.arrivalDate, leg.departureDate)
          })),
          userId
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save trip');
      }
      const savedTrip = await response.json();
      console.log('Trip saved:', savedTrip);
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Box sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>Create Trip</Typography>
          <TextField
            label="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
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
