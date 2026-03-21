import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Divider,
  InputAdornment,
} from "@mui/material";
import SmartButtonIcon from "@mui/icons-material/SmartButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VariableButton from "../Elements/VariableButton";

function SendButtonMessageNode({ data }) {
  const { blockName = "Send Button Message" } = data;

  const [body, setBody] = useState(data.body || "");
  const [footer, setFooter] = useState(data.footer || "");
  const [buttons, setButtons] = useState(
    data.buttons || [
      { id: "btn-1", title: "Option 1" },
      { id: "btn-2", title: "Option 2" },
    ]
  );

  const updateData = useCallback((key, value) => {
    data[key] = value;
  }, [data]);

  const handleVariableInsert = useCallback((variable) => {
    const newBody = body + " " + variable;
    setBody(newBody);
    updateData("body", newBody);
  }, [body, updateData]);

  const addButton = useCallback(() => {
    if (buttons.length >= 3) return;
    const newId = `btn-${Date.now()}`;
    const updated = [...buttons, { id: newId, title: "" }];
    setButtons(updated);
    updateData("buttons", updated);
  }, [buttons, updateData]);

  const removeButton = useCallback((index) => {
    if (buttons.length <= 1) return;
    const updated = buttons.filter((_, i) => i !== index);
    setButtons(updated);
    updateData("buttons", updated);
  }, [buttons, updateData]);

  const updateButton = useCallback((index, title) => {
    const updated = buttons.map((b, i) => (i === index ? { ...b, title } : b));
    setButtons(updated);
    updateData("buttons", updated);
  }, [buttons, updateData]);

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
      <Box sx={{ background: "#dc2626", color: "#fff", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <SmartButtonIcon fontSize="small" />
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {blockName}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={2}
          size="small"
          label="Body"
          placeholder="Message body text..."
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            updateData("body", e.target.value);
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ alignSelf: "flex-start", mt: 1 }}>
                <VariableButton onSelectVariable={handleVariableInsert} showVariables={true} />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Footer (optional)"
          placeholder="Footer text"
          value={footer}
          onChange={(e) => {
            setFooter(e.target.value);
            updateData("footer", e.target.value);
          }}
          inputProps={{ maxLength: 60 }}
          sx={{ mb: 1.5 }}
        />

        <Divider sx={{ my: 1 }} />

        <Typography variant="caption" fontWeight={500} sx={{ display: "block", mb: 1 }}>
          Buttons (max 3) — each button has its own output
        </Typography>

        {buttons.map((button, index) => (
          <Box
            key={button.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              mb: 1,
              position: "relative",
            }}
          >
            <TextField
              size="small"
              fullWidth
              placeholder={`Button ${index + 1} title`}
              value={button.title}
              onChange={(e) => updateButton(index, e.target.value)}
              inputProps={{ maxLength: 20 }}
            />
            <IconButton size="small" onClick={() => removeButton(index)} disabled={buttons.length <= 1}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        {buttons.length < 3 && (
          <IconButton size="small" onClick={addButton} color="primary">
            <AddIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Input handle */}
      <Handle type="target" position={Position.Left} id="input" style={{ background: "#dc2626" }} />

      {/* One output handle per button */}
      {buttons.map((button, index) => {
        const topPercent = 65 + index * 12;
        return (
          <React.Fragment key={button.id}>
            <Handle
              type="source"
              position={Position.Right}
              id={button.id}
              style={{ background: "#10b981", top: `${topPercent}%` }}
            />
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                right: 16,
                top: `${topPercent - 2}%`,
                color: "#10b981",
                fontWeight: 600,
                fontSize: 9,
              }}
            >
              {button.title || `Btn ${index + 1}`}
            </Typography>
          </React.Fragment>
        );
      })}

      {/* Default/fallback handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="default"
        style={{ background: "#94a3b8", top: "95%" }}
      />
      <Typography
        variant="caption"
        sx={{
          position: "absolute",
          right: 16,
          top: "93%",
          color: "#94a3b8",
          fontWeight: 600,
          fontSize: 9,
        }}
      >
        Default
      </Typography>
    </Box>
  );
}

export default SendButtonMessageNode;
