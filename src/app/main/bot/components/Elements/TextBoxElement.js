import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { Handle, Position } from "reactflow";

const TextBoxElement = ({ element, value, onChange }) => {
    const {
        elementName,
        elementRules = {},
      } = element;
    
      const {
        label,
        options = [],
        is_radio = false,
        align = "vertical",
      } = elementRules;
  return (
    <Box sx={{ mb: 1 }}>
         {label && (
        <Typography
          variant="subtitle2"
          fontWeight={500}
          gutterBottom
          sx={{ color: "text.secondary" }}
        >
          {label || elementName}
        </Typography>
      )}
    <TextField fullWidth variant="outlined" size="small" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    <Handle
            type="source"
            position={Position.Right}
            id="input2"
            style={{ background: "#2563eb" }}
          />
    </Box>
  );
};

export default TextBoxElement;
