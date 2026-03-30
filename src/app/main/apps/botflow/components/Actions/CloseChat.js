import React from 'react';
import BaseAction from './BaseAction';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Typography, Box } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';

const CloseChat = ({ data, nodeId }) => {
  return (
    <BaseAction
      data={data}
      nodeId={nodeId}
      title="Close Chat"
      icon={<ExitToAppIcon />}
    >
      <Box mb={2}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          p={2}
          bgcolor="action.hover"
          borderRadius={1}
        >
          <ChatIcon color="action" fontSize="large" sx={{ mb: 1 }} />
          <Typography variant="body2" color="textSecondary" textAlign="center">
            This action will close the current conversation. The chat will be marked as resolved.
          </Typography>
        </Box>
      </Box>
    </BaseAction>
  );
};

export default CloseChat;
