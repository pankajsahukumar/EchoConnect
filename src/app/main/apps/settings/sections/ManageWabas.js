import { Box, Typography } from '@mui/material';

export default function ManageWabas() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Manage WABAs
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Edit your WABA profile and manage assignees
      </Typography>
    </Box>
  );
}
