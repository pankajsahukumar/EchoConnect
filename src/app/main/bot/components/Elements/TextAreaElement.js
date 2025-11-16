import React from "react";
import { Box, Typography, TextField } from "@mui/material";

const TextAreaElement = ({ element, value, onChange }) => {
  const {
    elementName,
    elementRules = {},
  } = element;

  const {
    label,
    placeholder,
    max_length,
    show_character_limit = false,
  } = elementRules;

  const currentLength = (value || "").length;
  const maxLength = max_length || 1024;

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
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        multiline
        rows={3}
        value={value || ""}
        onChange={(e) => {
          const newValue = e.target.value;
          if (maxLength && newValue.length <= maxLength) {
            onChange(newValue);
          } else if (maxLength && newValue.length > maxLength) {
            onChange(newValue.substring(0, maxLength));
          } else {
            onChange(newValue);
          }
        }}
        placeholder={placeholder || "Type a message"}
        inputProps={{ maxLength }}
        helperText={
          show_character_limit
            ? `${currentLength}/${maxLength} characters`
            : undefined
        }
        error={currentLength > maxLength}
      />
    </Box>
  );
};

export default TextAreaElement;

