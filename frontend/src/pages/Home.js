import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Grid } from '@mui/material';

const Home = () => {
  const [cities, setCities] = useState(['', '']);

  const handleCityChange = (index, value) => {
    const newCities = [...cities];
    newCities[index] = value;
    setCities(newCities);
  };

  const handleAddCity = () => {
    setCities([...cities, '']);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Multi-City Travel Planner
      </Typography>
      <Grid container spacing={2}>
        {cities.map((city, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              fullWidth
              label={`City ${index + 1}`}
              value={city}
              onChange={(e) => handleCityChange(index, e.target.value)}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" onClick={handleAddCity}>
            Add Another City
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Home;
