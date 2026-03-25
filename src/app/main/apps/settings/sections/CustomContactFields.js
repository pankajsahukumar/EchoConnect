import { Box, Typography } from '@mui/material';

export default function CustomContactFields() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Custom Contact Fields
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Setup custom fields for your customers
      </Typography>
    </Box>
  );
}
