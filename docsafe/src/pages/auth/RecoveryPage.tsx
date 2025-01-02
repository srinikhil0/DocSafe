import { Box, Container, Typography, Paper } from '@mui/material';

const RecoveryPage = () => {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Account Recovery
          </Typography>
          <Typography variant="body1">
            Follow the steps to recover your account access.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default RecoveryPage; 