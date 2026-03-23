import React, { useState } from 'react';
import BaseAction from './BaseAction';
import ChatIcon from '@mui/icons-material/Chat';
import { 
  Typography, 
  Box, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Chip,
  Button,
  IconButton
} from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import VariableIcon from '@mui/icons-material/Code';

/**
 * SendMessage component for rendering the Send Message action
 * @param {Object} props - Component props
 * @param {Object} props.data - The action data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The Send Message action component
 */
const SendMessage = ({ data, nodeId }) => {
  const [messageType, setMessageType] = useState('text');
  const [messageText, setMessageText] = useState('');
  const [variables, setVariables] = useState([
    { id: 1, name: 'customer_name', value: '{{customer.name}}' },
    { id: 2, name: 'order_number', value: '{{order.number}}' },
    { id: 3, name: 'agent_name', value: '{{agent.name}}' }
  ]);

  // Handle message type change
  const handleMessageTypeChange = (event) => {
    setMessageType(event.target.value);
  };

  // Handle message text change
  const handleMessageTextChange = (event) => {
    setMessageText(event.target.value);
  };

  // Insert variable into message text
  const insertVariable = (variable) => {
    setMessageText(prev => prev + ' ' + variable.value + ' ');
  };

  return (
    <BaseAction
      data={data}
      nodeId={nodeId}
      title="Send Message"
      icon={<ChatIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Send a message to the user with text, media, or other content.
        </Typography>
        
        <FormControl fullWidth margin="normal">
          <InputLabel>Message Type</InputLabel>
          <Select
            value={messageType}
            onChange={handleMessageTypeChange}
            label="Message Type"
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="document">Document</MenuItem>
            <MenuItem value="audio">Audio</MenuItem>
          </Select>
        </FormControl>
        
        {messageType === 'text' ? (
          <Box>
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
            
            <Box display="flex" justifyContent="space-between" mt={1}>
              <Box>
                <IconButton size="small" color="primary">
                  <InsertEmoticonIcon />
                </IconButton>
                <IconButton size="small" color="primary">
                  <VariableIcon />
                </IconButton>
              </Box>
              <Typography variant="caption" color="textSecondary">
                {messageText.length}/1000 characters
              </Typography>
            </Box>
            
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Available Variables:
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {variables.map((variable) => (
                  <Chip 
                    key={variable.id} 
                    label={variable.name} 
                    onClick={() => insertVariable(variable)} 
                    color="primary" 
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          </Box>
        ) : (
          <Box mt={2} border="1px dashed #ccc" borderRadius={1} p={3} textAlign="center">
            <AttachFileIcon color="action" fontSize="large" />
            <Typography variant="body2" gutterBottom>
              {messageType === 'image' && 'Upload an image file (JPG, PNG, GIF)'}
              {messageType === 'video' && 'Upload a video file (MP4, MOV)'}
              {messageType === 'document' && 'Upload a document (PDF, DOC, XLSX)'}
              {messageType === 'audio' && 'Upload an audio file (MP3, WAV)'}
            </Typography>
            <Button variant="contained" color="primary" size="small" sx={{ mt: 1 }}>
              Upload {messageType}
            </Button>
          </Box>
        )}
      </Box>
    </BaseAction>
  );
};

export default SendMessage;