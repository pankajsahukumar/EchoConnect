import React, { useState } from 'react';
import BaseTrigger from './BaseTrigger';
import TableChartIcon from '@mui/icons-material/TableChart';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

/**
 * OnNewRowGoogleSheet component for rendering the On New Row Google Sheet trigger
 * @param {Object} props - Component props
 * @param {Object} props.data - The trigger data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The On New Row Google Sheet trigger component
 */
const OnNewRowGoogleSheet = ({ data, nodeId }) => {
  // Mock Google Sheets for demonstration
  const [sheets, setSheets] = useState([
    { id: '1', name: 'Customer Data', connected: false },
    { id: '2', name: 'Lead Information', connected: false },
    { id: '3', name: 'Order Tracking', connected: false },
  ]);
  
  const [selectedSheet, setSelectedSheet] = useState('');

  // Handle sheet selection
  const handleSheetChange = (event) => {
    setSelectedSheet(event.target.value);
  };

  // Handle connect button click
  const handleConnect = () => {
    // In a real implementation, this would initiate the Google Sheets API connection
    console.log(`Connecting to sheet: ${selectedSheet}`);
  };

  return (
    <BaseTrigger
      data={data}
      nodeId={nodeId}
      title="On New Row Google Sheet"
      icon={<TableChartIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          This trigger activates when a new row is added to a Google Sheet.
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Google Sheet</InputLabel>
          <Select
            value={selectedSheet}
            onChange={handleSheetChange}
            label="Select Google Sheet"
          >
            {sheets.map((sheet) => (
              <MenuItem key={sheet.id} value={sheet.id}>
                {sheet.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box mt={2} display="flex" justifyContent="flex-end">
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleConnect}
            disabled={!selectedSheet}
          >
            Connect Sheet
          </Button>
        </Box>
        
        <Typography variant="caption" color="textSecondary" display="block" mt={1}>
          Note: You need to have edit access to the Google Sheet to set up this trigger.
        </Typography>
      </Box>
    </BaseTrigger>
  );
};

export default OnNewRowGoogleSheet;