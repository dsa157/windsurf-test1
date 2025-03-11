import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';

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

  const handleSaveTrip = async () => {
    try {
      const userId = localStorage.getItem('userId'); // Assuming user ID is stored in localStorage
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
        <div style={{ padding: '20px' }}>
          <h2>Save Your Trip</h2>
          <input
            type="text"
            placeholder="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
          />
          <button onClick={handleSaveTrip}>Save Trip</button>
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/itinerary" element={<Itinerary />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
