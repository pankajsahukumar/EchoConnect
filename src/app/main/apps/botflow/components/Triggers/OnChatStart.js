import React from 'react';
import BaseTrigger from './BaseTrigger';
import MessageIcon from '@mui/icons-material/Message';
import { Typography, Box } from '@mui/material';

/**
 * OnChatStart component for rendering the On Chat Start trigger
 * @param {Object} props - Component props
 * @param {Object} props.data - The trigger data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The On Chat Start trigger component
 */
const OnChatStart = ({ data, nodeId }) => {
  return (
    <BaseTrigger
      data={data}
      nodeId={nodeId}
      title="On Chat Start"
      icon={<MessageIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary">
          This trigger activates when a user starts a new chat conversation.
        </Typography>
      </Box>
    </BaseTrigger>
  );
};

export default OnChatStart;