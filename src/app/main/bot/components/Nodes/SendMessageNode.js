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
  InputAdornment,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import VariableButton from "../Elements/VariableButton";

function SendMessageNode({ data }) {
  const { blockName = "Send Message" } = data;

  const [messageType, setMessageType] = useState(data.messageType || "text");
  const [text, setText] = useState(data.text || "");
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || "");
  const [caption, setCaption] = useState(data.caption || "");

  const updateData = useCallback((key, value) => {
    data[key] = value;
  }, [data]);

  const handleVariableInsert = useCallback((variable) => {
    const newText = text + " " + variable;
    setText(newText);
    updateData("text", newText);
  }, [text, updateData]);

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
      <Box sx={{ background: "#2563eb", color: "#fff", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <ChatIcon fontSize="small" />
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {blockName}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel>Message Type</InputLabel>
          <Select
            value={messageType}
            label="Message Type"
            onChange={(e) => {
              setMessageType(e.target.value);
              updateData("messageType", e.target.value);
            }}
          >
            <MenuItem value="text">Text</MenuItem>
            <MenuItem value="image">Image</MenuItem>
            <MenuItem value="document">Document</MenuItem>
            <MenuItem value="video">Video</MenuItem>
            <MenuItem value="audio">Audio</MenuItem>
          </Select>
        </FormControl>

        {messageType === "text" ? (
          <TextField
            fullWidth
            multiline
            rows={3}
            size="small"
            label="Message"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              updateData("text", e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end" sx={{ alignSelf: "flex-start", mt: 1 }}>
                  <VariableButton
                    onSelectVariable={handleVariableInsert}
                    showVariables={true}
                  />
                </InputAdornment>
              ),
            }}
          />
        ) : (
          <>
            <TextField
              fullWidth
              size="small"
              label="Media URL"
              placeholder="https://example.com/file.jpg"
              value={mediaUrl}
              onChange={(e) => {
                setMediaUrl(e.target.value);
                updateData("mediaUrl", e.target.value);
              }}
              sx={{ mb: 1 }}
            />
            <TextField
              fullWidth
              size="small"
              label="Caption (optional)"
              placeholder="Add a caption..."
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                updateData("caption", e.target.value);
              }}
            />
          </>
        )}
      </Box>

      <Handle type="target" position={Position.Left} id="input" style={{ background: "#2563eb" }} />
      <Handle type="source" position={Position.Right} id="output" style={{ background: "#2563eb" }} />
    </Box>
  );
}

export default SendMessageNode;
