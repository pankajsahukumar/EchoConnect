import React from "react";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
} from "@mui/material";

const CheckboxOrRadioElement = ({ element, value, onChange }) => {
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

  const ControlGroup = is_radio ? RadioGroup : FormGroup;
  const ControlComponent = is_radio ? Radio : Checkbox;

  // For checkboxes: handle toggling array values
  const toggleOption = (selectedValue) => {
    if (!Array.isArray(value)) return [selectedValue];
    return value.includes(selectedValue)
      ? value.filter((v) => v !== selectedValue)
      : [...value, selectedValue];
  };

  return (
    <Box sx={{ mb: 1 }}>
      {/* Label */}
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
      <ControlGroup
        row={align === "horizontal"}
        value={is_radio ? value || "" : undefined}
        onChange={(e) => {
          const selectedValue = e.target.value;
          if (is_radio) {
            onChange(selectedValue);
          } else {
            onChange(toggleOption(selectedValue));
          }
        }}
      >
        {options.map((opt) => (
          <FormControlLabel
            key={opt.value}
            value={opt.value}
            control={
              <ControlComponent
                checked={
                  is_radio
                    ? value === opt.value
                    : Array.isArray(value) && value.includes(opt.value)
                }
              />
            }
            label={opt.label}
          />
        ))}
      </ControlGroup>
    </Box>
  );
};

export default CheckboxOrRadioElement;
