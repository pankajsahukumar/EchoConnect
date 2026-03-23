import React from 'react';
import BaseTrigger from './BaseTrigger';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Typography, Box, TextField } from '@mui/material';

/**
 * OnAbandonedCart component for rendering the On Abandoned Cart in WooCommerce trigger
 * @param {Object} props - Component props
 * @param {Object} props.data - The trigger data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The On Abandoned Cart trigger component
 */
const OnAbandonedCart = ({ data, nodeId }) => {
  // Extract variables from the data
  const components = data?.components || [];
  const variables = components.length > 0 ? components[0]?.componentVariablesV2 || [] : [];
  const elements = components.length > 0 ? components[0]?.elements || [] : [];
  
  // Find the timer element if it exists
  const timerElement = elements.find(element => element.elementType === 'TIMER');
  
  return (
    <BaseTrigger
      data={data}
      nodeId={nodeId}
      title="On Abandoned Cart"
      icon={<ShoppingCartIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          This trigger activates when a customer abandons their cart in WooCommerce.
        </Typography>
        
        {timerElement && (
          <Box mt={2}>
            <TextField
              fullWidth
              label="Send after delay of"
              variant="outlined"
              type="number"
              defaultValue="60"
              InputProps={{
                endAdornment: <Typography variant="body2">minutes</Typography>,
              }}
            />
          </Box>
        )}
        
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

export default OnAbandonedCart;