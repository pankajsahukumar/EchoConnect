import { useRef } from 'react';
import {
    Box,
    TextField,
    Typography,
    Chip,
    Stack,
    Button,
    Paper,
    Link,
    Checkbox,
    FormControlLabel,
    Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const HEADER_TYPES = ['None', 'Text', 'Image', 'Video', 'Document'];

const MEDIA_INFO = {
    Image: { allowed: 'Image type allowed: JPG, JPEG, PNG', accept: 'image/jpeg,image/png,image/jpg' },
    Video: { allowed: 'Video type allowed: MP4', accept: 'video/mp4' },
    Document: { allowed: 'Document type allowed: PDF', accept: 'application/pdf' },
};

const DEFAULT_VARIABLES = [
    'Tracking Code',
    'Inquiry Code',
    'Location',
    'experience_name',
    'order_id',
    'Agent',
    'Today',
    'Future Date',
    'Opt Out',
];

// ─── Authentication Content ──────────────────────────────────

function buildAuthBodyText(securityDisclaimer, hasExpiry, expiryMinutes) {
    let text = '{{1}} is your verification code.';
    if (securityDisclaimer) {
        text += ' For your security, do not share this code.';
    }
    if (hasExpiry) {
        text += `\n\nThis code will expire in ${expiryMinutes || 30} minutes.`;
    }
    return text;
}

function AuthenticationContent({ template, dispatch, updateCurrentTemplate }) {
    const authConfig = template.authConfig || {
        securityDisclaimer: true,
        hasExpiry: true,
        expiryMinutes: 30,
    };

    const updateAuthConfig = (updates) => {
        const newConfig = { ...authConfig, ...updates };
        const bodyText = buildAuthBodyText(
            newConfig.securityDisclaimer,
            newConfig.hasExpiry,
            newConfig.expiryMinutes
        );

        // Update both authConfig and body component
        const components = template.components ? [...template.components] : [];
        const bodyIdx = components.findIndex((c) => c.type === 'BODY');
        if (bodyIdx >= 0) {
            components[bodyIdx] = { ...components[bodyIdx], text: bodyText };
        }
        // Remove header for auth templates
        const headerIdx = components.findIndex((c) => c.type === 'HEADER');
        if (headerIdx >= 0) {
            components[headerIdx] = { type: 'HEADER', format: 'NONE' };
        }

        dispatch(updateCurrentTemplate({ authConfig: newConfig, components }));
    };

    const bodyText = buildAuthBodyText(
        authConfig.securityDisclaimer,
        authConfig.hasExpiry,
        authConfig.expiryMinutes
    );

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Info banner */}
            <Alert
                severity="warning"
                icon={<InfoOutlinedIcon />}
                sx={{
                    borderRadius: 2,
                    bgcolor: '#fff8e1',
                    '& .MuiAlert-icon': { color: '#f9a825' },
                }}
            >
                <Typography variant="body2">
                    Content for authentication message templates can't be edited.
                </Typography>
            </Alert>

            {/* Body */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                    Body
                </Typography>
                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    value={bodyText}
                    InputProps={{ readOnly: true }}
                    sx={{
                        '& .MuiOutlinedInput-root': { bgcolor: '#fafafa' },
                    }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}>
                    ({bodyText.length}/1024)
                </Typography>
            </Paper>

            {/* Checkboxes */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={authConfig.securityDisclaimer}
                            onChange={(e) => updateAuthConfig({ securityDisclaimer: e.target.checked })}
                            sx={{ '&.Mui-checked': { color: '#25D366' } }}
                        />
                    }
                    label={
                        <Typography variant="body2">
                            For your security, do not share this code.
                        </Typography>
                    }
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={authConfig.hasExpiry}
                            onChange={(e) => updateAuthConfig({ hasExpiry: e.target.checked })}
                            sx={{ '&.Mui-checked': { color: '#25D366' } }}
                        />
                    }
                    label={
                        <Typography variant="body2">
                            Add expiration time for the code
                        </Typography>
                    }
                />
            </Box>

            {/* Expiry Time Input */}
            {authConfig.hasExpiry && (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Enter expiration time
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        The expiration time is set between 1 and 90 minutes.
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TextField
                            type="number"
                            size="small"
                            label="Expires in"
                            value={authConfig.expiryMinutes || 30}
                            onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                if (!isNaN(val) && val >= 1 && val <= 90) {
                                    updateAuthConfig({ expiryMinutes: val });
                                } else if (e.target.value === '') {
                                    updateAuthConfig({ expiryMinutes: '' });
                                }
                            }}
                            inputProps={{ min: 1, max: 90 }}
                            sx={{ width: 120 }}
                        />
                        <Typography variant="body2" color="text.secondary">
                            minutes
                        </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        Enter a value between 1 to 90 (minutes)
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}

// ─── Default Content (Marketing / Utility) ───────────────────

function DefaultContent({ template, dispatch, updateCurrentTemplate }) {
    const fileInputRef = useRef(null);

    const getComponent = (type) => template.components?.find((c) => c.type === type) || {};

    const updateComponent = (type, data) => {
        const components = template.components ? [...template.components] : [];
        const index = components.findIndex((c) => c.type === type);

        if (index >= 0) {
            if (data === null) {
                components.splice(index, 1);
            } else {
                components[index] = { ...components[index], ...data };
            }
        } else if (data !== null) {
            components.push({ type, ...data });
        }

        dispatch(updateCurrentTemplate({ components }));
    };

    const handleHeaderTypeChange = (type) => {
        const headerType = type.toUpperCase();
        if (headerType === 'NONE') {
            updateComponent('HEADER', null);
        } else if (headerType === 'TEXT') {
            updateComponent('HEADER', { format: 'TEXT', text: '' });
        } else {
            updateComponent('HEADER', { format: headerType, text: undefined, mediaUrl: '', mediaFile: null });
        }
    };

    const handleFileUpload = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        updateComponent('HEADER', { mediaFile: file.name, mediaUrl: previewUrl });
    };

    const handleMediaUrlChange = (url) => {
        updateComponent('HEADER', { mediaUrl: url, mediaFile: null });
    };

    const insertVariable = (varName) => {
        const bodyComponent = getComponent('BODY');
        const currentText = bodyComponent.text || '';
        updateComponent('BODY', { text: currentText + `{{${varName}}}` });
    };

    const addCustomVariable = () => {
        const bodyComponent = getComponent('BODY');
        const currentText = bodyComponent.text || '';
        const matches = currentText.match(/\{\{(\d+)\}\}/g) || [];
        const nextNum = matches.length + 1;
        updateComponent('BODY', { text: currentText + `{{${nextNum}}}` });
    };

    const headerComponent = getComponent('HEADER');
    const bodyComponent = getComponent('BODY');
    const footerComponent = getComponent('FOOTER');

    const currentHeaderType = headerComponent.format
        ? headerComponent.format.charAt(0) + headerComponent.format.slice(1).toLowerCase()
        : 'None';

    const isMediaType = ['Image', 'Video', 'Document'].includes(currentHeaderType);
    const mediaInfo = MEDIA_INFO[currentHeaderType];

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Header Section */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Header (Optional)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add a title for your message. Your title can't include more than one variable
                </Typography>

                <Stack direction="row" spacing={1}>
                    {HEADER_TYPES.map((type) => {
                        const isActive = currentHeaderType.toUpperCase() === type.toUpperCase();
                        return (
                            <Chip
                                key={type}
                                label={type}
                                onClick={() => handleHeaderTypeChange(type)}
                                variant={isActive ? 'filled' : 'outlined'}
                                sx={{
                                    borderRadius: '6px',
                                    px: 1,
                                    fontWeight: 500,
                                    bgcolor: isActive ? '#25D366' : 'transparent',
                                    color: isActive ? 'white' : 'text.primary',
                                    borderColor: isActive ? '#25D366' : 'divider',
                                    '&:hover': {
                                        bgcolor: isActive ? '#1da851' : 'action.hover',
                                    },
                                }}
                            />
                        );
                    })}
                </Stack>

                {currentHeaderType === 'Text' && (
                    <TextField
                        fullWidth
                        sx={{ mt: 2 }}
                        placeholder="Enter header text"
                        value={headerComponent.text || ''}
                        onChange={(e) => updateComponent('HEADER', { text: e.target.value })}
                        helperText="You can use one variable like {{1}}"
                    />
                )}

                {isMediaType && mediaInfo && (
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                            {mediaInfo.allowed}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Button
                                variant="contained"
                                size="small"
                                startIcon={<CloudUploadIcon />}
                                onClick={() => fileInputRef.current?.click()}
                                sx={{
                                    bgcolor: '#25D366',
                                    '&:hover': { bgcolor: '#1da851' },
                                    textTransform: 'none',
                                    borderRadius: '6px',
                                }}
                            >
                                Upload a file
                            </Button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={mediaInfo.accept}
                                hidden
                                onChange={handleFileUpload}
                            />
                            <Typography variant="body2" color="text.secondary">or</Typography>
                            <Link
                                component="button"
                                variant="body2"
                                underline="always"
                                onClick={() => {
                                    updateComponent('HEADER', { showUrlInput: !headerComponent.showUrlInput });
                                }}
                                sx={{ color: 'text.primary', cursor: 'pointer' }}
                            >
                                Enter URL
                            </Link>
                        </Box>
                        {headerComponent.mediaFile && (
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Uploaded: {headerComponent.mediaFile}
                            </Typography>
                        )}
                        {headerComponent.showUrlInput && (
                            <TextField
                                fullWidth
                                size="small"
                                sx={{ mt: 1.5 }}
                                placeholder={`Enter ${currentHeaderType.toLowerCase()} URL`}
                                value={headerComponent.mediaUrl || ''}
                                onChange={(e) => handleMediaUrlChange(e.target.value)}
                            />
                        )}
                    </Box>
                )}
            </Paper>

            {/* Body Section */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Body</Typography>
                    <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', cursor: 'pointer' }} />
                </Box>

                <Stack direction="row" spacing={0.5} sx={{ mb: 2, flexWrap: 'wrap', gap: 0.5 }}>
                    {DEFAULT_VARIABLES.map((varName) => (
                        <Chip
                            key={varName}
                            label={varName}
                            size="small"
                            variant="outlined"
                            onClick={() => insertVariable(varName)}
                            sx={{
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                height: 28,
                                cursor: 'pointer',
                                borderColor: '#e0e0e0',
                                '&:hover': { bgcolor: '#f5f5f5', borderColor: '#bdbdbd' },
                            }}
                        />
                    ))}
                </Stack>

                <TextField
                    fullWidth
                    multiline
                    rows={5}
                    placeholder="Type message body"
                    value={bodyComponent.text || ''}
                    onChange={(e) => {
                        if (e.target.value.length <= 1024) {
                            updateComponent('BODY', { text: e.target.value });
                        }
                    }}
                />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                        To add a custom variable, please add a variable in double curly brackets without a space. e.g. {'{{VariableName}}'}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                        <Typography variant="caption" color="text.secondary">
                            ({bodyComponent.text?.length || 0}/1024)
                        </Typography>
                        <Button
                            size="small"
                            startIcon={<AddIcon />}
                            onClick={addCustomVariable}
                            sx={{ textTransform: 'none', color: 'text.primary', fontWeight: 500, fontSize: '0.8rem' }}
                        >
                            Add Variable
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Footer Section */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Footer (Optional)
                </Typography>
                <TextField
                    fullWidth
                    placeholder="Type message footer"
                    value={footerComponent.text || ''}
                    onChange={(e) => {
                        if (e.target.value.length <= 60) {
                            updateComponent('FOOTER', { text: e.target.value });
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                ({footerComponent.text?.length || 0}/60)
                            </Typography>
                        ),
                    }}
                />
            </Paper>
        </Box>
    );
}

// ─── Main Export ──────────────────────────────────────────────

export default function ContentStep({ template, dispatch, updateCurrentTemplate }) {
    const isAuthentication = template.category === 'AUTHENTICATION';

    if (isAuthentication) {
        return (
            <AuthenticationContent
                template={template}
                dispatch={dispatch}
                updateCurrentTemplate={updateCurrentTemplate}
            />
        );
    }

    return (
        <DefaultContent
            template={template}
            dispatch={dispatch}
            updateCurrentTemplate={updateCurrentTemplate}
        />
    );
}
