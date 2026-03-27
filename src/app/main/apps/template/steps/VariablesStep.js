import {
    Box,
    TextField,
    Typography,
    Paper,
    Chip,
    Alert,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

/**
 * Extracts all {{variableName}} from a text string.
 * Returns an array of unique variable names.
 */
export function extractVariables(text) {
    if (!text) return [];
    const regex = /\{\{([^}]+)\}\}/g;
    const vars = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
        const varName = match[1].trim();
        if (!vars.includes(varName)) {
            vars.push(varName);
        }
    }
    return vars;
}

/**
 * Check if template has any variables in header text, body text, or button URLs.
 */
export function hasVariables(template) {
    const header = template?.components?.find((c) => c.type === 'HEADER');
    const body = template?.components?.find((c) => c.type === 'BODY');
    const buttons = template?.components?.find((c) => c.type === 'BUTTONS');

    const headerVars = header?.format === 'TEXT' ? extractVariables(header.text) : [];
    const bodyVars = extractVariables(body?.text);
    const hasButtonUrlVar = (buttons?.buttons || []).some(
        (btn) => btn.type === 'URL' && /\{\{[^}]+\}\}/.test(btn.url || '')
    );

    return headerVars.length > 0 || bodyVars.length > 0 || hasButtonUrlVar;
}

function extractButtonUrlVariables(buttons) {
    return (buttons || [])
        .map((btn, idx) => ({ btn, idx }))
        .filter(({ btn }) => btn.type === 'URL' && /\{\{[^}]+\}\}/.test(btn.url || ''))
        .map(({ btn, idx }) => ({ buttonIndex: idx, text: btn.text, url: btn.url }));
}

export default function VariablesStep({ template, dispatch, updateCurrentTemplate }) {
    const header = template?.components?.find((c) => c.type === 'HEADER') || {};
    const body = template?.components?.find((c) => c.type === 'BODY') || {};
    const buttonsComp = template?.components?.find((c) => c.type === 'BUTTONS');

    const headerVars = header.format === 'TEXT' ? extractVariables(header.text) : [];
    const bodyVars = extractVariables(body.text);
    const buttonUrlVars = extractButtonUrlVariables(buttonsComp?.buttons);

    // Variable samples are stored in template.variableSamples = { 'header:varName': 'sample', 'body:varName': 'sample', 'button_url:idx': 'sample' }
    const samples = template.variableSamples || {};

    const handleSampleChange = (scope, varName, value) => {
        const key = `${scope}:${varName}`;
        dispatch(
            updateCurrentTemplate({
                variableSamples: {
                    ...samples,
                    [key]: value,
                },
            })
        );
    };

    const allVarsEmpty = headerVars.length === 0 && bodyVars.length === 0 && buttonUrlVars.length === 0;

    if (allVarsEmpty) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Alert severity="info" sx={{ borderRadius: 2 }}>
                    No variables found. Add variables using {'{{variableName}}'} in your header text or body text to see them here.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Info */}
            <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ borderRadius: 2 }}>
                <Typography variant="body2">
                    Provide sample values for each variable. These samples are required by WhatsApp for template approval
                    and will be shown in the preview.
                </Typography>
            </Alert>

            {/* Header Variables */}
            {headerVars.length > 0 && (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Header Variables
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Header text: {header.text}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {headerVars.map((varName) => (
                            <Box key={varName}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Chip
                                        label={`{{${varName}}}`}
                                        size="small"
                                        sx={{
                                            borderRadius: '6px',
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                            bgcolor: '#e8f5e9',
                                            color: '#2e7d32',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={`Enter sample value for {{${varName}}}`}
                                    value={samples[`header:${varName}`] || ''}
                                    onChange={(e) => handleSampleChange('header', varName, e.target.value)}
                                />
                            </Box>
                        ))}
                    </Box>
                </Paper>
            )}

            {/* Body Variables */}
            {bodyVars.length > 0 && (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Body Variables
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 2,
                            maxHeight: 60,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        Body text: {body.text}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {bodyVars.map((varName) => (
                            <Box key={varName}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Chip
                                        label={`{{${varName}}}`}
                                        size="small"
                                        sx={{
                                            borderRadius: '6px',
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                            bgcolor: '#e8f5e9',
                                            color: '#2e7d32',
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={`Enter sample value for {{${varName}}}`}
                                    value={samples[`body:${varName}`] || ''}
                                    onChange={(e) => handleSampleChange('body', varName, e.target.value)}
                                />
                            </Box>
                        ))}
                    </Box>
                </Paper>
            )}

            {/* Button URL Variables */}
            {buttonUrlVars.length > 0 && (
                <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Button Variables
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Provide a sample URL suffix for each button that contains a variable.
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {buttonUrlVars.map(({ buttonIndex, text, url }) => (
                            <Box key={buttonIndex}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                    <Chip
                                        label={`{{1}}`}
                                        size="small"
                                        sx={{
                                            borderRadius: '6px',
                                            fontFamily: 'monospace',
                                            fontSize: '0.75rem',
                                            bgcolor: '#e8f5e9',
                                            color: '#2e7d32',
                                            fontWeight: 600,
                                        }}
                                    />
                                    <Typography variant="body2" color="text.secondary">
                                        Button: {text || `(button ${buttonIndex + 1})`} — URL: {url}
                                    </Typography>
                                </Box>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder="Enter sample value for {{1}} (e.g. product-123)"
                                    value={samples[`button_url:${buttonIndex}`] || ''}
                                    onChange={(e) => handleSampleChange('button_url', buttonIndex, e.target.value)}
                                />
                            </Box>
                        ))}
                    </Box>
                </Paper>
            )}
        </Box>
    );
}
