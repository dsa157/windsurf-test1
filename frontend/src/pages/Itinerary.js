import React from 'react';
import { Container, Typography, List, ListItem, ListItemText } from '@mui/material';

const Itinerary = () => {
  // TODO: Fetch itinerary data from backend
  const itinerary = [
    { city: 'New York', date: '2025-04-01', activities: ['Statue of Liberty', 'Central Park'] },
    { city: 'Paris', date: '2025-04-05', activities: ['Eiffel Tower', 'Louvre Museum'] },
  ];

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Your Itinerary
      </Typography>
      <List>
        {itinerary.map((item, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={`${item.city} - ${item.date}`}
              secondary={item.activities.join(', ')}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Itinerary;
