import React from 'react';
import { Typography, Box } from '@mui/material';

const About = () => (
  <Box sx={{ p: 3 }}>
    <Typography variant="h4" gutterBottom>About Page</Typography>
    <Typography variant="body1">
      This is the about page content.
    </Typography>
  </Box>
);

export default About;
