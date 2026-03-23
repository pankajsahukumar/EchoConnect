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
    Alert,
    ListItemText,
    Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ReplyIcon from "@mui/icons-material/Reply";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PhoneIcon from "@mui/icons-material/Phone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

export default function ButtonsStep({ template, dispatch, updateCurrentTemplate }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const getButtonsComponent = () =>
        template.components?.find((c) => c.type === "BUTTONS") || {
            type: "BUTTONS",
            buttons: [],
        };

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

    const handleAddButton = (type, subType) => {
        const currentButtons = getButtonsComponent().buttons || [];
        let newButton = { type, text: "" };

        if (type === "PHONE_NUMBER") {
            newButton = { ...newButton, phoneNumber: "" };
        } else if (type === "URL") {
            newButton = { ...newButton, url: "" };
        } else if (subType === "MARKETING_OPT_OUT") {
            newButton = { ...newButton, text: "Stop promotions" };
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

    const getButtonTypeLabel = (btn) => {
        switch (btn.type) {
            case "QUICK_REPLY":
                return "Quick Reply";
            case "URL":
                return "Visit Website";
            case "PHONE_NUMBER":
                return "Call Phone Number";
            case "WHATSAPP_FLOW":
                return "WhatsApp Flow";
            default:
                return btn.type;
        }
    };

    const getButtonIcon = (btn) => {
        switch (btn.type) {
            case "QUICK_REPLY":
                return <ReplyIcon fontSize="small" />;
            case "URL":
                return <OpenInNewIcon fontSize="small" />;
            case "PHONE_NUMBER":
                return <PhoneIcon fontSize="small" />;
            case "WHATSAPP_FLOW":
                return <WhatsAppIcon fontSize="small" />;
            default:
                return null;
        }
    };

    return (
        <Box>
            {/* WhatsApp Flows Banner */}
            <Alert
                severity="info"
                sx={{ mb: 3, bgcolor: "#e8f5e9", border: "1px solid #c8e6c9" }}
                action={
                    <Button color="inherit" size="small" variant="outlined">
                        Learn More
                    </Button>
                }
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Create engaging customer interactions with WhatsApp Flows
                </Typography>
                <Typography variant="caption">
                    WhatsApp Flows makes customer interactions seamless and efficient, enhancing appointment bookings and signups.
                </Typography>
            </Alert>

            {/* Buttons Header */}
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                Buttons
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
                Create buttons that let customers respond to your message or take action
            </Typography>

            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 2 }}>
                <Button
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    startIcon={<AddIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    disabled={buttons.length >= 10}
                    sx={{ textTransform: "none" }}
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
                PaperProps={{ sx: { minWidth: 220 } }}
            >
                <MenuItem disabled sx={{ opacity: 0.7, fontSize: "0.75rem", fontWeight: 700, letterSpacing: 0.5 }}>
                    QUICK REPLY
                </MenuItem>
                <MenuItem onClick={() => handleAddButton("QUICK_REPLY", "MARKETING_OPT_OUT")}>
                    <ListItemText
                        primary="Marketing opt-out"
                        secondary={<Typography variant="caption" color="success.main">Recommended</Typography>}
                    />
                </MenuItem>
                <MenuItem onClick={() => handleAddButton("QUICK_REPLY")}>
                    <ListItemText primary="Custom button" />
                </MenuItem>

                <Divider sx={{ my: 1 }} />

                <MenuItem disabled sx={{ opacity: 0.7, fontSize: "0.75rem", fontWeight: 700, letterSpacing: 0.5 }}>
                    CALL TO ACTION
                </MenuItem>
                <MenuItem onClick={() => handleAddButton("URL")}>
                    <ListItemText
                        primary="Visit website"
                        secondary={<Typography variant="caption" color="text.secondary">2 buttons maximum</Typography>}
                    />
                </MenuItem>
                <MenuItem onClick={() => handleAddButton("PHONE_NUMBER")}>
                    <ListItemText
                        primary="Call phone number"
                        secondary={<Typography variant="caption" color="text.secondary">1 button maximum</Typography>}
                    />
                </MenuItem>
                <MenuItem onClick={() => handleAddButton("WHATSAPP_FLOW")}>
                    <ListItemText
                        primary="WhatsApp Flow"
                        secondary={<Typography variant="caption" color="text.secondary">1 button maximum</Typography>}
                    />
                </MenuItem>
            </Menu>

            {/* Button List */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {buttons.map((btn, index) => (
                    <Paper key={index} variant="outlined" sx={{ p: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                            <DragIndicatorIcon color="action" sx={{ cursor: "grab" }} />
                            {getButtonIcon(btn)}
                            <Typography variant="subtitle2" sx={{ flex: 1, fontWeight: 600 }}>
                                {getButtonTypeLabel(btn)}
                            </Typography>
                            <IconButton size="small" onClick={() => handleDeleteButton(index)} color="error">
                                <DeleteIcon fontSize="small" />
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
                                placeholder="https://example.com/{{1}}"
                                value={btn.url || ""}
                                onChange={(e) => handleUpdateButton(index, "url", e.target.value)}
                            />
                        )}

                        {btn.type === "PHONE_NUMBER" && (
                            <TextField
                                fullWidth
                                size="small"
                                label="Phone number"
                                placeholder="+1234567890"
                                value={btn.phoneNumber || ""}
                                onChange={(e) => handleUpdateButton(index, "phoneNumber", e.target.value)}
                            />
                        )}
                    </Paper>
                ))}

                {buttons.length === 0 && (
                    <Paper variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                            If you add more than 3 buttons, they will appear in a list
                        </Typography>
                        <Typography variant="caption" color="primary" sx={{ cursor: "pointer" }}>
                            Learn more
                        </Typography>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}
