import React from 'react';
import { AppBar, Toolbar, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <AppBar position="fixed" sx={{ top: 'auto', bottom: 0, bgcolor: 'primary.main' }}>
      <Toolbar>
        <Typography variant="body2" sx={{ flexGrow: 1, color: 'common.white' }}>
          2025 Trip Manager
        </Typography>
        <Link href="/about" color="common.white" sx={{ mx: 2, textDecoration: 'none', '&:hover': { color: 'secondary.main' }, typography: 'body2' }}>
          About
        </Link>
        <Link href="/contact" color="common.white" sx={{ textDecoration: 'none', '&:hover': { color: 'secondary.main' }, typography: 'body2' }}>
          Contact
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Footer;
