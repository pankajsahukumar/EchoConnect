import { useState, useEffect } from "react";
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
  Select,
  FormControl,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default function ButtonsStep({ template, updateComponent }) {
  const [buttons, setButtons] = useState(
    template?.components?.find((c) => c.type === "BUTTONS" || c.type === "BUTTON")
      ?.buttons || []
  );
  const [addStopButton, setAddStopButton] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    updateComponent("BUTTONS", { buttons });
    validateButtons(buttons);
  }, [buttons]);

  const validateButtons = (buttons) => {
    const newErrors = {};
    buttons.forEach((button, index) => {
      if (button.text !== "STOP") {
        if (!button.text || button.text.trim() === "") {
          newErrors[index] = "Button text is required";
          return;
        }
        if (button.type === "URL") {
          if (!button.url) {
            newErrors[index] = "Please enter a valid URL";
          }
        }
        if (button.type === "PHONE_NUMBER") {
          if (!button.phoneNumber) {
            newErrors[index] = "Please enter a valid phone number";
          }
        }
      }
    });
    setErrors(newErrors);
  };

  const handleAddButtonClick = (event) => setAnchorEl(event.currentTarget);

  const handleAddButtonType = (type) => {
    if (buttons.length < 3) {
      // Prevent more than one phone number button
      if (type === "PHONE_NUMBER" && buttons.some((b) => b.type === "PHONE_NUMBER")) {
        return;
      }

      let newBtn = { text: "", type };
      if (type === "URL") {
        newBtn = { ...newBtn, urlType: "https://", url: "" };
      }
      if (type === "PHONE_NUMBER") {
        newBtn = { ...newBtn, countryCode: "+91", phoneNumber: "" };
      }
      setButtons([...buttons, newBtn]);
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

  const handleTypeChange = (index, newType) => {
    const newButtons = [...buttons];
    if (newType === "URL") {
      newButtons[index] = {
        ...newButtons[index],
        type: "URL",
        urlType: "https://",
        url: "",
      };
    } else if (newType === "PHONE_NUMBER") {
      // Prevent switching to PHONE_NUMBER if already one exists elsewhere
      if (buttons.some((b, i) => b.type === "PHONE_NUMBER" && i !== index)) {
        return;
      }
      newButtons[index] = {
        ...newButtons[index],
        type: "PHONE_NUMBER",
        countryCode: "+91",
        phoneNumber: "",
      };
    }
    setButtons(newButtons);
  };

  const handleAddStopButtonChange = (event) => {
    setAddStopButton(event.target.checked);
    if (event.target.checked && !buttons.some((btn) => btn.text === "STOP")) {
      setButtons([...buttons, { text: "STOP", type: "QUICK_REPLY" }]);
    } else {
      setButtons(buttons.filter((btn) => btn.text !== "STOP"));
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        Create buttons that let customers respond to your message or take action
      </Typography>

      <Box
        sx={{
          mt: 2,
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddButtonClick}
          disabled={buttons.length >= 10}
        >
          Add a button
        </Button>
        <Typography variant="body2" color="text.secondary">
          {buttons.length}/10 buttons
        </Typography>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => handleAddButtonType("QUICK_REPLY")}>
            Quick Reply
          </MenuItem>
          <MenuItem onClick={() => handleAddButtonType("URL")}>Website</MenuItem>
          <MenuItem
            onClick={() => handleAddButtonType("PHONE_NUMBER")}
            disabled={buttons.some((b) => b.type === "PHONE_NUMBER")}
          >
            Phone Number
          </MenuItem>
        </Menu>
      </Box>

      {buttons.map((button, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{ p: 2, mb: 2, border: "1px solid #ddd", borderRadius: 1 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
            <Typography variant="subtitle2">{index + 1}.</Typography>

            {/* Only show type selector for URL & PHONE_NUMBER */}
            {button.type !== "QUICK_REPLY" && (
              <FormControl size="small" sx={{ ml: 2, minWidth: 150 }}>
                <Select
                  value={button.type}
                  onChange={(e) => handleTypeChange(index, e.target.value)}
                >
                  <MenuItem value="URL">Website</MenuItem>
                  <MenuItem value="PHONE_NUMBER">Phone Number</MenuItem>
                </Select>
              </FormControl>
            )}

            <Box sx={{ flexGrow: 1 }} />
            <IconButton
              size="small"
              onClick={() => handleRemoveButton(index)}
              disabled={button.text === "STOP" && addStopButton}
            >
              <DeleteOutlineIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Button Text */}
          <TextField
            fullWidth
            value={button.text}
            onChange={(e) => handleButtonTextChange(index, e.target.value)}
            placeholder={`Button ${index + 1}`}
            disabled={button.text === "STOP" && addStopButton}
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

          {/* URL Input */}
          {button.type === "URL" && (
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={button.urlType}
                  onChange={(e) => {
                    const newButtons = [...buttons];
                    newButtons[index].urlType = e.target.value;
                    setButtons(newButtons);
                  }}
                >
                  <MenuItem value="https://">https://</MenuItem>
                  <MenuItem value="http://">http://</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                value={button.url || ""}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[index].url = e.target.value;
                  setButtons(newButtons);
                }}
                placeholder="example.com"
              />
            </Box>
          )}

          {/* Phone Number Input */}
          {button.type === "PHONE_NUMBER" && (
            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              <TextField
                sx={{ width: 100 }}
                value={button.countryCode || "+91"}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[index].countryCode = e.target.value;
                  setButtons(newButtons);
                }}
                placeholder="+91"
              />
              <TextField
                fullWidth
                value={button.phoneNumber || ""}
                onChange={(e) => {
                  const newButtons = [...buttons];
                  newButtons[index].phoneNumber = e.target.value;
                  setButtons(newButtons);
                }}
                placeholder="1234567890"
              />
            </Box>
          )}
        </Paper>
      ))}

      <Divider sx={{ my: 3 }} />

      <FormControlLabel
        control={
          <Checkbox checked={addStopButton} onChange={handleAddStopButtonChange} />
        }
        label="Add stop button"
      />
      {addStopButton && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          No opt-out messaging set. This might lead to account violation and
          number getting banned by WhatsApp
        </Alert>
      )}
    </Box>
  );
}
