import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography, TextField } from "@mui/material";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import VariableButton from "../Elements/VariableButton";
import { InputAdornment } from "@mui/material";

function UpdateAttributeNode({ data }) {
  const { blockName = "Update Attribute" } = data;

  const [attributeName, setAttributeName] = useState(data.attributeName || "");
  const [attributeValue, setAttributeValue] = useState(data.attributeValue || "");

  const updateData = useCallback((key, value) => {
    data[key] = value;
  }, [data]);

  const handleVariableInsert = useCallback((variable) => {
    const newVal = attributeValue + " " + variable;
    setAttributeValue(newVal);
    updateData("attributeValue", newVal);
  }, [attributeValue, updateData]);

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        background: "#fff",
        width: 260,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ background: "#ca8a04", color: "#fff", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <EditAttributesIcon fontSize="small" />
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {blockName}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Attribute Name"
          placeholder="e.g. customer_tier"
          value={attributeName}
          onChange={(e) => {
            setAttributeName(e.target.value);
            updateData("attributeName", e.target.value);
          }}
          sx={{ mb: 1.5 }}
        />
        <TextField
          fullWidth
          size="small"
          label="Attribute Value"
          placeholder="e.g. premium"
          value={attributeValue}
          onChange={(e) => {
            setAttributeValue(e.target.value);
            updateData("attributeValue", e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <VariableButton onSelectVariable={handleVariableInsert} showVariables={true} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Handle type="target" position={Position.Left} id="input" style={{ background: "#ca8a04" }} />
      <Handle type="source" position={Position.Right} id="output" style={{ background: "#ca8a04" }} />
    </Box>
  );
}

export default UpdateAttributeNode;
