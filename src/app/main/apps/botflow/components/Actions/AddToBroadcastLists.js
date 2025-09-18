import React, { useState } from 'react';
import BaseAction from './BaseAction';
import SendIcon from '@mui/icons-material/Send';
import { Typography, Box, Chip, TextField, Button, List, ListItem, ListItemText, Checkbox } from '@mui/material';

/**
 * AddToBroadcastLists component for rendering the Add to Broadcast Lists action
 * @param {Object} props - Component props
 * @param {Object} props.data - The action data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The Add to Broadcast Lists action component
 */
const AddToBroadcastLists = ({ data, nodeId }) => {
  // Mock broadcast lists for demonstration
  const [broadcastLists, setBroadcastLists] = useState([
    { id: '1', name: 'Marketing Updates', selected: false },
    { id: '2', name: 'Product Announcements', selected: false },
    { id: '3', name: 'Weekly Newsletter', selected: false },
  ]);

  // Handle list selection
  const handleListToggle = (listId) => {
    setBroadcastLists(broadcastLists.map(list => 
      list.id === listId ? { ...list, selected: !list.selected } : list
    ));
  };

  return (
    <BaseAction
      data={data}
      nodeId={nodeId}
      title="Add to Broadcast Lists"
      icon={<SendIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Add the contact to one or more broadcast lists
        </Typography>
        
        <List>
          {broadcastLists.map((list) => (
            <ListItem 
              key={list.id}
              dense
              button 
              onClick={() => handleListToggle(list.id)}
            >
              <Checkbox
                edge="start"
                checked={list.selected}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText primary={list.name} />
            </ListItem>
          ))}
        </List>
        
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Lists:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {broadcastLists.filter(list => list.selected).length > 0 ? (
              broadcastLists
                .filter(list => list.selected)
                .map((list) => (
                  <Chip
                    key={list.id}
                    label={list.name}
                    onDelete={() => handleListToggle(list.id)}
                    color="primary"
                    variant="outlined"
                  />
                ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No broadcast lists selected
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    </BaseAction>
  );
};

export default AddToBroadcastLists;