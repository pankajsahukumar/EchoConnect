import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography } from "@mui/material";
import DynamicElementRenderer from "../Elements/DynamicElementRenderer";

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
    prevProps.value === nextProps.value &&
    prevProps.onValueChange === nextProps.onValueChange
  );
});

ElementRendererWrapper.displayName = "ElementRendererWrapper";

function TagNode({ data }) {
  const { components = [], blockName = "Tag Node" } = data;

  // Store element values in local state
  const [elementValues, setElementValues] = useState({});

  // Memoize components reference
  const componentsRef = useRef(components);
  useEffect(() => {
    componentsRef.current = components;
  }, [components]);

  // Initialize with existing element values if present - only when component IDs change
  useEffect(() => {
    const initialValues = {};
    components.forEach((component) => {
      component.elements.forEach((el) => {
        if (el.value !== undefined) initialValues[el.elementId] = el.value;
      });
    });
    setElementValues(initialValues);
  }, [JSON.stringify(components.map(c => c.componentId))]);

  // Memoize the change handler
  const handleValueChange = useCallback((elementId, newValue) => {
    setElementValues((prev) => {
      // Only update if value actually changed
      if (prev[elementId] === newValue) {
        return prev;
      }
      return { ...prev, [elementId]: newValue };
    });

    // Mutate the component structure for saving later
    const compCopy = [...componentsRef.current];
    compCopy.forEach((comp) => {
      comp.elements.forEach((el) => {
        if (el.elementId === elementId) {
          el.value = newValue; // ✅ Attach value directly to the element
        }
      });
    });

    // Optional: If you want real-time node updates in ReactFlow:
    data.components = compCopy;
  }, [data]);

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        padding: 2,
        background: "#fff",
        width: 260,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      }}
    >
      <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
        {blockName}
      </Typography>

      {components.map((component) => (
        <Box key={component.componentId} sx={{ mb: 2 }}>
          <Typography
            variant="body2"
            fontWeight="bold"
            sx={{ mb: 1, color: "#555" }}
          >
            {component.componentName}
          </Typography>

          {component.elements.map((el) => (
            <ElementRendererWrapper
              key={el.elementId}
              element={el}
              value={elementValues[el.elementId] ?? el.value ?? ""}
              onValueChange={handleValueChange}
            />
          ))}
        </Box>
      ))}

      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: "#2563eb" }}
      />
    </Box>
  );
}

export default TagNode;
