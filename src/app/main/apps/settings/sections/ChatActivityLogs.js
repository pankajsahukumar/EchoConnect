import { Box, Typography } from '@mui/material';

export default function ChatActivityLogs() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Chat activity logs
      </Typography>
      <Typography variant="body2" color="text.secondary">
        See each bot and user activities in chat window
      </Typography>
    </Box>
  );
}
