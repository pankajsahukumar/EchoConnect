import React, { useState } from "react";
import { IconButton, Popover, Box, Typography, Chip } from "@mui/material";
import { Code } from "@mui/icons-material";

const VariableButton = ({ onSelectVariable, showVariables = true }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleVariableSelect = (variable) => {
    const variableText = `{{${variable}}}`;
    if (onSelectVariable) {
      onSelectVariable(variableText);
    }
    handleClose();
  };

  const commonVariables = [
    "1",
    "2",
    "3",
    "Name",
    "Tracking Code",
    "Inquiry Code",
    "Location",
    "experience_name",
    "order_id",
    "Agent",
    "Today",
    "Future Date",
    "Opt Out",
  ];

  if (!showVariables) return null;

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          ml: 0.5,
          backgroundColor: "#10b981",
          color: "#fff",
          width: 28,
          height: 28,
          "&:hover": {
            backgroundColor: "#059669",
          },
          padding: 0,
          minWidth: 28,
        }}
      >
        <Typography
          variant="caption"
          sx={{
            fontSize: "12px",
            fontWeight: "bold",
            fontFamily: "monospace",
          }}
        >
          {"{}"}
        </Typography>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Select Variable
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
            {commonVariables.map((variable) => (
              <Chip
                key={variable}
                label={variable}
                onClick={() => handleVariableSelect(variable)}
                variant="outlined"
                size="small"
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default VariableButton;

