import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

const NodeContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  minWidth: 180,
  boxShadow: theme.shadows[3],
  border: `2px solid ${theme.palette.primary.main}`,
  '& .node-header': {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
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

// Helper components for the interactive message node
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

const Section = ({ section, index, onUpdate, onRemove }) => {
  const [newItem, setNewItem] = useState('');

  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      const updatedItems = [...(section.items || []), { id: Date.now().toString(), title: newItem }];
      onUpdate(index, { ...section, items: updatedItems });
      setNewItem('');
    }
  };

  const handleRemoveItem = (itemIndex) => {
    const updatedItems = section.items.filter((_, i) => i !== itemIndex);
    onUpdate(index, { ...section, items: updatedItems });
  };

  return (
    <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, p: 1, mb: 2 }}>
      <Typography variant="subtitle2">{section.title}</Typography>
      
      {section.items && section.items.map((item, itemIndex) => (
        <Box key={itemIndex} sx={{ display: 'flex', alignItems: 'center', my: 1 }}>
          <TextField
            size="small"
            value={item.title}
            fullWidth
            disabled
          />
          <IconButton size="small" onClick={() => handleRemoveItem(itemIndex)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ))}
      
      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
        <TextField
          size="small"
          placeholder="Add list item"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          fullWidth
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleAddItem();
              e.preventDefault();
            }
          }}
        />
        <Button 
          size="small" 
          variant="text" 
          onClick={handleAddItem}
          sx={{ ml: 1 }}
        >
          Add item
        </Button>
      </Box>
    </Box>
  );
};

export function ActionNode({ data, isConnectable, selected, id }) {
  // Common state
  const [nodeType, setNodeType] = useState(data.id || '');
  
  // Add/Remove Tag node state
  const [tagMode, setTagMode] = useState(data.mode || 'add');
  const [selectedTags, setSelectedTags] = useState(data.tags || []);
  const [newTag, setNewTag] = useState('');
  
  // Interactive Message node state
  const [header, setHeader] = useState(data.header || '');
  const [body, setBody] = useState(data.body || '');
  const [footer, setFooter] = useState(data.footer || '');
  const [listButton, setListButton] = useState(data.listButton || '');
  const [sections, setSections] = useState(data.sections || []);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  
  // Variable selector state
  const [variableSelectorOpen, setVariableSelectorOpen] = useState(false);
  const [variableSelectorAnchorEl, setVariableSelectorAnchorEl] = useState(null);
  const [currentField, setCurrentField] = useState(null);

  // Update node data when any state changes
  useEffect(() => {
    if (data.onDataChange) {
      if (nodeType === 'add-remove-tag') {
        data.onDataChange({
          ...data,
          mode: tagMode,
          tags: selectedTags,
        });
      } else if (nodeType === 'interactive-message') {
        data.onDataChange({
          ...data,
          header,
          body,
          footer,
          listButton,
          sections,
        });
      }
    }
  }, [nodeType, tagMode, selectedTags, header, body, footer, listButton, sections]);
  
  // Variable selector handlers
  const handleOpenVariableSelector = (event, field) => {
    setVariableSelectorAnchorEl(event.currentTarget);
    setVariableSelectorOpen(true);
    setCurrentField(field);
  };
  
  const handleCloseVariableSelector = () => {
    setVariableSelectorOpen(false);
    setVariableSelectorAnchorEl(null);
  };
  
  const handleSelectVariable = (variable) => {
    // Format: [[{"value":"name","title":"Customer Attributes (name)","variableValue":"global::name"}]]
    const variableString = `[[{"value":"${variable.value}","title":"${variable.title}","variableValue":"${variable.variableValue}"}]]`;
    
    switch (currentField) {
      case 'header':
        setHeader(variableString);
        break;
      case 'body':
        setBody(variableString);
        break;
      case 'footer':
        setFooter(variableString);
        break;
      case 'listButton':
        setListButton(variableString);
        break;
      default:
        break;
    }
  };

  // Tag handlers
  const handleAddTag = () => {
    if (newTag.trim() !== '' && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // Section handlers
  const handleAddSection = () => {
    if (newSectionTitle.trim() !== '') {
      setSections([...sections, { title: newSectionTitle, items: [] }]);
      setNewSectionTitle('');
    }
  };

  const handleUpdateSection = (index, updatedSection) => {
    const updatedSections = sections.map((section, i) => 
      i === index ? updatedSection : section
    );
    setSections(updatedSections);
  };

  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  // Render different node content based on node type
  const renderNodeContent = () => {
    switch (nodeType) {
      case 'add-remove-tag':
        return (
          <>
            <FormControl component="fieldset" sx={{ mb: 2 }}>
              <FormLabel component="legend">Action</FormLabel>
              <RadioGroup
                row
                value={tagMode}
                onChange={(e) => setTagMode(e.target.value)}
              >
                <FormControlLabel value="add" control={<Radio size="small" />} label="Add Tags" />
                <FormControlLabel value="remove" control={<Radio size="small" />} label="Remove Tags" />
              </RadioGroup>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Selected Tags</FormLabel>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                {selectedTags.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    onDelete={() => handleRemoveTag(tag)}
                  />
                ))}
                {selectedTags.length === 0 && (
                  <Typography variant="body2" color="text.secondary">
                    No tags selected
                  </Typography>
                )}
              </Box>
            </FormControl>
            
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Add tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                fullWidth
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag();
                    e.preventDefault();
                  }
                }}
              />
              <Button 
                size="small" 
                variant="outlined" 
                onClick={handleAddTag}
                sx={{ ml: 1 }}
              >
                Add
              </Button>
            </Box>
          </>
        );
        
      case 'interactive-message':
        return (
          <>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Header</FormLabel>
              <TextField
                size="small"
                value={header}
                onChange={(e) => setHeader(e.target.value)}
                fullWidth
                placeholder="Header text"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <VariableButton onClick={(e) => handleOpenVariableSelector(e, 'header')}/>
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 1 }}
              />
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Body</FormLabel>
              <TextField
                size="small"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                fullWidth
                multiline
                rows={3}
                placeholder="Message body"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <VariableButton onClick={(e) => handleOpenVariableSelector(e, 'body')}/>
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 1 }}
              />
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Footer</FormLabel>
              <TextField
                size="small"
                value={footer}
                onChange={(e) => setFooter(e.target.value)}
                fullWidth
                placeholder="Footer text"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <VariableButton onClick={(e) => handleOpenVariableSelector(e, 'footer')}/>
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 1 }}
              />
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>List Button</FormLabel>
              <TextField
                size="small"
                value={listButton}
                onChange={(e) => setListButton(e.target.value)}
                fullWidth
                placeholder="Button text"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <VariableButton onClick={(e) => handleOpenVariableSelector(e, 'listButton')}/>
                    </InputAdornment>
                  ),
                }}
                sx={{ mt: 1 }}
              />
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <FormLabel>Sections</FormLabel>
              {sections.map((section, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle2">{section.title}</Typography>
                    <IconButton size="small" onClick={() => handleRemoveSection(index)} sx={{ ml: 'auto' }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Section 
                    section={section} 
                    index={index} 
                    onUpdate={handleUpdateSection} 
                    onRemove={handleRemoveSection} 
                  />
                </Box>
              ))}
              
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TextField
                  size="small"
                  placeholder="Section title"
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                  fullWidth
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSection();
                      e.preventDefault();
                    }
                  }}
                />
                <Button 
                  size="small" 
                  variant="outlined" 
                  onClick={handleAddSection}
                  sx={{ ml: 1 }}
                >
                  Add Section
                </Button>
              </Box>
            </FormControl>
          </>
        );
        
      default:
        return (
          <Typography variant="body2" color="text.secondary">
            Unknown node type
          </Typography>
        );
    }
  };

  // Function to handle duplication
  const handleDuplicate = (event) => {
    event.stopPropagation();
    if (data.duplicateNode) {
      data.duplicateNode();
    }
  };

  return (
    <NodeContainer className="action-node">
      <Handle type="target" position={Position.Top} id="target" isConnectable={isConnectable} />
      <div className="node-header">
        <Typography variant="subtitle1">{data.label}</Typography>
        <div style={{ position: 'absolute', top: 5, right: 5 }}>
          <Tooltip title="Duplicate">
            <IconButton size="small" onClick={handleDuplicate}>
              <ContentCopyIcon fontSize="small" sx={{ color: 'white' }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className="node-content">
        {renderNodeContent()}
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