import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { styled } from '@mui/material/styles';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const NodeCard = styled(Card)(({ theme, selected }) => ({
  minWidth: 180,
  borderRadius: 8,
  boxShadow: selected ? theme.shadows[6] : theme.shadows[3],
  border: selected ? `2px solid ${theme.palette.primary.main}` : 'none',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
  },
}));

const NodeHeader = styled('div')(({ theme, nodeType }) => ({
  padding: '8px 16px',
  borderTopLeftRadius: 8,
  borderTopRightRadius: 8,
  backgroundColor:
    nodeType === 'input'
      ? theme.palette.primary.main
      : nodeType === 'output'
      ? theme.palette.success.main
      : theme.palette.secondary.main,
  color: theme.palette.common.white,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

function BotNode({ id, data, type, selected, isConnectable, onNodeDelete }) {
  const handleDelete = (event) => {
    event.stopPropagation();
    if (onNodeDelete) {
      onNodeDelete(id);
    }
  };

  return (
    <NodeCard variant="outlined" selected={selected}>
      <NodeHeader nodeType={type}>
        <Typography variant="subtitle2">{type || 'Default'}</Typography>
        <IconButton size="small" onClick={handleDelete} sx={{ color: 'white' }}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </NodeHeader>
      <CardContent>
        <Typography variant="body2">{data.label}</Typography>
      </CardContent>
      
      {/* Input handle */}
      {type !== 'input' && (
        <Handle
          type="target"
          position={Position.Top}
          isConnectable={isConnectable}
          style={{ background: '#555' }}
        />
      )}
      
      {/* Output handle */}
      {type !== 'output' && (
        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
          style={{ background: '#555' }}
        />
      )}
    </NodeCard>
  );
}

export default memo(BotNode);