import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function SendTemplateNode({ data }) {
  const { blockName = "Send Template Message" } = data;

  const [templateName, setTemplateName] = useState(data.templateName || "");
  const [language, setLanguage] = useState(data.language || "en");
  const [variables, setVariables] = useState(data.variables || [{ key: "1", value: "" }]);

  const updateData = useCallback((key, value) => {
    data[key] = value;
  }, [data]);

  const addVariable = useCallback(() => {
    const nextKey = String(variables.length + 1);
    const updated = [...variables, { key: nextKey, value: "" }];
    setVariables(updated);
    updateData("variables", updated);
  }, [variables, updateData]);

  const removeVariable = useCallback((index) => {
    const updated = variables.filter((_, i) => i !== index);
    setVariables(updated);
    updateData("variables", updated);
  }, [variables, updateData]);

  const updateVariable = useCallback((index, value) => {
    const updated = variables.map((v, i) => (i === index ? { ...v, value } : v));
    setVariables(updated);
    updateData("variables", updated);
  }, [variables, updateData]);

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        background: "#fff",
        width: 300,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ background: "#7c3aed", color: "#fff", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <DescriptionIcon fontSize="small" />
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {blockName}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Template Name"
          placeholder="e.g. order_confirmation"
          value={templateName}
          onChange={(e) => {
            setTemplateName(e.target.value);
            updateData("templateName", e.target.value);
          }}
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Language Code"
          placeholder="en"
          value={language}
          onChange={(e) => {
            setLanguage(e.target.value);
            updateData("language", e.target.value);
          }}
          sx={{ mb: 1.5 }}
        />

        <Divider sx={{ my: 1 }} />

        <Typography variant="caption" fontWeight={500} sx={{ display: "block", mb: 0.5 }}>
          Template Variables
        </Typography>
        {variables.map((variable, index) => (
          <Box key={index} sx={{ display: "flex", gap: 0.5, mb: 0.5, alignItems: "center" }}>
            <Typography variant="caption" sx={{ minWidth: 30, color: "#666" }}>
              {`{{${variable.key}}}`}
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder={`Value for {{${variable.key}}}`}
              value={variable.value}
              onChange={(e) => updateVariable(index, e.target.value)}
            />
            <IconButton size="small" onClick={() => removeVariable(index)} disabled={variables.length <= 1}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <IconButton size="small" onClick={addVariable} color="primary">
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      <Handle type="target" position={Position.Left} id="input" style={{ background: "#7c3aed" }} />
      <Handle type="source" position={Position.Right} id="output" style={{ background: "#7c3aed" }} />
    </Box>
  );
}

export default SendTemplateNode;
