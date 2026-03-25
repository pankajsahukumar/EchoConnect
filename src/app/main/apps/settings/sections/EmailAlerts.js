import { Box, Typography } from '@mui/material';

export default function EmailAlerts() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Email alerts
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Configure email alerts for your organisation
      </Typography>
    </Box>
  );
}
