import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography, TextField, Chip } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

function BroadcastListNode({ data }) {
  const { blockName = "Add to Broadcast List" } = data;

  const [lists, setLists] = useState(data.lists || []);
  const [listInput, setListInput] = useState("");

  const handleAddList = useCallback(() => {
    const trimmed = listInput.trim();
    if (trimmed && !lists.includes(trimmed)) {
      const updated = [...lists, trimmed];
      setLists(updated);
      data.lists = updated;
      setListInput("");
    }
  }, [listInput, lists, data]);

  const handleRemoveList = useCallback((item) => {
    const updated = lists.filter((l) => l !== item);
    setLists(updated);
    data.lists = updated;
  }, [lists, data]);

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
      <Box sx={{ background: "#7c3aed", color: "#fff", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <NotificationsIcon fontSize="small" />
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {blockName}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
          {lists.map((item) => (
            <Chip
              key={item}
              label={item}
              size="small"
              onDelete={() => handleRemoveList(item)}
              color="secondary"
              variant="outlined"
            />
          ))}
        </Box>
        <TextField
          fullWidth
          size="small"
          placeholder="Type list name & press Enter"
          value={listInput}
          onChange={(e) => setListInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddList();
            }
          }}
        />
      </Box>

      <Handle type="target" position={Position.Left} id="input" style={{ background: "#7c3aed" }} />
      <Handle type="source" position={Position.Right} id="output" style={{ background: "#7c3aed" }} />
    </Box>
  );
}

export default BroadcastListNode;
