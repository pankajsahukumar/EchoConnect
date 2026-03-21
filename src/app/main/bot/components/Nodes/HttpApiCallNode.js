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
  IconButton,
  Divider,
} from "@mui/material";
import HttpIcon from "@mui/icons-material/Http";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

function HttpApiCallNode({ data }) {
  const { blockName = "HTTP API Call" } = data;

  const [url, setUrl] = useState(data.url || "");
  const [method, setMethod] = useState(data.method || "GET");
  const [authToken, setAuthToken] = useState(data.authToken || "");
  const [body, setBody] = useState(data.body || "");
  const [headers, setHeaders] = useState(data.headers || [{ key: "", value: "" }]);
  const [saveResponseTo, setSaveResponseTo] = useState(data.saveResponseTo || "");

  const updateData = useCallback((key, value) => {
    data[key] = value;
  }, [data]);

  const addHeader = useCallback(() => {
    const updated = [...headers, { key: "", value: "" }];
    setHeaders(updated);
    updateData("headers", updated);
  }, [headers, updateData]);

  const removeHeader = useCallback((index) => {
    const updated = headers.filter((_, i) => i !== index);
    setHeaders(updated);
    updateData("headers", updated);
  }, [headers, updateData]);

  const updateHeader = useCallback((index, field, value) => {
    const updated = headers.map((h, i) => (i === index ? { ...h, [field]: value } : h));
    setHeaders(updated);
    updateData("headers", updated);
  }, [headers, updateData]);

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        background: "#fff",
        width: 320,
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ background: "#059669", color: "#fff", px: 2, py: 1, display: "flex", alignItems: "center", gap: 1 }}>
        <HttpIcon fontSize="small" />
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {blockName}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
          <InputLabel>Method</InputLabel>
          <Select
            value={method}
            label="Method"
            onChange={(e) => {
              setMethod(e.target.value);
              updateData("method", e.target.value);
            }}
          >
            <MenuItem value="GET">GET</MenuItem>
            <MenuItem value="POST">POST</MenuItem>
            <MenuItem value="PUT">PUT</MenuItem>
            <MenuItem value="DELETE">DELETE</MenuItem>
            <MenuItem value="PATCH">PATCH</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          size="small"
          label="URL"
          placeholder="https://api.example.com/endpoint"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            updateData("url", e.target.value);
          }}
          sx={{ mb: 1.5 }}
        />

        <TextField
          fullWidth
          size="small"
          label="Auth Token (optional)"
          placeholder="Bearer xxxxxxx"
          value={authToken}
          onChange={(e) => {
            setAuthToken(e.target.value);
            updateData("authToken", e.target.value);
          }}
          sx={{ mb: 1.5 }}
        />

        {/* Headers */}
        <Typography variant="caption" fontWeight={500} sx={{ display: "block", mb: 0.5 }}>
          Headers
        </Typography>
        {headers.map((header, index) => (
          <Box key={index} sx={{ display: "flex", gap: 0.5, mb: 0.5 }}>
            <TextField
              size="small"
              placeholder="Key"
              value={header.key}
              onChange={(e) => updateHeader(index, "key", e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              size="small"
              placeholder="Value"
              value={header.value}
              onChange={(e) => updateHeader(index, "value", e.target.value)}
              sx={{ flex: 1 }}
            />
            <IconButton size="small" onClick={() => removeHeader(index)} disabled={headers.length <= 1}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <IconButton size="small" onClick={addHeader} color="primary">
          <AddIcon fontSize="small" />
        </IconButton>

        {(method === "POST" || method === "PUT" || method === "PATCH") && (
          <>
            <Divider sx={{ my: 1 }} />
            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Request Body (JSON)"
              placeholder='{"key": "value"}'
              value={body}
              onChange={(e) => {
                setBody(e.target.value);
                updateData("body", e.target.value);
              }}
              sx={{ mb: 1.5 }}
            />
          </>
        )}

        <Divider sx={{ my: 1 }} />
        <TextField
          fullWidth
          size="small"
          label="Save response to variable"
          placeholder="api_response"
          value={saveResponseTo}
          onChange={(e) => {
            setSaveResponseTo(e.target.value);
            updateData("saveResponseTo", e.target.value);
          }}
        />
      </Box>

      <Handle type="target" position={Position.Left} id="input" style={{ background: "#059669" }} />

      {/* Success handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="success"
        style={{ background: "#10b981", top: "40%" }}
      />
      <Typography
        variant="caption"
        sx={{ position: "absolute", right: 16, top: "37%", color: "#10b981", fontWeight: 600, fontSize: 10 }}
      >
        Success
      </Typography>

      {/* Failure handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="failure"
        style={{ background: "#ef4444", top: "60%" }}
      />
      <Typography
        variant="caption"
        sx={{ position: "absolute", right: 16, top: "57%", color: "#ef4444", fontWeight: 600, fontSize: 10 }}
      >
        Failure
      </Typography>
    </Box>
  );
}

export default HttpApiCallNode;
