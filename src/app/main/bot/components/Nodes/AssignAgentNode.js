import React, { useState, useCallback } from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography, TextField } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

function AssignAgentNode({ data }) {
  const { blockName = "Assign Agent" } = data;

  const [agentId, setAgentId] = useState(data.agentId || "");
  const [teamId, setTeamId] = useState(data.teamId || "");

  const updateData = useCallback((key, value) => {
    data[key] = value;
  }, [data]);

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
      <Box sx={{ background: "#0891b2", color: "#fff", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <PersonIcon fontSize="small" />
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {blockName}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <TextField
          fullWidth
          size="small"
          label="Agent ID"
          placeholder="Enter agent ID or email"
          value={agentId}
          onChange={(e) => {
            setAgentId(e.target.value);
            updateData("agentId", e.target.value);
          }}
          sx={{ mb: 1.5 }}
        />
        <TextField
          fullWidth
          size="small"
          label="Team ID (optional)"
          placeholder="Enter team ID"
          value={teamId}
          onChange={(e) => {
            setTeamId(e.target.value);
            updateData("teamId", e.target.value);
          }}
        />
      </Box>

      <Handle type="target" position={Position.Left} id="input" style={{ background: "#0891b2" }} />
      <Handle type="source" position={Position.Right} id="output" style={{ background: "#0891b2" }} />
    </Box>
  );
}

export default AssignAgentNode;
