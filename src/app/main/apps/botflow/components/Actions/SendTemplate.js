import React, { useState } from 'react';
import BaseAction from './BaseAction';
import DescriptionIcon from '@mui/icons-material/Description';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
  Card,
  CardContent,
} from '@mui/material';

const SendTemplate = ({ data, nodeId }) => {
  // Mock templates for demonstration
  const [templates] = useState([
    { id: '1', name: 'Welcome Message', category: 'UTILITY', language: 'en' },
    { id: '2', name: 'Order Confirmation', category: 'UTILITY', language: 'en' },
    { id: '3', name: 'Promo Offer', category: 'MARKETING', language: 'en' },
    { id: '4', name: 'Appointment Reminder', category: 'UTILITY', language: 'en' },
    { id: '5', name: 'Feedback Request', category: 'MARKETING', language: 'en' },
  ]);

  const [selectedTemplate, setSelectedTemplate] = useState(data.templateId || '');
  const [variables, setVariables] = useState(data.variables || {});

  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value);
    setVariables({});
  };

  const handleVariableChange = (key, value) => {
    setVariables((prev) => ({ ...prev, [key]: value }));
  };

  const selected = templates.find((t) => t.id === selectedTemplate);

  return (
    <BaseAction
      data={data}
      nodeId={nodeId}
      title="Send Template"
      icon={<DescriptionIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Send a pre-approved WhatsApp template message
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Template</InputLabel>
          <Select
            value={selectedTemplate}
            onChange={handleTemplateChange}
            label="Select Template"
          >
            {templates.map((template) => (
              <MenuItem key={template.id} value={template.id}>
                {template.name}
                <Chip
                  label={template.category}
                  size="small"
                  sx={{ ml: 1 }}
                  color={template.category === 'MARKETING' ? 'warning' : 'info'}
                  variant="outlined"
                />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {selected && (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Template: {selected.name}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Category: {selected.category} | Language: {selected.language}
              </Typography>

              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Variable Mapping
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  margin="dense"
                  label="{{1}} - e.g. Customer Name"
                  value={variables['1'] || ''}
                  onChange={(e) => handleVariableChange('1', e.target.value)}
                  placeholder="Enter value or use {{variable}}"
                />
                <TextField
                  fullWidth
                  size="small"
                  margin="dense"
                  label="{{2}} - e.g. Order Number"
                  value={variables['2'] || ''}
                  onChange={(e) => handleVariableChange('2', e.target.value)}
                  placeholder="Enter value or use {{variable}}"
                />
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>
    </BaseAction>
  );
};

export default SendTemplate;
