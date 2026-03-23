import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useState } from "react";
import templates from "../../../../../../template.json";
import TemplatePreview from "../../TemplateMessageComponent/TemplatePreview";
import TemplateForm from "../../TemplateMessageComponent/TemplateForm";

export default function TemplateDialog({ open, onClose, onSend }) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleSendClick = (template) => {
    // instead of sending directly, open second dialog
    setSelectedTemplate(template);
  };

  const handleFinalSend = async (formValues) => {
    if (!selectedTemplate) return;
    setSubmitting(true);
    try {
      await onSend({
        name: selectedTemplate.name,
        language: { code: selectedTemplate.language || "en_US" },
        components: [
          {
            type: "body",
            parameters: formValues.map((val) => ({
              type: "text",
              text: val,
            })),
          },
        ],
      });
      setSelectedTemplate(null);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* First dialog: list of templates */}
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Select WhatsApp Template</DialogTitle>
        <DialogContent dividers>
          {templates.map((temp) => (
            <div
              key={temp.name}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                marginBottom: "16px",
                padding: "12px",
                position: "relative",
              }}
            >
              {/* Template Info */}
              <div style={{ marginBottom: "8px" }}>
                <strong>{temp.name}</strong> <br />
                <small>
                  {temp.category} • {temp.language} • Created by {temp.createdBy}
                </small>
              </div>

              {/* Preview Component */}
              <TemplatePreview template={temp} />

              {/* Send Button */}
              <div style={{ marginTop: "12px", textAlign: "right" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleSendClick(temp)}
                >
                  Use This Template
                </Button>
              </div>
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Second dialog: preview + form */}
      <Dialog open={!!selectedTemplate} onClose={() => setSelectedTemplate(null)} fullWidth maxWidth="sm">
        <DialogTitle>Fill Template Variables</DialogTitle>
        <DialogContent dividers>
          {selectedTemplate && (
            <>
              <TemplatePreview template={selectedTemplate} />
              <div style={{ marginTop: "16px" }}>
                <TemplateForm
                  template={selectedTemplate}
                  onSubmit={handleFinalSend}
                  loading={submitting}
                />
              </div>
            </>
          )}
        </DialogContent>
        <DialogActions>
        <Button onClick={() => setSelectedTemplate(null)} color="primary">
            Send Later
          </Button>
          <Button onClick={() => setSelectedTemplate(null)} color="secondary">
            Send Now
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
