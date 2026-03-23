import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Typography, Divider, Box, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ElementRenderer from '../Common/ElementRenderer';

const ActionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  width: '100%',
  minWidth: 280,
  maxWidth: 320,
}));

const ActionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

/**
 * BaseAction component that serves as a foundation for all action components
 * @param {Object} props - Component props
 * @param {Object} props.data - The action data from botConfiguration.json
 * @param {string} props.nodeId - The node ID in the ReactFlow graph
 * @param {string} props.title - The title to display in the header
 * @param {React.ReactNode} props.icon - The icon to display in the header
 * @param {React.ReactNode} props.children - Additional content to render
 * @returns {React.ReactElement} The base action component
 */
const BaseAction = ({ data, nodeId, title, icon, children }) => {
  // Extract components and elements from the data
  const components = data?.components || [];
  const elements = components.length > 0 ? components[0]?.elements || [] : [];

  // Handle element change
  const handleElementChange = (elementId, value) => {
    console.log(`Element ${elementId} changed to ${value}`);
    // Here you would update the state or dispatch an action to update the data
  };

  // Handle duplicate button click
  const handleDuplicate = (event) => {
    event.stopPropagation();
    if (data.duplicateNode) {
      data.duplicateNode(nodeId);
    }
  };

  return (
    <ActionContainer>
      <ActionHeader>
        <Box display="flex" alignItems="center">
          {icon && <Box mr={1}>{icon}</Box>}
          <Typography variant="h6">{title || data.blockName}</Typography>
        </Box>
        <Tooltip title="Duplicate">
          <IconButton size="small" onClick={handleDuplicate}>
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </ActionHeader>
      <Divider />
      <Box mt={2}>
        {children}
        {elements.map((element) => (
          <ElementRenderer
            key={element.elementId}
            element={element}
            onChange={handleElementChange}
          />
        ))}
      </Box>
    </ActionContainer>
  );
};

export default BaseAction;