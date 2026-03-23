import React from 'react';
import { styled } from '@mui/material/styles';
import { Paper, Typography, Divider, Button, Box } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import NodeSelector from './NodeSelector';

const SidebarContainer = styled(Paper)(({ theme }) => ({
  width: 250,
  padding: theme.spacing(2),
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1, 0),
}));

function Sidebar({ onAddNode, onSaveFlow, onClearFlow }) {
  return (
    <SidebarContainer elevation={3}>
      <Typography variant="h6" gutterBottom>
        Bot Flow Editor
      </Typography>
      <Divider sx={{ mb: 2 }} />
      
      <NodeSelector onAddNode={onAddNode} />
      
      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mb: 2 }} />
        <ActionButton
          variant="contained"
          color="primary"
          startIcon={<SaveIcon />}
          fullWidth
          onClick={onSaveFlow}
        >
          Save Flow
        </ActionButton>
        <ActionButton
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          fullWidth
          onClick={onClearFlow}
        >
          Clear Flow
        </ActionButton>
      </Box>
    </SidebarContainer>
  );
}

export default Sidebar;