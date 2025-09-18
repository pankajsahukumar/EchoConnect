import React from 'react';
import { TextField, Checkbox, FormControlLabel, FormGroup, Select, MenuItem, InputLabel, FormControl, Typography, Paper } from '@mui/material';

/**
 * ElementRenderer component that renders the appropriate form element based on the element type
 * @param {Object} props - Component props
 * @param {Object} props.element - The element data from botConfiguration.json
 * @param {Function} props.onChange - Function to handle changes to the element value
 * @returns {React.ReactElement} The appropriate form element
 */
const ElementRenderer = ({ element, onChange }) => {
  const { elementType, elementName, elementRules } = element;

  // Handle change for the element
  const handleChange = (value) => {
    if (onChange) {
      onChange(element.elementId, value);
    }
  };

  // Render the appropriate element based on the elementType
  switch (elementType) {
    case 'CLEARABLE_INPUT':
      return (
        <TextField
          fullWidth
          label={elementName}
          variant="outlined"
          margin="normal"
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case 'CHECKBOX':
      return (
        <FormGroup>
          <Typography variant="subtitle1">{elementName}</Typography>
          {elementRules?.options?.map((option) => (
            <FormControlLabel
              key={option.value}
              control={
                <Checkbox
                  onChange={(e) => handleChange(e.target.checked ? option.value : '')}
                />
              }
              label={option.label}
            />
          ))}
        </FormGroup>
      );

    case 'DROPDOWN':
    case 'DROPDOWN_VARIABLE_INPUT':
      return (
        <FormControl fullWidth margin="normal">
          <InputLabel>{elementName}</InputLabel>
          <Select
            label={elementName}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={elementRules?.placeholder || 'Select'}
          >
            {elementRules?.list?.map((item) => (
              <MenuItem key={item.value} value={item.value}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      );

    case 'TIMER':
      return (
        <TextField
          fullWidth
          label={elementName}
          variant="outlined"
          margin="normal"
          type="number"
          InputProps={{
            endAdornment: <Typography variant="body2">minutes</Typography>,
          }}
          onChange={(e) => handleChange(e.target.value)}
        />
      );

    case 'WEBHOOK_SELECTOR':
      return (
        <Paper elevation={1} className="p-4 my-2">
          <Typography variant="subtitle1">{elementName}</Typography>
          <Typography variant="body2" color="textSecondary">
            {elementRules?.capture_label || 'Configure webhook integration'}
          </Typography>
        </Paper>
      );

    case 'GOOGLE_SHEETS_API':
      return (
        <Paper elevation={1} className="p-4 my-2">
          <Typography variant="subtitle1">{elementName}</Typography>
          <Typography variant="body2" color="textSecondary">
            Connect to Google Sheets to trigger on new rows
          </Typography>
        </Paper>
      );

    case 'LEAD_FROM_CTWA_V2':
      return (
        <Paper elevation={1} className="p-4 my-2">
          <Typography variant="subtitle1">{elementName}</Typography>
          <Typography variant="body2" color="textSecondary">
            This trigger activates when a lead comes from Click to WhatsApp ads
          </Typography>
        </Paper>
      );

    default:
      return (
        <Paper elevation={1} className="p-4 my-2">
          <Typography variant="subtitle1">{elementName}</Typography>
          <Typography variant="body2" color="textSecondary">
            Element type not supported: {elementType}
          </Typography>
        </Paper>
      );
  }
};

export default ElementRenderer;