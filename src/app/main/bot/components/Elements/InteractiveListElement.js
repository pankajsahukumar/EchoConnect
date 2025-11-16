import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Handle, Position } from "reactflow";
import { v4 as uuidv4 } from "uuid";
import VariableButton from "./VariableButton";

// Generate unique ID
const generateId = () => {
  return uuidv4();
};

/**
 * Interactive List Element Renderer
 * Redesigned to match the exact UI shown in the image
 */
function InteractiveListElement({ element, value, onChange }) {
  const { elementRules = {}, elementName } = element;
  const maxSections = elementRules?.max_sections || 10;
  const maxItems = elementRules?.max_items || 10;
  const showVariables = elementRules?.show_variables !== false;
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);

  // Initialize state from value or default structure
  const [interactiveData, setInteractiveData] = useState(() => {
    if (value && typeof value === "object") {
      return value;
    }
    return {
      button: elementRules?.sample_value?.button || "",
      sections: elementRules?.sample_value?.sections || [
        {
          id: generateId(),
          title: "",
          rows: [
            {
              id: generateId(),
              title: "",
              description: "",
            },
          ],
        },
      ],
    };
  });

  useEffect(() => {
    if (value && typeof value === "object") {
      const valueStr = JSON.stringify(value);
      const currentStr = JSON.stringify(interactiveData);
      if (valueStr !== currentStr) {
        setInteractiveData(value);
      }
    }
  }, [value]);

  // Notify parent of changes - use ref to prevent cascading updates
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const prevDataRef = useRef(interactiveData);
  useEffect(() => {
    const prevStr = JSON.stringify(prevDataRef.current);
    const currentStr = JSON.stringify(interactiveData);
    if (currentStr !== prevStr && onChangeRef.current) {
      prevDataRef.current = interactiveData;
      onChangeRef.current(interactiveData);
    }
  }, [interactiveData]);

  const updateButton = (newButton) => {
    setInteractiveData((prev) => ({ ...prev, button: newButton }));
  };

  const handleVariableInsert = (field, variable) => {
    const currentValue = interactiveData[field] || "";
    const newValue = currentValue + " " + variable;
    if (field === "button") {
      updateButton(newValue);
    }
  };

  const addSection = () => {
    if (interactiveData.sections.length >= maxSections) {
      alert(`Maximum ${maxSections} sections allowed`);
      return;
    }
    setInteractiveData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: generateId(),
          title: "",
          rows: [
            {
              id: generateId(),
              title: "",
              description: "",
            },
          ],
        },
      ],
    }));
  };

  const removeSection = (sectionIndex) => {
    if (interactiveData.sections.length <= 1) {
      alert("At least one section is required");
      return;
    }
    setInteractiveData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, idx) => idx !== sectionIndex),
    }));
  };

  const updateSectionTitle = (sectionIndex, newTitle) => {
    setInteractiveData((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        title: newTitle,
      };
      return { ...prev, sections: newSections };
    });
  };

  const addRow = (sectionIndex) => {
    const section = interactiveData.sections[sectionIndex];
    if (section.rows.length >= maxItems) {
      alert(`Maximum ${maxItems} rows per section allowed`);
      return;
    }
    setInteractiveData((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        rows: [
          ...newSections[sectionIndex].rows,
          {
            id: generateId(),
            title: "",
            description: "",
          },
        ],
      };
      return { ...prev, sections: newSections };
    });
  };

  const removeRow = (sectionIndex, rowIndex) => {
    const section = interactiveData.sections[sectionIndex];
    if (section.rows.length <= 1) {
      alert("At least one row is required per section");
      return;
    }
    setInteractiveData((prev) => {
      const newSections = [...prev.sections];
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        rows: newSections[sectionIndex].rows.filter((_, idx) => idx !== rowIndex),
      };
      return { ...prev, sections: newSections };
    });
  };

  const updateRow = (sectionIndex, rowIndex, field, newValue) => {
    setInteractiveData((prev) => {
      const newSections = [...prev.sections];
      const newRows = [...newSections[sectionIndex].rows];
      newRows[rowIndex] = {
        ...newRows[rowIndex],
        [field]: newValue,
      };
      newSections[sectionIndex] = {
        ...newSections[sectionIndex],
        rows: newRows,
      };
      return { ...prev, sections: newSections };
    });
  };

  return (
    <Box sx={{ mb: 2 }}>
      {/* List Button Input */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="caption"
          sx={{ display: "block", mb: 0.5, fontWeight: 500, color: "text.primary" }}
        >
          List Button
        </Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Choose your option"
          value={interactiveData.button || ""}
          onChange={(e) => {
            const val = e.target.value;
            if (val.length <= 20) {
              updateButton(val);
            }
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <VariableButton
                  onSelectVariable={(variable) => handleVariableInsert("button", variable)}
                  showVariables={showVariables}
                />
              </InputAdornment>
            ),
          }}
          inputProps={{ maxLength: 20 }}
          sx={{
            "& .MuiOutlinedInput-root": {
              paddingRight: 0.5,
            },
          }}
        />
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
          ({(interactiveData.button || "").length}/20)
        </Typography>
      </Box>

      {/* Sections */}
      {interactiveData.sections.map((section, sectionIndex) => {
        const sectionId = section.id || `section-${sectionIndex}`;
        return (
          <Box key={sectionId} sx={{ mb: 2 }}>
            {/* Section Header - Green Bar */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#10b981",
                color: "#fff",
                padding: "8px 12px",
                borderRadius: "4px",
                mb: 1,
                position: "relative",
              }}
            >
              <Typography
                variant="body2"
                fontWeight="medium"
                sx={{ flexGrow: 1 }}
                onClick={() => {
                  const newTitle = prompt("Edit section title:", section.title || `Section ${sectionIndex + 1}`);
                  if (newTitle !== null) {
                    updateSectionTitle(sectionIndex, newTitle);
                  }
                }}
              >
                {section.title || `Section ${sectionIndex + 1}`}
              </Typography>

              {/* <IconButton
                size="small"
                sx={{
                  color: "#fff",
                  ml: 0.5,
                  mr: 0.5,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                }}
              >
                <DragIndicatorIcon fontSize="small" />
              </IconButton> */}

              <IconButton
                size="small"
                onClick={(e) => {
                  setMenuAnchor(e.currentTarget);
                  setSelectedSectionId(sectionId);
                }}
                sx={{
                  color: "#fff",
                  mr: 0.5,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Section Items - White input-like fields */}
            {section.rows.map((row, rowIndex) => {
              const rowId = row.id || `row-${sectionIndex}-${rowIndex}`;
              const isEditing = editingRowId === rowId;

              return (
                <Box
                  key={rowId}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    position: "relative",
                  }}
                >
                  {/* White input-like field */}
                  <Paper
                    elevation={0}
                    sx={{
                      flexGrow: 1,
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      borderRadius: "4px",
                      padding: "10px 12px",
                      minHeight: 40,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      mr: 1,
                      cursor: "pointer",
                      "&:hover": {
                        borderColor: "#10b981",
                      },
                    }}
                    onClick={() => setEditingRowId(rowId)}
                  >
                    {isEditing ? (
                      <Box>
                        <TextField
                          autoFocus
                          size="small"
                          placeholder="Title"
                          value={row.title || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 24) {
                              updateRow(sectionIndex, rowIndex, "title", val);
                            }
                          }}
                          onBlur={() => setEditingRowId(null)}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              setEditingRowId(null);
                            }
                          }}
                          inputProps={{ maxLength: 24 }}
                          sx={{ mb: 0.5 }}
                          fullWidth
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                        />
                        <TextField
                          size="small"
                          placeholder="Description (optional)"
                          value={row.description || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val.length <= 72) {
                              updateRow(sectionIndex, rowIndex, "description", val);
                            }
                          }}
                          onBlur={() => setEditingRowId(null)}
                          multiline
                          inputProps={{ maxLength: 72 }}
                          fullWidth
                          variant="standard"
                          InputProps={{ disableUnderline: true }}
                        />
                      </Box>
                    ) : (
                      <Box>
                        {row.title && (
                          <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {row.title}
                          </Typography>
                        )}
                        {row.description && (
                          <Typography variant="caption" color="text.secondary">
                            {row.description}
                          </Typography>
                        )}
                        {!row.title && !row.description && (
                          <Typography variant="body2" color="text.secondary">
                            Click to add item
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Paper>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuAnchor(e.currentTarget);
                      setSelectedRowId(rowId);
                    }}
                    sx={{
                      color: "text.secondary",
                      mr: 0.5,
                      "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
                    }}
                  >
                    <MoreVertIcon fontSize="small" />
                  </IconButton>

                  {/* Connection Handle - Green circle */}
                  <Box sx={{ position: "relative", ml: 0.5 }}>
                    <Handle
                      type="source"
                      position={Position.Right}
                      id={rowId}
                      style={{
                        background: "#10b981",
                        border: "2px solid #fff",
                        width: 14,
                        height: 14,
                        right: -7,
                      }}
                    />
                  </Box>
                </Box>
              );
            })}

            {/* Add item button - within section */}
            <Button
              variant="contained"
              size="small"
              startIcon={<AddIcon />}
              onClick={() => addRow(sectionIndex)}
              disabled={section.rows.length >= maxItems}
              sx={{
                backgroundColor: "#10b981",
                color: "#fff",
                textTransform: "none",
                mt: 1,
                mb: 2,
                "&:hover": {
                  backgroundColor: "#059669",
                },
                "&:disabled": {
                  backgroundColor: "#d1fae5",
                  color: "#6ee7b7",
                },
              }}
            >
              Add item
            </Button>
          </Box>
        );
      })}

      {/* Add Section button - at the bottom */}
      <Button
        variant="contained"
        size="medium"
        startIcon={<AddIcon />}
        onClick={addSection}
        disabled={interactiveData.sections.length >= maxSections}
        fullWidth
        sx={{
          backgroundColor: "#10b981",
          color: "#fff",
          textTransform: "none",
          mt: 1,
          "&:hover": {
            backgroundColor: "#059669",
          },
          "&:disabled": {
            backgroundColor: "#d1fae5",
            color: "#6ee7b7",
          },
        }}
      >
        Add Section
      </Button>

      {/* Menu for row options */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor) && selectedRowId !== null}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedRowId(null);
        }}
      >
        {selectedRowId && (() => {
          const selectedRow = interactiveData.sections
            .flatMap((s, si) => s.rows.map((r, ri) => ({ ...r, sectionIndex: si, rowIndex: ri })))
            .find((r) => r.id === selectedRowId);

          if (!selectedRow) return null;

          const { sectionIndex, rowIndex } = selectedRow;

          return (
            <>
              <MenuItem
                onClick={() => {
                  setEditingRowId(selectedRowId);
                  setMenuAnchor(null);
                  setSelectedRowId(null);
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  const newDesc = prompt(
                    "Edit row description:",
                    selectedRow?.description || ""
                  );
                  if (newDesc !== null && sectionIndex >= 0 && rowIndex >= 0) {
                    updateRow(sectionIndex, rowIndex, "description", newDesc);
                  }
                  setMenuAnchor(null);
                  setSelectedRowId(null);
                }}
              >
                Edit Description
              </MenuItem>
              {interactiveData.sections[sectionIndex]?.rows.length > 1 && (
                <MenuItem
                  onClick={() => {
                    removeRow(sectionIndex, rowIndex);
                    setMenuAnchor(null);
                    setSelectedRowId(null);
                  }}
                  sx={{ color: "error.main" }}
                >
                  Delete
                </MenuItem>
              )}
            </>
          );
        })()}
      </Menu>

      {/* Menu for section options */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor) && selectedSectionId !== null && selectedRowId === null}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedSectionId(null);
        }}
      >
        {selectedSectionId && (() => {
          const sectionIndex = interactiveData.sections.findIndex(
            (s) => (s.id || `section-${interactiveData.sections.indexOf(s)}`) === selectedSectionId
          );

          if (sectionIndex < 0) return null;

          return (
            <>
              <MenuItem
                onClick={() => {
                  const newTitle = prompt(
                    "Edit section title:",
                    interactiveData.sections[sectionIndex]?.title || `Section ${sectionIndex + 1}`
                  );
                  if (newTitle !== null) {
                    updateSectionTitle(sectionIndex, newTitle);
                  }
                  setMenuAnchor(null);
                  setSelectedSectionId(null);
                }}
              >
                Edit Section Title
              </MenuItem>
              {interactiveData.sections.length > 1 && (
                <MenuItem
                  onClick={() => {
                    removeSection(sectionIndex);
                    setMenuAnchor(null);
                    setSelectedSectionId(null);
                  }}
                  sx={{ color: "error.main" }}
                >
                  Delete Section
                </MenuItem>
              )}
            </>
          );
        })()}
      </Menu>
    </Box>
  );
}

export default InteractiveListElement;
