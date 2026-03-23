import React, { useState } from 'react';
import BaseAction from './BaseAction';
import PersonIcon from '@mui/icons-material/Person';
import { Typography, Box, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';

/**
 * AssignAgent component for rendering the Assign Agent action
 * @param {Object} props - Component props
 * @param {Object} props.data - The action data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The Assign Agent action component
 */
const AssignAgent = ({ data, nodeId }) => {
  // Mock agents for demonstration
  const [agents, setAgents] = useState([
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com' },
  ]);
  
  const [selectedAgent, setSelectedAgent] = useState('');

  // Handle agent selection
  const handleAgentChange = (event) => {
    setSelectedAgent(event.target.value);
  };

  return (
    <BaseAction
      data={data}
      nodeId={nodeId}
      title="Assign Agent"
      icon={<PersonIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Assign a specific agent to handle this conversation
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Agent</InputLabel>
          <Select
            value={selectedAgent}
            onChange={handleAgentChange}
            label="Select Agent"
          >
            {agents.map((agent) => (
              <MenuItem key={agent.id} value={agent.id}>
                {agent.name} ({agent.email})
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            The selected agent will be notified and assigned to this conversation
          </FormHelperText>
        </FormControl>
      </Box>
    </BaseAction>
  );
};

export default AssignAgent;