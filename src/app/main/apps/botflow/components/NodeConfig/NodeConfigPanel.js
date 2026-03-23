import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

const ConfigPanel = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  right: 0,
  top: 0,
  width: 300,
  height: '100%',
  zIndex: 10,
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  boxShadow: theme.shadows[3],
  transition: 'transform 0.3s ease',
  transform: (props) => props.open ? 'translateX(0)' : 'translateX(100%)',
}));

const ConfigHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const ConfigContent = styled(Box)(({ theme }) => ({
  flexGrow: 1,
  overflowY: 'auto',
  '& > *': {
    marginBottom: theme.spacing(2),
  },
}));

const ConfigActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(2),
  '& > *': {
    marginLeft: theme.spacing(1),
  },
}));

// Configuration fields for different node types
const nodeConfigFields = {
  'trigger': {
    'on-chat-start': [
      { id: 'keywords', label: 'Keywords', type: 'text' },
      { id: 'partialMatch', label: 'Partial Match', type: 'select', options: ['Yes', 'No'] },
    ],
    'lead-from-ctwa': [
      { id: 'leadSource', label: 'Lead Source', type: 'select', options: ['Any', 'Website', 'Manual', 'API'] },
    ],
    'on-message': [
      { id: 'messageType', label: 'Message Type', type: 'select', options: ['Any', 'Text', 'Image', 'Document'] },
    ],
    'on-lead': [
      { id: 'leadSource', label: 'Lead Source', type: 'select', options: ['Any', 'Website', 'Manual', 'API'] },
    ],
    'on-first-daily-message': [],
    'on-lead-updated': [
      { id: 'fieldChanged', label: 'Field Changed', type: 'text' },
    ],
    'on-close-conversation': [],
    'on-open-conversation': [],
  },
  'action': {
    'add-remove-tag': [
      { id: 'mode', label: 'Action', type: 'select', options: ['add', 'remove'] },
      { id: 'tags', label: 'Tags', type: 'text' },
    ],
    'interactive-message': [
      { id: 'header', label: 'Header', type: 'text' },
      { id: 'body', label: 'Body', type: 'textarea' },
      { id: 'footer', label: 'Footer', type: 'text' },
      { id: 'listButton', label: 'List Button', type: 'text' },
    ],
    'send-message': [
      { id: 'messageText', label: 'Message Text', type: 'textarea' },
      { id: 'messageType', label: 'Message Type', type: 'select', options: ['Text', 'Template', 'Image'] },
    ],
    'add-tag': [
      { id: 'tagAction', label: 'Action', type: 'select', options: ['Add', 'Remove'] },
      { id: 'tagName', label: 'Tag Name', type: 'text' },
    ],
    'time-delay': [
      { id: 'delayAmount', label: 'Delay Amount', type: 'number' },
      { id: 'delayUnit', label: 'Delay Unit', type: 'select', options: ['Minutes', 'Hours', 'Days'] },
    ],
    'condition': [
      { id: 'conditionType', label: 'Condition Type', type: 'select', options: ['Contact Property', 'Message Content', 'Custom'] },
      { id: 'conditionValue', label: 'Condition Value', type: 'text' },
    ],
  },
};

export default function NodeConfigPanel({ open, onClose, selectedNode, onUpdateNodeData }) {
  const [nodeData, setNodeData] = useState({});

  useEffect(() => {
    if (selectedNode) {
      setNodeData(selectedNode.data || {});
    }
  }, [selectedNode]);

  const handleChange = (field, value) => {
    setNodeData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    if (selectedNode && onUpdateNodeData) {
      onUpdateNodeData(selectedNode.id, nodeData);
    }
    onClose();
  };

  const handleDelete = () => {
    if (selectedNode && onDeleteNode) {
      onDeleteNode(selectedNode.id);
    }
    onClose();
  };

  const renderConfigFields = () => {
    if (!selectedNode) return null;

    const nodeType = selectedNode.type; // 'trigger' or 'action'
    const nodeId = selectedNode.data?.id; // e.g., 'on-message', 'send-message'

    if (!nodeType || !nodeId || !nodeConfigFields[nodeType] || !nodeConfigFields[nodeType][nodeId]) {
      return (
        <Typography variant="body2" color="text.secondary">
          No configuration options available for this node.
        </Typography>
      );
    }

    const fields = nodeConfigFields[nodeType][nodeId];

    return fields.map((field) => {
      switch (field.type) {
        case 'text':
          return (
            <TextField
              key={field.id}
              fullWidth
              label={field.label}
              value={nodeData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              variant="outlined"
              size="small"
            />
          );
        case 'textarea':
          return (
            <TextField
              key={field.id}
              fullWidth
              label={field.label}
              value={nodeData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              variant="outlined"
              size="small"
              multiline
              rows={4}
            />
          );
        case 'number':
          return (
            <TextField
              key={field.id}
              fullWidth
              label={field.label}
              value={nodeData[field.id] || ''}
              onChange={(e) => handleChange(field.id, e.target.value)}
              variant="outlined"
              size="small"
              type="number"
            />
          );
        case 'select':
          return (
            <FormControl key={field.id} fullWidth size="small">
              <InputLabel id={`${field.id}-label`}>{field.label}</InputLabel>
              <Select
                labelId={`${field.id}-label`}
                value={nodeData[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                label={field.label}
              >
                {field.options.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          );
        default:
          return null;
      }
    });
  };

  return (
    <ConfigPanel open={open}>
      <ConfigHeader>
        <Typography variant="h6">
          {selectedNode ? `Configure ${selectedNode.data?.label}` : 'Node Configuration'}
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </ConfigHeader>
      
      <Divider />
      
      <ConfigContent>
        {renderConfigFields()}
      </ConfigContent>
      
      <Divider />
      
        <ConfigActions>
          <Button variant="outlined" onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
          <Button variant="contained" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>Delete</Button>
        </ConfigActions>
    </ConfigPanel>
  );
}