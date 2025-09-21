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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

export default function ButtonsStep({ template, updateComponent }) {
  const [buttons, setButtons] = useState(
    template.components.find(c => c.type === 'BUTTONS' || c.type === 'BUTTON')?.buttons || []
  );
  const [addStopButton, setAddStopButton] = useState(false);
  const [buttonType, setButtonType] = useState('QUICK_REPLY');

  useEffect(() => {
    // Update buttons component
    updateComponent('BUTTONS', {
      buttons: buttons
    });
  }, [buttons]);

  const handleAddButton = () => {
    if (buttons.length < 3) {
      setButtons([...buttons, { text: '', type: buttonType }]);
    }
  };

  const handleRemoveButton = (index) => {
    const newButtons = [...buttons];
    newButtons.splice(index, 1);
    setButtons(newButtons);
  };

  const handleButtonTextChange = (index, value) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], text: value };
    setButtons(newButtons);
  };

  const handleAddStopButtonChange = (event) => {
    setAddStopButton(event.target.checked);
    if (event.target.checked) {
      // Add STOP button if checked
      if (!buttons.some(btn => btn.text === 'STOP')) {
        setButtons([...buttons, { text: 'STOP', type: 'QUICK_REPLY' }]);
      }
    } else {
      // Remove STOP button if unchecked
      setButtons(buttons.filter(btn => btn.text !== 'STOP'));
    }
  };
  
  const handleButtonTypeChange = (index, newType) => {
    const newButtons = [...buttons];
    newButtons[index] = { ...newButtons[index], type: newType };
    setButtons(newButtons);
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
          onClick={handleAddButton}
          disabled={buttons.length >= 3}
          sx={{ mb: 2 }}
        >
          Add a button
        </Button>
        <Typography variant="body2" color="text.secondary">
          {buttons.length}/3 buttons
        </Typography>
      </Box>

      {buttons.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
          No buttons added yet. Click "Add a button" to create one.
        </Typography>
      )}

      {buttons.length > 0 && (
        <Typography variant="body2" sx={{ mb: 1 }}>
          {buttons.length > 1 ? 'If you add more than 3 buttons they will appear in a list' : ''}
        </Typography>
      )}

      {/* Button List */}
      {buttons.map((button, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            p: 2,
            mb: 2,
            border: '1px solid #ddd',
            borderRadius: 1,
            position: 'relative',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2">{index + 1}.</Typography>
            <Typography variant="subtitle2" sx={{ ml: 1 }}>
              {button.type === 'PHONE_NUMBER' ? 'Phone Number' : 
               button.type === 'URL' ? 'URL' : 'Quick Reply'}
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
            <Typography variant="body2" gutterBottom>
              Button type
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Button 
                variant={button.type === 'QUICK_REPLY' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleButtonTypeChange(index, 'QUICK_REPLY')}
                disabled={button.text === 'STOP' && addStopButton}
              >
                Quick Reply
              </Button>
              <Button 
                variant={button.type === 'URL' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleButtonTypeChange(index, 'URL')}
                disabled={button.text === 'STOP' && addStopButton}
              >
                URL
              </Button>
              <Button 
                variant={button.type === 'PHONE_NUMBER' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => handleButtonTypeChange(index, 'PHONE_NUMBER')}
                disabled={button.text === 'STOP' && addStopButton}
              >
                Phone Number
              </Button>
            </Box>
            
            <Typography variant="body2" gutterBottom>
              Button text
            </Typography>
            <TextField
              fullWidth
              value={button.text}
              onChange={(e) => handleButtonTextChange(index, e.target.value)}
              placeholder={`Button ${index + 1}`}
              disabled={button.text === 'STOP' && addStopButton}
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
                <Typography variant="body2" gutterBottom>
                  URL
                </Typography>
                <TextField
                  fullWidth
                  value={button.url || ''}
                  onChange={(e) => {
                    const newButtons = [...buttons];
                    newButtons[index] = { ...newButtons[index], url: e.target.value };
                    setButtons(newButtons);
                  }}
                  placeholder="https://example.com"
                  disabled={button.text === 'STOP' && addStopButton}
                />
              </Box>
            )}
            
            {button.type === 'PHONE_NUMBER' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Phone Number
                </Typography>
                <TextField
                  fullWidth
                  value={button.phoneNumber || ''}
                  onChange={(e) => {
                    const newButtons = [...buttons];
                    newButtons[index] = { ...newButtons[index], phoneNumber: e.target.value };
                    setButtons(newButtons);
                  }}
                  placeholder="+1234567890"
                  disabled={button.text === 'STOP' && addStopButton}
                />
              </Box>
            )}
          </Box>
        </Paper>
      ))}

      <Divider sx={{ my: 3 }} />

      {/* Add STOP button option */}
      <FormControlLabel
        control={
          <Checkbox
            checked={addStopButton}
            onChange={handleAddStopButtonChange}
            name="addStopButton"
          />
        }
        label="Add stop button"
      />
      <Typography variant="body2" color="text.secondary" sx={{ ml: 4, mt: -1 }}>
        Learn more
      </Typography>

      {addStopButton && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No opt-out messaging set. This might lead to account violation and number getting banned by WhatsApp
        </Alert>
      )}
    </Box>
  );
}