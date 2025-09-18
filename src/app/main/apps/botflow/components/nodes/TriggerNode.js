import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';

const NodeContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  minWidth: 180,
  boxShadow: theme.shadows[3],
  border: `2px solid ${theme.palette.success.main}`,
  '& .node-header': {
    backgroundColor: theme.palette.success.main,
    color: theme.palette.success.contrastText,
    padding: theme.spacing(1),
    borderRadius: `${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0 0`,
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    marginTop: theme.spacing(-2),
  },
  '& .node-content': {
    padding: theme.spacing(1, 0),
  },
}));

// Variable button component
const VariableButton = ({ onClick }) => (
  <IconButton size="small" onClick={onClick} sx={{ ml: 1 }}>
    <Typography variant="caption" sx={{ border: '1px dashed grey', borderRadius: 1, px: 0.5 }}>{'{}'}</Typography>
  </IconButton>
);

// Variable selector component
const VariableSelector = ({ open, anchorEl, onClose, onSelectVariable }) => {
  // Predefined variables
  const variables = [
    { value: 'name', title: 'Customer Attributes (name)', variableValue: 'global::name' },
    { value: 'Tracking Code', title: 'Customer Attributes (Tracking Code)', variableValue: 'global::Tracking Code' },
    { value: 'email', title: 'Customer Attributes (email)', variableValue: 'global::email' },
    { value: 'phone', title: 'Customer Attributes (phone)', variableValue: 'global::phone' }
  ];

  return (
    <Paper
      sx={{
        display: open ? 'block' : 'none',
        position: 'absolute',
        zIndex: 1300,
        width: 250,
        maxHeight: 300,
        overflow: 'auto',
        mt: 1,
        p: 1,
        left: anchorEl ? anchorEl.getBoundingClientRect().left : 0,
        top: anchorEl ? anchorEl.getBoundingClientRect().bottom : 0,
      }}
    >
      {variables.map((variable) => (
        <Box 
          key={variable.value}
          sx={{ 
            p: 1, 
            cursor: 'pointer',
            '&:hover': { bgcolor: 'action.hover' },
            borderRadius: 1
          }}
          onClick={() => {
            onSelectVariable(variable);
            onClose();
          }}
        >
          <Typography variant="body2">{variable.title}</Typography>
        </Box>
      ))}
    </Paper>
  );
};

export function TriggerNode({ data, isConnectable, selected, id }) {
  const [keywords, setKeywords] = useState(data.keywords || []);
  const [newKeyword, setNewKeyword] = useState('');
  
  // Variable selector state
  const [variableSelectorOpen, setVariableSelectorOpen] = useState(false);
  const [variableSelectorAnchorEl, setVariableSelectorAnchorEl] = useState(null);

  const handleAddKeyword = () => {
    if (newKeyword.trim() !== '') {
      const updatedKeywords = [...keywords, { text: newKeyword, partialMatch: false }];
      setKeywords(updatedKeywords);
      setNewKeyword('');
      
      // Update node data
      if (data.onDataChange) {
        data.onDataChange({ ...data, keywords: updatedKeywords });
      }
    }
  };

  const handleRemoveKeyword = (index) => {
    const updatedKeywords = keywords.filter((_, i) => i !== index);
    setKeywords(updatedKeywords);
    
    // Update node data
    if (data.onDataChange) {
      data.onDataChange({ ...data, keywords: updatedKeywords });
    }
  };

  const handlePartialMatchChange = (index, checked) => {
    const updatedKeywords = keywords.map((keyword, i) => 
      i === index ? { ...keyword, partialMatch: checked } : keyword
    );
    setKeywords(updatedKeywords);
    
    // Update node data
    if (data.onDataChange) {
      data.onDataChange({ ...data, keywords: updatedKeywords });
    }
  };
  
  // Variable selector handlers
  const handleOpenVariableSelector = (event) => {
    setVariableSelectorAnchorEl(event.currentTarget);
    setVariableSelectorOpen(true);
  };
  
  const handleCloseVariableSelector = () => {
    setVariableSelectorOpen(false);
    setVariableSelectorAnchorEl(null);
  };
  
  const handleSelectVariable = (variable) => {
    // Format: [[{"value":"name","title":"Customer Attributes (name)","variableValue":"global::name"}]]
    const variableString = `[[{"value":"${variable.value}","title":"${variable.title}","variableValue":"${variable.variableValue}"}]]`;
    setNewKeyword(variableString);
  };

  // Function to handle duplication
  const handleDuplicate = (event) => {
    event.stopPropagation();
    if (data.duplicateNode) {
      data.duplicateNode();
    }
  };
  
  return (
    <NodeContainer className="trigger-node">
      <div className="node-header">
        <Typography variant="subtitle1">{data.label || 'onChat Start'}</Typography>
        <div style={{ position: 'absolute', top: 5, right: 5 }}>
          <Tooltip title="Duplicate">
            <IconButton size="small" onClick={handleDuplicate}>
              <ContentCopyIcon fontSize="small" sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="node-content">
        <Typography variant="body2" gutterBottom>Keywords:</Typography>
        
        {keywords.map((keyword, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField 
              size="small" 
              value={keyword.text} 
              disabled 
              fullWidth 
              sx={{ mr: 1 }}
            />
            <FormControlLabel
              control={
                <Checkbox 
                  size="small" 
                  checked={keyword.partialMatch} 
                  onChange={(e) => handlePartialMatchChange(index, e.target.checked)}
                />
              }
              label="Partially match"
              sx={{ ml: 0, fontSize: '0.75rem' }}
            />
            <IconButton size="small" onClick={() => handleRemoveKeyword(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <TextField 
            size="small" 
            placeholder="Add keyword" 
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            fullWidth
            sx={{ mr: 1 }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddKeyword();
                e.preventDefault();
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <VariableButton onClick={handleOpenVariableSelector}/>
                </InputAdornment>
              ),
            }}
          />
          <Button 
            size="small" 
            variant="outlined" 
            startIcon={<AddIcon />}
            onClick={handleAddKeyword}
          >
            Add
          </Button>
        </Box>
        
        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={<Checkbox size="small" />}
            label="When this trigger occurs, initiate a fresh start of the user journey"
          />
        </Box>
      </div>
      <Handle type="source" position={Position.Bottom} id="source" isConnectable={isConnectable} />
      
      {/* Variable Selector */}
      <VariableSelector
        open={variableSelectorOpen}
        anchorEl={variableSelectorAnchorEl}
        onClose={handleCloseVariableSelector}
        onSelectVariable={handleSelectVariable}
      />
    </NodeContainer>
  );
}