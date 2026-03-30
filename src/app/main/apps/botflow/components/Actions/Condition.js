import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { styled } from '@mui/material/styles';
import {
  Paper,
  Typography,
  Divider,
  Box,
  IconButton,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const ConditionContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: `1px solid ${theme.palette.warning.main}`,
  width: '100%',
  minWidth: 280,
  maxWidth: 320,
}));

const ConditionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(1),
}));

const HandleLabel = styled(Typography)(({ theme }) => ({
  position: 'absolute',
  bottom: -28,
  fontSize: '0.7rem',
  fontWeight: 600,
  padding: '1px 6px',
  borderRadius: 4,
}));

const Condition = ({ data, nodeId }) => {
  const [conditionField, setConditionField] = useState(data.conditionField || 'message_content');
  const [operator, setOperator] = useState(data.operator || 'contains');
  const [value, setValue] = useState(data.value || '');

  const handleDuplicate = (event) => {
    event.stopPropagation();
    if (data.duplicateNode) {
      data.duplicateNode(nodeId);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <Handle type="target" position={Position.Top} id="target" style={{ background: '#ed6c02' }} />
      <ConditionContainer>
        <ConditionHeader>
          <Box display="flex" alignItems="center">
            <Box mr={1}><AccountTreeIcon color="warning" /></Box>
            <Typography variant="h6">Condition</Typography>
          </Box>
          <Tooltip title="Duplicate">
            <IconButton size="small" onClick={handleDuplicate}>
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ConditionHeader>
        <Divider />
        <Box mt={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Branch the flow based on a condition
          </Typography>

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Check Field</InputLabel>
            <Select
              value={conditionField}
              onChange={(e) => setConditionField(e.target.value)}
              label="Check Field"
            >
              <MenuItem value="message_content">Message Content</MenuItem>
              <MenuItem value="tag">Contact Tag</MenuItem>
              <MenuItem value="custom_field">Custom Field</MenuItem>
              <MenuItem value="contact_name">Contact Name</MenuItem>
              <MenuItem value="contact_email">Contact Email</MenuItem>
              <MenuItem value="contact_phone">Contact Phone</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Operator</InputLabel>
            <Select
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              label="Operator"
            >
              <MenuItem value="contains">Contains</MenuItem>
              <MenuItem value="equals">Equals</MenuItem>
              <MenuItem value="starts_with">Starts With</MenuItem>
              <MenuItem value="ends_with">Ends With</MenuItem>
              <MenuItem value="not_contains">Does Not Contain</MenuItem>
              <MenuItem value="not_equals">Does Not Equal</MenuItem>
              <MenuItem value="is_empty">Is Empty</MenuItem>
              <MenuItem value="is_not_empty">Is Not Empty</MenuItem>
              <MenuItem value="regex">Matches Regex</MenuItem>
            </Select>
          </FormControl>

          {operator !== 'is_empty' && operator !== 'is_not_empty' && (
            <TextField
              fullWidth
              margin="normal"
              size="small"
              label="Value"
              variant="outlined"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter comparison value"
            />
          )}
        </Box>
      </ConditionContainer>

      {/* Yes branch - left */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="yes"
        style={{ left: '30%', background: '#4caf50' }}
      />
      <HandleLabel sx={{ left: '20%', color: 'success.main' }}>
        Yes
      </HandleLabel>

      {/* No branch - right */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="no"
        style={{ left: '70%', background: '#f44336' }}
      />
      <HandleLabel sx={{ left: '62%', color: 'error.main' }}>
        No
      </HandleLabel>
    </div>
  );
};

export default Condition;
