import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography, Divider, Chip, TextField, InputAdornment, IconButton } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DynamicElementRenderer from "../Elements/DynamicElementRenderer";
import VariableButton from "../Elements/VariableButton";

// Memoized wrapper to prevent re-renders of individual elements
const ElementRendererWrapper = memo(({ element, value, onValueChange }) => {
  const handleChange = useCallback(
    (val) => onValueChange(element.elementId, val),
    [element.elementId, onValueChange]
  );

  return (
    <DynamicElementRenderer
      element={element}
      value={value}
      onChange={handleChange}
    />
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.element?.elementId === nextProps.element?.elementId &&
    JSON.stringify(prevProps.value) === JSON.stringify(nextProps.value) &&
    prevProps.onValueChange === nextProps.onValueChange
  );
});

ElementRendererWrapper.displayName = "ElementRendererWrapper";

function SendInteractiveList({ data }) {
  const { components = [], blockName = "Send Interactive List Message" } = data || {};
  
  // Store element values dynamically
  const [elementValues, setElementValues] = useState({});

  // Memoize components reference to prevent unnecessary useEffect triggers
  const componentsRef = React.useRef(components);
  useEffect(() => {
    componentsRef.current = components;
  }, [components]);

  // Initialize values from data - only when components structure changes
  useEffect(() => {
    const initialValues = {};
    components.forEach((component) => {
      component.elements?.forEach((el) => {
        if (el.value !== undefined && el.value !== null) {
          initialValues[el.elementId] = el.value;
        }
      });
    });
    setElementValues(initialValues);
  }, [JSON.stringify(components.map(c => c.componentId))]); // Only trigger when component IDs change

  // Memoize the change handler to prevent re-renders
  const handleValueChange = useCallback((elementId, newValue) => {
    setElementValues((prev) => {
      // Only update if value actually changed
      if (prev[elementId] === newValue) {
        return prev;
      }
      return { ...prev, [elementId]: newValue };
    });

    // Update the data structure directly for persistence
    const compCopy = [...componentsRef.current];
    compCopy.forEach((comp) => {
      comp.elements?.forEach((el) => {
        if (el.elementId === elementId) {
          el.value = newValue;
        }
      });
    });
    if (data) {
      data.components = compCopy;
    }
  }, [data]);

  // Extract header, body, footer from elements
  const headerElement = useMemo(() => {
    return components
      .flatMap((comp) => comp.elements || [])
      .find((el) => el.elementName === "Header");
  }, [components]);

  const bodyElement = useMemo(() => {
    return components
      .flatMap((comp) => comp.elements || [])
      .find((el) => el.elementName === "Body");
  }, [components]);

  const footerElement = useMemo(() => {
    return components
      .flatMap((comp) => comp.elements || [])
      .find((el) => el.elementName === "Footer");
  }, [components]);

  const interactiveListElement = useMemo(() => {
    return components
      .flatMap((comp) => comp.elements || [])
      .find((el) => el.elementType === "INTERACTIVE_LIST");
  }, [components]);

  // Helper to insert variable into field
  const handleVariableInsert = useCallback((elementId, variable) => {
    const currentValue = elementValues[elementId] || "";
    const newValue = currentValue + " " + variable;
    handleValueChange(elementId, newValue);
  }, [elementValues, handleValueChange]);

  // Memoize total rows calculation
  const totalRows = useMemo(() => {
    if (interactiveListElement?.value?.sections) {
      return interactiveListElement.value.sections.reduce(
        (sum, section) => sum + (section.rows?.length || 0),
        0
      );
    }
    return 0;
  }, [elementValues, interactiveListElement]);

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        padding: 2,
        background: "#fff",
        width: 360,
        maxWidth: "90vw",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="subtitle2" fontWeight="bold">
          {blockName}
        </Typography>
        <IconButton size="small">
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Header Field */}
      {headerElement && (
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 0.5, fontWeight: 500, color: "text.primary" }}
          >
            Header
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Add header"
            value={elementValues[headerElement.elementId] || headerElement.value || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 60) {
                handleValueChange(headerElement.elementId, val);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <VariableButton
                    onSelectVariable={(variable) =>
                      handleVariableInsert(headerElement.elementId, variable)
                    }
                    showVariables={headerElement.elementRules?.show_variables !== false}
                  />
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 60 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingRight: 0.5,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            ({(elementValues[headerElement.elementId] || headerElement.value || "").length}/60)
          </Typography>
        </Box>
      )}

      {/* Body Field */}
      {bodyElement && (
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 0.5, fontWeight: 500, color: "text.primary" }}
          >
            Body
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            placeholder="Type a message"
            value={elementValues[bodyElement.elementId] || bodyElement.value || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 1024) {
                handleValueChange(bodyElement.elementId, val);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ alignSelf: "flex-start", mt: 1 }}>
                  <VariableButton
                    onSelectVariable={(variable) =>
                      handleVariableInsert(bodyElement.elementId, variable)
                    }
                    showVariables={bodyElement.elementRules?.show_variables !== false}
                  />
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 1024 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingRight: 0.5,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            ({(elementValues[bodyElement.elementId] || bodyElement.value || "").length}/1024)
          </Typography>
        </Box>
      )}

      {/* Footer Field */}
      {footerElement && (
        <Box sx={{ mb: 2.5 }}>
          <Typography
            variant="caption"
            sx={{ display: "block", mb: 0.5, fontWeight: 500, color: "text.primary" }}
          >
            Footer
          </Typography>
          <TextField
            fullWidth
            size="small"
            placeholder="Add footer"
            value={elementValues[footerElement.elementId] || footerElement.value || ""}
            onChange={(e) => {
              const val = e.target.value;
              if (val.length <= 20) {
                handleValueChange(footerElement.elementId, val);
              }
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <VariableButton
                    onSelectVariable={(variable) =>
                      handleVariableInsert(footerElement.elementId, variable)
                    }
                    showVariables={footerElement.elementRules?.show_variables !== false}
                  />
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: 20 }}
            sx={{
              "& .MuiOutlinedInput-root": {
                paddingRight: 0.5,
              },
            }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            ({(elementValues[footerElement.elementId] || footerElement.value || "").length}/20)
          </Typography>
        </Box>
      )}

      {/* Interactive List Element */}
      {interactiveListElement && (
        <ElementRendererWrapper
          element={interactiveListElement}
          value={
            elementValues[interactiveListElement.elementId] ??
            interactiveListElement.value ??
            { button: "", sections: [] }
          }
          onValueChange={handleValueChange}
        />
      )}

      {/* Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: "#2563eb", top: "20px" }}
      />

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{ background: "#2563eb", top: "20px" }}
      />
    </Box>
  );
}

export default SendInteractiveList;
