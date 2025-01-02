import { Box, Container, Typography } from '@mui/material';

const DashboardPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1">
          Welcome to your secure document dashboard. Here you can manage your documents and verification status.
        </Typography>
      </Box>
    </Container>
  );
};

export default DashboardPage; 