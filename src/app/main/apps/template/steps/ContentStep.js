import {
    Box,
    TextField,
    Typography,
    Chip,
    Stack,
    IconButton,
    InputAdornment,
} from "@mui/material";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import AddIcon from '@mui/icons-material/Add';

const HEADER_TYPES = ["None", "Text", "Image", "Video", "Document"];

export default function ContentStep({ template, dispatch, updateCurrentTemplate }) {
    const getComponent = (type) => template.components?.find((c) => c.type === type) || {};

    const updateComponent = (type, data) => {
        const components = template.components ? [...template.components] : [];
        const index = components.findIndex((c) => c.type === type);

        if (index >= 0) {
            if (data === null) {
                // Remove component
                components.splice(index, 1);
            } else {
                // Update component
                components[index] = { ...components[index], ...data };
            }
        } else if (data !== null) {
            // Add component
            components.push({ type, ...data });
        }

        dispatch(updateCurrentTemplate({ components }));
    };

    const handleHeaderTypeChange = (type) => {
        const headerType = type.toUpperCase();
        if (headerType === "NONE") {
            updateComponent("HEADER", null);
        } else {
            updateComponent("HEADER", { format: headerType, text: headerType === "TEXT" ? "" : undefined });
        }
    };

    const headerComponent = getComponent("HEADER");
    const bodyComponent = getComponent("BODY");
    const footerComponent = getComponent("FOOTER");

    const currentHeaderType = headerComponent.format ?
        (headerComponent.format.charAt(0) + headerComponent.format.slice(1).toLowerCase()) : "None";

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Header (Optional)
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Add a title for your message. Your title can't include more than one variable
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    {HEADER_TYPES.map((type) => (
                        <Chip
                            key={type}
                            label={type}
                            onClick={() => handleHeaderTypeChange(type)}
                            color={currentHeaderType.toUpperCase() === type.toUpperCase() ? "success" : "default"}
                            variant={currentHeaderType.toUpperCase() === type.toUpperCase() ? "filled" : "outlined"}
                            sx={{
                                borderRadius: '16px',
                                px: 1,
                                '&:hover': { bgcolor: currentHeaderType.toUpperCase() === type.toUpperCase() ? 'success.dark' : 'action.hover' }
                            }}
                        />
                    ))}
                </Stack>

                {currentHeaderType === "Text" && (
                    <TextField
                        fullWidth
                        sx={{ mt: 2 }}
                        placeholder="Enter header text"
                        value={headerComponent.text || ""}
                        onChange={(e) => updateComponent("HEADER", { text: e.target.value })}
                    />
                )}
            </Box>

            {/* Body Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Body
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    To add a custom variable, please add a variable in double curly brackets without a space
                </Typography>

                <Box sx={{ mb: 1 }}>
                    {/* Variable chips could go here */}
                </Box>

                <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Type message body"
                    value={bodyComponent.text || ""}
                    onChange={(e) => updateComponent("BODY", { text: e.target.value })}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end" sx={{ position: 'absolute', bottom: 10, right: 10 }}>
                                <IconButton size="small"><InsertEmoticonIcon /></IconButton>
                                <IconButton size="small"><FormatBoldIcon /></IconButton>
                                <IconButton size="small"><FormatItalicIcon /></IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                    {bodyComponent.text?.length || 0}/1024
                </Typography>
            </Box>

            {/* Footer Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Footer (Optional)
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Type message footer
                </Typography>

                <TextField
                    fullWidth
                    placeholder="Type message footer"
                    value={footerComponent.text || ""}
                    onChange={(e) => updateComponent("FOOTER", { text: e.target.value })}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                    {footerComponent.text?.length || 0}/60
                </Typography>
            </Box>
        </Box>
    );
}
