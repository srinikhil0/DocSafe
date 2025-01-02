import { Box, Container, Typography } from '@mui/material';

const DocumentsPage = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Documents
        </Typography>
        <Typography variant="body1">
          Here you can view and manage your secure documents.
        </Typography>
      </Box>
    </Container>
  );
};

export default DocumentsPage; 