import React, { useState } from 'react';
import BaseAction from './BaseAction';
import MessageIcon from '@mui/icons-material/Message';
import { 
  Typography, 
  Box, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Divider,
  IconButton,
  Card,
  CardContent
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

/**
 * SendInteractiveMessage component for rendering the Send Interactive Message action
 * @param {Object} props - Component props
 * @param {Object} props.data - The action data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The Send Interactive Message action component
 */
const SendInteractiveMessage = ({ data, nodeId }) => {
  const [messageType, setMessageType] = useState('text');
  const [messageText, setMessageText] = useState('');
  const [buttons, setButtons] = useState([
    { id: 1, text: 'Yes', value: 'yes' },
    { id: 2, text: 'No', value: 'no' }
  ]);

  // Handle message type change
  const handleMessageTypeChange = (event) => {
    setMessageType(event.target.value);
  };

  // Handle message text change
  const handleMessageTextChange = (event) => {
    setMessageText(event.target.value);
  };

  // Handle button text change
  const handleButtonTextChange = (id, event) => {
    setButtons(buttons.map(button => 
      button.id === id ? { ...button, text: event.target.value } : button
    ));
  };

  // Handle button value change
  const handleButtonValueChange = (id, event) => {
    setButtons(buttons.map(button => 
      button.id === id ? { ...button, value: event.target.value } : button
    ));
  };

  // Add new button
  const addButton = () => {
    const newId = Math.max(...buttons.map(b => b.id), 0) + 1;
    setButtons([...buttons, { id: newId, text: '', value: '' }]);
  };

  // Remove button
  const removeButton = (id) => {
    setButtons(buttons.filter(button => button.id !== id));
  };

  return (
    <BaseAction
      data={data}
      nodeId={nodeId}
      title="Send Interactive Message"
      icon={<MessageIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Send an interactive message to the user with buttons or other interactive elements.
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Message Type</InputLabel>
          <Select
            value={messageType}
            onChange={handleMessageTypeChange}
            label="Message Type"
          >
            <MenuItem value="text">Text with Buttons</MenuItem>
            <MenuItem value="list">List</MenuItem>
            <MenuItem value="template">Template</MenuItem>
          </Select>
        </FormControl>
        
        <TextField
          fullWidth
          margin="normal"
          label="Message Text"
          variant="outlined"
          multiline
          rows={4}
          value={messageText}
          onChange={handleMessageTextChange}
          placeholder="Enter your message text here"
        />
        
        <Divider sx={{ my: 2 }} />
        
        <Box mb={2}>
          <Typography variant="subtitle1" gutterBottom>
            Buttons
          </Typography>
          
          {buttons.map((button) => (
            <Card key={button.id} variant="outlined" sx={{ mb: 2 }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2">Button {button.id}</Typography>
                  <IconButton 
                    size="small" 
                    color="error" 
                    onClick={() => removeButton(button.id)}
                    disabled={buttons.length <= 1}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="Button Text"
                  variant="outlined"
                  value={button.text}
                  onChange={(e) => handleButtonTextChange(button.id, e)}
                  placeholder="Text displayed on button"
                />
                
                <TextField
                  fullWidth
                  margin="normal"
                  label="Button Value"
                  variant="outlined"
                  value={button.value}
                  onChange={(e) => handleButtonValueChange(button.id, e)}
                  placeholder="Value returned when clicked"
                />
              </CardContent>
            </Card>
          ))}
          
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={addButton}
            disabled={buttons.length >= 3}
            fullWidth
          >
            Add Button
          </Button>
          
          {buttons.length >= 3 && (
            <Typography variant="caption" color="error">
              Maximum of 3 buttons allowed for WhatsApp interactive messages.
            </Typography>
          )}
        </Box>
      </Box>
    </BaseAction>
  );
};

export default SendInteractiveMessage;