import { Box, Typography } from '@mui/material';

export default function CxOverview() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        CX Overview
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Manage your CX issues
      </Typography>
    </Box>
  );
}
