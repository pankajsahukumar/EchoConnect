import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Typography, Button, Divider, Box } from '@mui/material';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import SettingsIcon from '@mui/icons-material/Settings';

const SelectorContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
}));

const NodeButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  padding: theme.spacing(1, 2),
  textTransform: 'none',
}));

function NodeSelector({ onAddNode }) {
  const nodeTypes = [
    { type: 'input', label: 'Start Node', icon: <InputIcon /> },
    { type: 'default', label: 'Process Node', icon: <SettingsIcon /> },
    { type: 'output', label: 'End Node', icon: <OutputIcon /> },
  ];

  return (
    <SelectorContainer elevation={2}>
      <Typography variant="subtitle1" gutterBottom>
        Add Nodes
      </Typography>
      <Divider />
      <Box sx={{ mt: 1 }}>
        {nodeTypes.map((node) => (
          <NodeButton
            key={node.type}
            variant="outlined"
            color="primary"
            fullWidth
            startIcon={node.icon}
            onClick={() => onAddNode(node.type)}
            sx={{ mb: 1 }}
          >
            {node.label}
          </NodeButton>
        ))}
      </Box>
    </SelectorContainer>
  );
}

export default NodeSelector;