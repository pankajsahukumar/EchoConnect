import { Box, Typography } from '@mui/material';

export default function WhatsappWidgets() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        WhatsApp Widgets
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage your WhatsApp widget settings
      </Typography>
    </Box>
  );
}
