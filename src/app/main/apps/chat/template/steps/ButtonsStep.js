import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  Divider,
  FormControlLabel,
  Checkbox,
  InputAdornment,
  Alert,
  Menu,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function ButtonsStep({ template, updateComponent }) {
  const [buttons, setButtons] = useState(
    template?.components?.find(c => c.type === 'BUTTONS' || c.type === 'BUTTON')?.buttons || []
  );
  const [addStopButton, setAddStopButton] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // for menu
  const [errors, setErrors] = useState({}); // button errors

  useEffect(() => {
    updateComponent('BUTTONS', { buttons });
    validateButtons(buttons);
  }, [buttons]);

  const validateButtons = (buttons) => {
    const newErrors = {};
    buttons.forEach((button, index) => {
      if (button.text !== 'STOP') {
        if (!button.text || button.text.trim() === '') {
          newErrors[index] = 'Button text is required';
          return;
        }
        if (button.type === 'URL') {
          const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/i;
          if (!button.url || !urlPattern.test(button.url)) {
            newErrors[index] = 'Please enter a valid URL';
          }
        }
        if (button.type === 'PHONE_NUMBER') {
          const phonePattern = /^\+?[1-9]\d{1,14}$/; // basic E.164
          if (!button.phoneNumber || !phonePattern.test(button.phoneNumber)) {
            newErrors[index] = 'Please enter a valid phone number';
          }
        }
      }
    });
    setErrors(newErrors);
  };

  const handleAddButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAddButtonType = (type) => {
    if (buttons.length < 3) {
      setButtons([...buttons, { text: '', type }]);
    }
    setAnchorEl(null);
  };

  const handleRemoveButton = (index) => {
    setButtons(buttons.filter((_, i) => i !== index));
  };

  const handleButtonTextChange = (index, value) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], text: value };
    setButtons(newButtons);
  };

  const handleAddStopButtonChange = (event) => {
    setAddStopButton(event.target.checked);
    if (event.target.checked && !buttons.some(btn => btn.text === 'STOP')) {
      setButtons([...buttons, { text: 'STOP', type: 'QUICK_REPLY' }]);
    } else {
      setButtons(buttons.filter(btn => btn.text !== 'STOP'));
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Create buttons that let customers respond to your message or take action
      </Typography>

      <Box sx={{ mt: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddButtonClick}
          disabled={buttons.length >= 3}
        >
          Add a button
        </Button>
        <Typography variant="body2" color="text.secondary">
          {buttons.length}/3 buttons
        </Typography>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem onClick={() => handleAddButtonType('QUICK_REPLY')}>Quick Reply</MenuItem>
          <MenuItem onClick={() => handleAddButtonType('URL')}>Website</MenuItem>
          <MenuItem onClick={() => handleAddButtonType('PHONE_NUMBER')}>Phone Number</MenuItem>
        </Menu>
      </Box>

      {buttons.map((button, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{ p: 2, mb: 2, border: '1px solid #ddd', borderRadius: 1, position: 'relative' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">{index + 1}.</Typography>
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              {button.type === 'PHONE_NUMBER' ? 'Phone Number' :
               button.type === 'URL' ? 'Website' : 'Quick Reply'}
            </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              size="small"
              onClick={() => handleRemoveButton(index)}
              disabled={button.text === 'STOP' && addStopButton}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>

          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              value={button.text}
              onChange={(e) => handleButtonTextChange(index, e.target.value)}
              placeholder={`Button ${index + 1}`}
              disabled={button.text === 'STOP' && addStopButton}
              error={!!errors[index]}
              helperText={errors[index]}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography variant="caption" color="text.secondary">
                      {button.text.length}/25
                    </Typography>
                  </InputAdornment>
                ),
              }}
            />

            {button.type === 'URL' && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  value={button.url || ''}
                  onChange={(e) => {
                    const newButtons = [...buttons];
                    newButtons[index] = { ...newButtons[index], url: e.target.value };
                    setButtons(newButtons);
                  }}
                  placeholder="https://example.com"
                  error={!!errors[index]}
                  helperText={errors[index]}
                />
              </Box>
            )}

            {button.type === 'PHONE_NUMBER' && (
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  value={button.phoneNumber || ''}
                  onChange={(e) => {
                    const newButtons = [...buttons];
                    newButtons[index] = { ...newButtons[index], phoneNumber: e.target.value };
                    setButtons(newButtons);
                  }}
                  placeholder="+1234567890"
                  error={!!errors[index]}
                  helperText={errors[index]}
                />
              </Box>
            )}
          </Box>
        </Paper>
      ))}

      <Divider sx={{ my: 3 }} />

      <FormControlLabel
        control={<Checkbox checked={addStopButton} onChange={handleAddStopButtonChange} />}
        label="Add stop button"
      />
      {addStopButton && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No opt-out messaging set. This might lead to account violation and number getting banned by WhatsApp
        </Alert>
      )}
    </Box>
  );
}
