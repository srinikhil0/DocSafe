import { Box, Container, Typography } from '@mui/material';

const ProfilePage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Profile
        </Typography>
        <Typography variant="body1">
          View and manage your profile information and verification status.
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage; 