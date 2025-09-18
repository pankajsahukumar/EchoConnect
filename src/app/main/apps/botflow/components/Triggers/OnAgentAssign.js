import React from 'react';
import BaseTrigger from './BaseTrigger';
import PersonIcon from '@mui/icons-material/Person';
import { Typography, Box } from '@mui/material';

/**
 * OnAgentAssign component for rendering the On Agent Assign trigger
 * @param {Object} props - Component props
 * @param {Object} props.data - The trigger data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The On Agent Assign trigger component
 */
const OnAgentAssign = ({ data, nodeId }) => {
  // Extract variables from the data
  const components = data?.components || [];
  const variables = components.length > 0 ? components[0]?.componentVariablesV2 || [] : [];
  
  return (
    <BaseTrigger
      data={data}
      nodeId={nodeId}
      title="On Agent Assign"
      icon={<PersonIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          This trigger activates when a conversation is assigned to an agent.
        </Typography>
        
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Available Variables:
          </Typography>
          <Box p={1} bgcolor="background.default" borderRadius={1}>
            {variables.map((variable) => (
              <Typography key={variable.id} variant="caption" display="block">
                <strong>{variable.key}</strong>: {variable.value || 'Available at runtime'}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>
    </BaseTrigger>
  );
};

export default OnAgentAssign;