import React, { useState } from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography, Divider } from "@mui/material";
import VariableInput from "./VariableInput";
import DynamicElementRenderer from "../Elements/DynamicElementRenderer";

function ConditionNodeV2({ data }) {
  const { components = [], blockName = "Condition" } = data;

  // Store element values dynamically
  const [elementValues, setElementValues] = useState({});

  const handleValueChange = (elementId, newValue) => {
    setElementValues((prev) => ({ ...prev, [elementId]: newValue }));
  };

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
            <DynamicElementRenderer
              key={el.elementId}
              element={el}
              value={elementValues[el.elementId]}
              onChange={(val) => handleValueChange(el.elementId, val)}
            />
          ))}

          <Divider sx={{ my: 1 }} />
        </Box>
      ))}

      {/* Variable input area */}
      <Box mt={1}>
        <Typography variant="subtitle2">Condition Variables</Typography>
        <VariableInput />
      </Box>
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: "#2563eb" }}
      />
    </Box>
  );
}

export default ConditionNodeV2;
