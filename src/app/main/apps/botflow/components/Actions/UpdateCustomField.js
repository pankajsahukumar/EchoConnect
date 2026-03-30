import React, { useState } from 'react';
import BaseAction from './BaseAction';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import {
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
} from '@mui/material';

const UpdateCustomField = ({ data, nodeId }) => {
  const [fieldName, setFieldName] = useState(data.fieldName || '');
  const [fieldValue, setFieldValue] = useState(data.fieldValue || '');

  // Mock custom fields for demonstration
  const customFields = [
    { id: 'plan_type', label: 'Plan Type' },
    { id: 'company_name', label: 'Company Name' },
    { id: 'lead_source', label: 'Lead Source' },
    { id: 'subscription_status', label: 'Subscription Status' },
    { id: 'preferred_language', label: 'Preferred Language' },
  ];

  // Available variables for dynamic values
  const variables = [
    { name: 'customer_name', value: '{{customer.name}}' },
    { name: 'phone', value: '{{customer.phone}}' },
    { name: 'email', value: '{{customer.email}}' },
  ];

  const insertVariable = (variable) => {
    setFieldValue((prev) => prev + variable.value);
  };

  return (
    <BaseAction
      data={data}
      nodeId={nodeId}
      title="Update Custom Field"
      icon={<EditAttributesIcon />}
    >
      <Box mb={2}>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Set or update a custom field on the contact
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Field Name</InputLabel>
          <Select
            value={fieldName}
            onChange={(e) => setFieldName(e.target.value)}
            label="Field Name"
          >
            {customFields.map((field) => (
              <MenuItem key={field.id} value={field.id}>
                {field.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Field Value"
          variant="outlined"
          value={fieldValue}
          onChange={(e) => setFieldValue(e.target.value)}
          placeholder="Enter value or use {{variable}}"
        />

        <Box mt={1}>
          <Typography variant="subtitle2" gutterBottom>
            Available Variables:
          </Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {variables.map((variable) => (
              <Chip
                key={variable.name}
                label={variable.name}
                onClick={() => insertVariable(variable)}
                color="primary"
                variant="outlined"
                size="small"
              />
            ))}
          </Box>
        </Box>
      </Box>
    </BaseAction>
  );
};

export default UpdateCustomField;
