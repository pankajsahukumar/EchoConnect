import React, { useState } from 'react';
import BaseTrigger from './BaseTrigger';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, TextField } from '@mui/material';

/**
 * OnAttributeChanged component for rendering the On Attribute Changed trigger
 * @param {Object} props - Component props
 * @param {Object} props.data - The trigger data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The On Attribute Changed trigger component
 */
const OnAttributeChanged = ({ data, nodeId }) => {
  // Mock attributes for demonstration
  const [attributes, setAttributes] = useState([
    { id: '1', name: 'First Name' },
    { id: '2', name: 'Last Name' },
    { id: '3', name: 'Email' },
    { id: '4', name: 'Phone' },
    { id: '5', name: 'Status' },
  ]);
  
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [attributeValue, setAttributeValue] = useState('');

  // Handle attribute selection
  const handleAttributeChange = (event) => {
    setSelectedAttribute(event.target.value);
  };

  // Handle attribute value change
  const handleAttributeValueChange = (event) => {
    setAttributeValue(event.target.value);
  };

  return (
    <BaseTrigger
      data={data}
      nodeId={nodeId}
      title="On Attribute Changed"
      icon={<EditAttributesIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          This trigger activates when a specific attribute is changed to a specific value.
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Attribute</InputLabel>
          <Select
            value={selectedAttribute}
            onChange={handleAttributeChange}
            label="Select Attribute"
          >
            {attributes.map((attribute) => (
              <MenuItem key={attribute.id} value={attribute.id}>
                {attribute.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          margin="normal"
          label="Attribute Value"
          variant="outlined"
          value={attributeValue}
          onChange={handleAttributeValueChange}
          placeholder="Enter the value to trigger on"
          helperText="Leave empty to trigger on any value change"
        />
      </Box>
    </BaseTrigger>
  );
};

export default OnAttributeChanged;