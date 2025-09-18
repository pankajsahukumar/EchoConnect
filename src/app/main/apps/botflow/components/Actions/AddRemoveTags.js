import React, { useState } from 'react';
import BaseAction from './BaseAction';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { Typography, Box, RadioGroup, FormControlLabel, Radio, Chip, TextField, Button } from '@mui/material';

/**
 * AddRemoveTags component for rendering the Add/Remove Tags action
 * @param {Object} props - Component props
 * @param {Object} props.data - The action data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @returns {React.ReactElement} The Add/Remove Tags action component
 */
const AddRemoveTags = ({ data, nodeId }) => {
  const [actionType, setActionType] = useState('SET_TAG');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  // Handle action type change
  const handleActionTypeChange = (event) => {
    setActionType(event.target.value);
  };

  // Handle adding a new tag
  const handleAddTag = () => {
    if (tagInput.trim() && !selectedTags.includes(tagInput.trim())) {
      setSelectedTags([...selectedTags, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Handle removing a tag
  const handleDeleteTag = (tagToDelete) => {
    setSelectedTags(selectedTags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <BaseAction
      data={data}
      nodeId={nodeId}
      title="Add/Remove Tags"
      icon={<LocalOfferIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          {actionType === 'SET_TAG' ? 'Add tags to the contact' : 'Remove tags from the contact'}
        </Typography>
        
        <RadioGroup
          value={actionType}
          onChange={handleActionTypeChange}
          row
        >
          <FormControlLabel value="SET_TAG" control={<Radio />} label="Add Tags" />
          <FormControlLabel value="REMOVE_TAG" control={<Radio />} label="Remove Tags" />
        </RadioGroup>
        
        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Selected Tags:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
            {selectedTags.length > 0 ? (
              selectedTags.map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  onDelete={() => handleDeleteTag(tag)}
                  color="primary"
                  variant="outlined"
                />
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No tags selected
              </Typography>
            )}
          </Box>
          
          <Box display="flex" gap={1}>
            <TextField
              size="small"
              label="Add a tag"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
              fullWidth
            />
            <Button variant="contained" color="primary" onClick={handleAddTag}>
              Add
            </Button>
          </Box>
        </Box>
      </Box>
    </BaseAction>
  );
};

export default AddRemoveTags;