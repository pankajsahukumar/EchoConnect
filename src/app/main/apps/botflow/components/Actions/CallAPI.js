import React, { useState } from 'react';
import BaseAction from './BaseAction';
import HttpIcon from '@mui/icons-material/Http';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const CallAPI = ({ data, nodeId }) => {
  const [method, setMethod] = useState(data.method || 'GET');
  const [url, setUrl] = useState(data.url || '');
  const [headers, setHeaders] = useState(data.headers || [{ key: '', value: '' }]);
  const [body, setBody] = useState(data.body || '');
  const [responseVariable, setResponseVariable] = useState(data.responseVariable || '');

  const handleAddHeader = () => {
    setHeaders([...headers, { key: '', value: '' }]);
  };

  const handleRemoveHeader = (index) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const handleHeaderChange = (index, field, value) => {
    setHeaders(
      headers.map((header, i) =>
        i === index ? { ...header, [field]: value } : header
      )
    );
  };

  return (
    <BaseAction
      data={data}
      nodeId={nodeId}
      title="Call API"
      icon={<HttpIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Make an HTTP request to an external API
        </Typography>

        <Box display="flex" gap={1} mt={2}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <InputLabel>Method</InputLabel>
            <Select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              label="Method"
            >
              <MenuItem value="GET">GET</MenuItem>
              <MenuItem value="POST">POST</MenuItem>
              <MenuItem value="PUT">PUT</MenuItem>
              <MenuItem value="PATCH">PATCH</MenuItem>
              <MenuItem value="DELETE">DELETE</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            size="small"
            label="URL"
            variant="outlined"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
          />
        </Box>

        <Box mt={2}>
          <Typography variant="subtitle2" gutterBottom>
            Headers
          </Typography>
          {headers.map((header, index) => (
            <Box key={index} display="flex" gap={1} mb={1} alignItems="center">
              <TextField
                size="small"
                label="Key"
                value={header.key}
                onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                placeholder="Content-Type"
                sx={{ flex: 1 }}
              />
              <TextField
                size="small"
                label="Value"
                value={header.value}
                onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                placeholder="application/json"
                sx={{ flex: 1 }}
              />
              <IconButton size="small" color="error" onClick={() => handleRemoveHeader(index)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
          <Button
            size="small"
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={handleAddHeader}
          >
            Add Header
          </Button>
        </Box>

        {(method === 'POST' || method === 'PUT' || method === 'PATCH') && (
          <Box mt={2}>
            <TextField
              fullWidth
              size="small"
              label="Request Body (JSON)"
              variant="outlined"
              multiline
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder='{"key": "value"}'
            />
          </Box>
        )}

        <Box mt={2}>
          <TextField
            fullWidth
            size="small"
            label="Store Response In Variable"
            variant="outlined"
            value={responseVariable}
            onChange={(e) => setResponseVariable(e.target.value)}
            placeholder="api_response"
            helperText="Save the API response to use in later steps"
          />
        </Box>
      </Box>
    </BaseAction>
  );
};

export default CallAPI;
