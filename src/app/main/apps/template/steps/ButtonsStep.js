import { useState } from "react";
import {
    Box,
    Button,
    Typography,
    Menu,
    MenuItem,
    Paper,
    IconButton,
    TextField,
    Select,
    FormControl,
    InputLabel,
    Alert,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

export default function ButtonsStep({ template, dispatch, updateCurrentTemplate }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const getButtonsComponent = () => template.components?.find((c) => c.type === "BUTTONS") || { type: "BUTTONS", buttons: [] };

    const updateButtons = (newButtons) => {
        const components = template.components ? [...template.components] : [];
        const index = components.findIndex((c) => c.type === "BUTTONS");

        if (newButtons.length === 0) {
            if (index >= 0) components.splice(index, 1);
        } else {
            if (index >= 0) {
                components[index] = { ...components[index], buttons: newButtons };
            } else {
                components.push({ type: "BUTTONS", buttons: newButtons });
            }
        }

        dispatch(updateCurrentTemplate({ components }));
    };

    const handleAddButton = (type) => {
        const currentButtons = getButtonsComponent().buttons || [];
        let newButton = { type, text: "" };

        if (type === "PHONE_NUMBER") {
            newButton = { ...newButton, phoneNumber: "" };
        } else if (type === "URL") {
            newButton = { ...newButton, url: "" };
        }

        updateButtons([...currentButtons, newButton]);
        setAnchorEl(null);
    };

    const handleUpdateButton = (index, field, value) => {
        const currentButtons = [...(getButtonsComponent().buttons || [])];
        currentButtons[index] = { ...currentButtons[index], [field]: value };
        updateButtons(currentButtons);
    };

    const handleDeleteButton = (index) => {
        const currentButtons = [...(getButtonsComponent().buttons || [])];
        currentButtons.splice(index, 1);
        updateButtons(currentButtons);
    };

    const buttons = getButtonsComponent().buttons || [];

    return (
        <Box>
            <Box sx={{ mb: 4, bgcolor: '#fff9e6', p: 2, borderRadius: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                    Create buttons that let customers respond to your message or take action
                </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Button
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    startIcon={<AddIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    disabled={buttons.length >= 3} // WhatsApp limit
                >
                    Add a button
                </Button>
                <Typography variant="caption" color="text.secondary">
                    {buttons.length}/10 buttons
                </Typography>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem disabled sx={{ opacity: 0.7, fontSize: '0.8rem', fontWeight: 600 }}>QUICK REPLY</MenuItem>
                <MenuItem onClick={() => handleAddButton("QUICK_REPLY")}>Custom button</MenuItem>
                <MenuItem onClick={() => handleAddButton("QUICK_REPLY")}>Marketing opt-out</MenuItem>

                <MenuItem disabled sx={{ opacity: 0.7, fontSize: '0.8rem', fontWeight: 600, mt: 1 }}>CALL TO ACTION</MenuItem>
                <MenuItem onClick={() => handleAddButton("URL")}>Visit website</MenuItem>
                <MenuItem onClick={() => handleAddButton("PHONE_NUMBER")}>Call phone number</MenuItem>
            </Menu>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {buttons.map((btn, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <DragIndicatorIcon color="action" />
                            <Typography variant="subtitle2" sx={{ flex: 1 }}>
                                {btn.type === "QUICK_REPLY" ? "Quick Reply" : btn.type === "URL" ? "Visit Website" : "Call Phone Number"}
                            </Typography>
                            <IconButton size="small" onClick={() => handleDeleteButton(index)}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                        <TextField
                            fullWidth
                            size="small"
                            label="Button text"
                            value={btn.text}
                            onChange={(e) => handleUpdateButton(index, "text", e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {btn.type === "URL" && (
                            <TextField
                                fullWidth
                                size="small"
                                label="Website URL"
                                value={btn.url}
                                onChange={(e) => handleUpdateButton(index, "url", e.target.value)}
                            />
                        )}

                        {btn.type === "PHONE_NUMBER" && (
                            <TextField
                                fullWidth
                                size="small"
                                label="Phone number"
                                value={btn.phoneNumber}
                                onChange={(e) => handleUpdateButton(index, "phoneNumber", e.target.value)}
                            />
                        )}
                    </Paper>
                ))}

                {buttons.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                        No buttons added. Click "Add a button" to start.
                    </Typography>
                )}
            </Box>
        </Box>
    );
}
