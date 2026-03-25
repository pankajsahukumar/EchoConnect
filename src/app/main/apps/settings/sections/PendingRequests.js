import { Box, Typography } from '@mui/material';

export default function PendingRequests() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Pending requests
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage your pending requests
      </Typography>
    </Box>
  );
}
