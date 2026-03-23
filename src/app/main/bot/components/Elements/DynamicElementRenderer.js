// DynamicElementRenderer.jsx
import React, { memo } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Typography,
} from "@mui/material";
import { Handle, Position } from "reactflow";
import CheckboxOrRadioElement from "./CheckboxOrRadioElement";
import TextBoxElement from "./TextBoxElement";
import TextAreaElement from "./TextAreaElement";
import InteractiveListElement from "./InteractiveListElement";

const DynamicElementRenderer = memo(({ element, value, onChange }) => {
  if (!element) return null;

  const { elementType, elementRules, elementName } = element;
  switch (elementType) {
    // case "DROPDOWN":
    //   return (
    //     <TextField
    //       select
    //       label={elementRules?.label || elementName}
    //       placeholder={elementRules?.placeholder}
    //       size="small"
    //       fullWidth
    //       value={value || ""}
    //       onChange={(e) => onChange(e.target.value)}
    //       sx={{ mb: 1 }}
    //     >
    //       {(elementRules?.list || []).map((option) => (
    //         <MenuItem key={option.value} value={option.value}>
    //           {option.label}
    //         </MenuItem>
    //       ))}
    //     </TextField>
    //   );

    case "CHECKBOX":
      return (
       <CheckboxOrRadioElement element={element} value={value} onChange={onChange} />
      );

    case "TEXTAREA":
      return (
        <TextAreaElement element={element} value={value} onChange={onChange} />
      );

    case "CLEARABLE_INPUT":
      return (
        <TextBoxElement element={element} value={value} onChange={onChange} />
      );

    case "INTERACTIVE_LIST":
      return (
        <InteractiveListElement element={element} value={value} onChange={onChange} />
      );

    case "BUTTON_REPEAT":
      if (elementRules?.disable_render) {
        // Don't render buttons that are hidden connections
        return null;
      }
      return (
        <Box position="relative">
          <Button
            variant="outlined"
            color="success"
            fullWidth
            sx={{
              justifyContent: "flex-start",
              textTransform: "none",
              borderRadius: "4px"
            }}
          >
            {elementRules?.label || elementName}
          </Button>
          {elementRules?.is_connector && (
            <Handle
              type="source"
              position={Position.Right}
              id={element.value || element.uniqueId || "connection"}
              style={{
                top: "50%",
                transform: "translateY(-50%)",
                right: -6,
                background: "#10b981",
                zIndex: 10,
              }}
            />
          )}
        </Box>
      );

    default:
      return <TextBoxElement element={element} value={value} onChange={onChange} />;
  }
}, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return (
    prevProps.element?.elementId === nextProps.element?.elementId &&
    prevProps.element?.elementType === nextProps.element?.elementType &&
    prevProps.value === nextProps.value &&
    prevProps.onChange === nextProps.onChange
  );
});

DynamicElementRenderer.displayName = "DynamicElementRenderer";

export default DynamicElementRenderer;
