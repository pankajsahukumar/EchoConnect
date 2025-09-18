import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

const TemplateForm = ({ template }) => {
  const [values, setValues] = useState({});
  const [headerMedia, setHeaderMedia] = useState(null);
  const [headerMode, setHeaderMode] = useState("upload"); // upload | url

  let inputFields = [];
  template.components.forEach((comp) => {
    if (comp.type !== "HEADER" && comp.example) {
      Object.entries(comp.example).forEach(([key, val]) => {
        inputFields.push({ key, example: val, type: comp.type });
      });
    }
  });

  const headerComp = template.components.find((c) => c.type === "HEADER");

  const handleChange = (fieldKey, value) => {
    setValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleHeaderChange = (fileOrText) => {
    setHeaderMedia(fileOrText);
  };

  const handleSubmit = () => {
    const variables = inputFields.map((f) => ({
      type: "text",
      text: values[f.key] || "",
    }));

    let headerVariable = null;
    if (headerComp) {
      if (headerComp.format === "TEXT") {
        headerVariable = { type: "text", text: headerMedia || "" };
      } else if (["IMAGE", "VIDEO", "DOCUMENT"].includes(headerComp.format)) {
        if (headerMode === "url") {
          headerVariable = {
            type: headerComp.format.toLowerCase(),
            link: headerMedia, // url string
          };
        } else {
          headerVariable = {
            type: headerComp.format.toLowerCase(),
            file: headerMedia, // File object
          };
        }
      }
    }

    const payload = {
      messageType: "template",
      templateMessage: {
        id: template.id,
        variables,
        headerVariable,
        cardVariables: [],
      },
    };

    console.log("Final Payload:", payload);
  };

  if (inputFields.length < 1) return null;

  return (
    <div>
          <Typography variant="h6" gutterBottom>
            Fill Template Variables
          </Typography>

          {headerComp && (
            <Box mt={3}>
              {headerComp.format === "TEXT" && (
                <TextField
                  fullWidth
                  size="small"
                  label="Header Text"
                  placeholder={headerComp.example?.text || ""}
                  value={headerMedia || ""}
                  onChange={(e) => handleHeaderChange(e.target.value)}
                  style={{ marginTop: "8px" }}
                />
              )}

              {["IMAGE", "VIDEO", "DOCUMENT"].includes(headerComp.format) && (
                <Box>

                  {headerMode === "upload" ? (
                    <UploadButton
                      label={`Upload ${headerComp.format}`}
                      accept={
                        headerComp.format === "IMAGE"
                          ? "image/png, image/jpeg"
                          : headerComp.format === "VIDEO"
                          ? "video/mp4,video/mov"
                          : ".pdf"
                      }
                      onFileSelect={handleHeaderChange}
                    />
                  ) : (
                    <TextField
                      fullWidth
                      size="small"
                      label="Enter File URL"
                      value={headerMedia || ""}
                      onChange={(e) => handleHeaderChange(e.target.value)}
                    />
                  )}
                </Box>
              )}
            </Box>
          )}

          {inputFields.map((field) => (
            <Box key={field.key} mt={2}>
              <TextField
                fullWidth
                size="small"
                label={`{{${field.key}}}`}
                placeholder={field.example}
                value={values[field.key] || ""}
                onChange={(e) => handleChange(field.key, e.target.value)}
              />
            </Box>
          ))}
    </div>
  );
};

export default TemplateForm;

// Reusable UploadButton
const UploadButton = ({ label, accept, onFileSelect }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    onFileSelect(f);
  };

  return (
    <Box mt={2}>
      <Button
        variant="contained"
        component="label"
        style={{ backgroundColor: "#5a4fcf" }}
      >
        {label}
        <input type="file" hidden accept={accept} onChange={handleChange} />
      </Button>
      {file && (
        <Typography
          variant="body2"
          color="text.secondary"
          style={{ marginTop: "8px" }}
        >
          Selected: {file.name}
        </Typography>
      )}
    </Box>
  );
};
