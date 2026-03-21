import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

function SleepDelayNode({ data }) {
  const { blockName = "Sleep / Delay" } = data;

  const [duration, setDuration] = useState(data.duration || 5);
  const [unit, setUnit] = useState(data.unit || "seconds");

  const updateData = useCallback((key, value) => {
    data[key] = value;
  }, [data]);

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        background: "#fff",
        width: 240,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ background: "#ea580c", color: "#fff", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <HourglassEmptyIcon fontSize="small" />
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {blockName}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Duration"
          value={duration}
          onChange={(e) => {
            const val = Math.max(1, parseInt(e.target.value) || 1);
            setDuration(val);
            updateData("duration", val);
          }}
          inputProps={{ min: 1 }}
          sx={{ mb: 1.5 }}
        />
        <FormControl fullWidth size="small">
          <InputLabel>Unit</InputLabel>
          <Select
            value={unit}
            label="Unit"
            onChange={(e) => {
              setUnit(e.target.value);
              updateData("unit", e.target.value);
            }}
          >
            <MenuItem value="seconds">Seconds</MenuItem>
            <MenuItem value="minutes">Minutes</MenuItem>
            <MenuItem value="hours">Hours</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
          Wait {duration} {unit} before continuing
        </Typography>
      </Box>

      <Handle type="target" position={Position.Left} id="input" style={{ background: "#ea580c" }} />
      <Handle type="source" position={Position.Right} id="output" style={{ background: "#ea580c" }} />
    </Box>
  );
}

export default SleepDelayNode;
