import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

export default function TemplateDialog({ open, onClose, onSend }) {
    const [name, setName] = useState("order_update");
    const [lang, setLang] = useState("en_US");
    const [var1, setVar1] = useState("Pankaj");
    const [submitting, setSubmitting] = useState(false);
  
    const handleSend = async () => {
      setSubmitting(true);
      try {
        await onSend({
          name,
          language: { code: lang },
          components: [
            { type: "body", parameters: [{ type: "text", text: var1 }] },
          ],
        });
        onClose();
      } finally {
        setSubmitting(false);
      }
    };
  
    return (
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Send WhatsApp Template</DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Template Name"
            fullWidth
            sx={{ mt: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Language Code"
            fullWidth
            sx={{ mt: 2 }}
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          />
          <TextField
            label="Body Var 1"
            fullWidth
            sx={{ mt: 2 }}
            value={var1}
            onChange={(e) => setVar1(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSend}
            variant="contained"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : null}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  