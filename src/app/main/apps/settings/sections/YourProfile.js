import { Box, Typography } from '@mui/material';

export default function YourProfile() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Your profile
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Edit your personal details
      </Typography>
    </Box>
  );
}
