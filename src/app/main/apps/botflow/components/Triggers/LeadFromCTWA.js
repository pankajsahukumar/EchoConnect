import React from 'react';
import BaseTrigger from './BaseTrigger';
import PersonIcon from '@mui/icons-material/Person';
import { Typography, Box } from '@mui/material';

/**
 * LeadFromCTWA component for rendering the Lead From CTWA trigger
 * @param {Object} props - Component props
 * @param {Object} props.data - The trigger data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The Lead From CTWA trigger component
 */
const LeadFromCTWA = ({ data, nodeId }) => {
  // Extract variables from the data
  const components = data?.components || [];
  const variables = components.length > 0 ? components[0]?.componentVariablesV2 || [] : [];

  return (
    <BaseTrigger
      data={data}
      nodeId={nodeId}
      title="Lead From CTWA"
      icon={<PersonIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary">
          This trigger activates when a lead comes from Click to WhatsApp ads. The following variables will be available:
        </Typography>
        <Box mt={1} p={1} bgcolor="background.default" borderRadius={1}>
          {variables.map((variable) => (
            <Typography key={variable.id} variant="caption" display="block">
              <strong>{variable.key}</strong>: {variable.value || 'Available at runtime'}
            </Typography>
          ))}
        </Box>
      </Box>
    </BaseTrigger>
  );
};

export default LeadFromCTWA;