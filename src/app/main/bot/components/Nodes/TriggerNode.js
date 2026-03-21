import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import { Handle, Position } from "reactflow";
import { Box, Typography, Chip, TextField } from "@mui/material";
import MessageIcon from "@mui/icons-material/Message";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditAttributesIcon from "@mui/icons-material/EditAttributes";
import TableChartIcon from "@mui/icons-material/TableChart";
import DynamicElementRenderer from "../Elements/DynamicElementRenderer";

const TRIGGER_CONFIG = {
  ON_CHAT_START: {
    label: "On Chat Start",
    icon: <MessageIcon fontSize="small" />,
    color: "#2563eb",
  },
  LEAD_FROM_CTWA_V2: {
    label: "Lead From CTWA",
    icon: <PersonIcon fontSize="small" />,
    color: "#7c3aed",
  },
  ON_ABANDONED_CART_WOOCOMMERCE: {
    label: "On Abandoned Cart",
    icon: <ShoppingCartIcon fontSize="small" />,
    color: "#ea580c",
  },
  ON_AGENT_ASSIGN: {
    label: "On Agent Assign",
    icon: <PersonIcon fontSize="small" />,
    color: "#0891b2",
  },
  ON_ATTRIBUTE_CHANGED: {
    label: "On Attribute Changed",
    icon: <EditAttributesIcon fontSize="small" />,
    color: "#ca8a04",
  },
  ON_NEW_ROW_GOOGLE_SHEET: {
    label: "On New Row Google Sheet",
    icon: <TableChartIcon fontSize="small" />,
    color: "#16a34a",
  },
};

const ElementRendererWrapper = memo(({ element, value, onValueChange }) => {
  const handleChange = useCallback(
    (val) => onValueChange(element.elementId, val),
    [element.elementId, onValueChange]
  );
  return (
    <DynamicElementRenderer element={element} value={value} onChange={handleChange} />
  );
}, (prev, next) => (
  prev.element?.elementId === next.element?.elementId &&
  prev.value === next.value &&
  prev.onValueChange === next.onValueChange
));
ElementRendererWrapper.displayName = "ElementRendererWrapper";

function TriggerNode({ data }) {
  const { blockType = "ON_CHAT_START", components = [], blockName } = data;
  const config = TRIGGER_CONFIG[blockType] || TRIGGER_CONFIG.ON_CHAT_START;

  const [elementValues, setElementValues] = useState({});
  const [keywords, setKeywords] = useState(data.keywords || []);
  const [keywordInput, setKeywordInput] = useState("");

  const componentsRef = useRef(components);
  useEffect(() => { componentsRef.current = components; }, [components]);

  useEffect(() => {
    const initialValues = {};
    components.forEach((comp) => {
      comp.elements?.forEach((el) => {
        if (el.value !== undefined) initialValues[el.elementId] = el.value;
      });
    });
    setElementValues(initialValues);
  }, [JSON.stringify(components.map(c => c.componentId))]);

  const handleValueChange = useCallback((elementId, newValue) => {
    setElementValues((prev) => {
      if (prev[elementId] === newValue) return prev;
      return { ...prev, [elementId]: newValue };
    });
    const compCopy = [...componentsRef.current];
    compCopy.forEach((comp) => {
      comp.elements?.forEach((el) => {
        if (el.elementId === elementId) el.value = newValue;
      });
    });
    data.components = compCopy;
  }, [data]);

  const handleAddKeyword = useCallback(() => {
    const trimmed = keywordInput.trim();
    if (trimmed && !keywords.includes(trimmed)) {
      const updated = [...keywords, trimmed];
      setKeywords(updated);
      data.keywords = updated;
      setKeywordInput("");
    }
  }, [keywordInput, keywords, data]);

  const handleRemoveKeyword = useCallback((kw) => {
    const updated = keywords.filter((k) => k !== kw);
    setKeywords(updated);
    data.keywords = updated;
  }, [keywords, data]);

  return (
    <Box
      sx={{
        border: `2px solid ${config.color}`,
        borderRadius: 2,
        background: "#fff",
        width: 280,
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: config.color,
          color: "#fff",
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {config.icon}
        <Typography variant="subtitle2" fontWeight="bold" color="inherit">
          {blockName || config.label}
        </Typography>
      </Box>

      {/* Body */}
      <Box sx={{ p: 2 }}>
        {/* Dynamic components from sidebar data */}
        {components.map((component) => (
          <Box key={component.componentId} sx={{ mb: 1 }}>
            {component.componentName && (
              <Typography variant="body2" fontWeight="bold" sx={{ mb: 0.5, color: "#555" }}>
                {component.componentName}
              </Typography>
            )}
            {component.elements?.map((el) => (
              <ElementRendererWrapper
                key={el.elementId}
                element={el}
                value={elementValues[el.elementId] ?? el.value ?? ""}
                onValueChange={handleValueChange}
              />
            ))}
          </Box>
        ))}

        {/* Keywords input for ON_CHAT_START */}
        {blockType === "ON_CHAT_START" && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" fontWeight={500} sx={{ mb: 0.5, display: "block" }}>
              Keywords
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
              {keywords.map((kw) => (
                <Chip
                  key={kw}
                  label={kw}
                  size="small"
                  onDelete={() => handleRemoveKeyword(kw)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
            <TextField
              size="small"
              fullWidth
              placeholder="Type keyword & press Enter"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddKeyword();
                }
              }}
            />
          </Box>
        )}

        {/* No specific config needed message */}
        {components.length === 0 && blockType !== "ON_CHAT_START" && (
          <Typography variant="body2" color="text.secondary">
            This trigger activates automatically.
          </Typography>
        )}
      </Box>

      {/* Output Handle only (triggers are start nodes) */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: config.color,
          width: 10,
          height: 10,
          right: -5,
        }}
      />
    </Box>
  );
}

export default TriggerNode;
