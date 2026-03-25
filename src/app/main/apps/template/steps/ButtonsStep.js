import { useState } from 'react';
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
    Checkbox,
    FormControlLabel,
    Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const URL_TYPES = [
    { value: 'https://', label: 'https://' },
    { value: 'http://', label: 'http://' },
];

const ACTION_TYPES = [
    { value: 'URL', label: 'Visit website' },
    { value: 'PHONE_NUMBER', label: 'Call phone number' },
];

const MAX_BUTTONS = 10;
const MAX_BUTTON_TEXT = 25;
const MAX_URL_LENGTH = 2000;
const MAX_PHONE_LENGTH = 20;

export default function ButtonsStep({ template, dispatch, updateCurrentTemplate }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const getButtonsComponent = () =>
        template.components?.find((c) => c.type === 'BUTTONS') || { type: 'BUTTONS', buttons: [] };

    const updateButtons = (newButtons) => {
        const components = template.components ? [...template.components] : [];
        const index = components.findIndex((c) => c.type === 'BUTTONS');

        if (newButtons.length === 0) {
            if (index >= 0) components.splice(index, 1);
        } else {
            if (index >= 0) {
                components[index] = { ...components[index], buttons: newButtons };
            } else {
                components.push({ type: 'BUTTONS', buttons: newButtons });
            }
        }

        dispatch(updateCurrentTemplate({ components }));
    };

    const handleAddButton = (type) => {
        const currentButtons = getButtonsComponent().buttons || [];
        let newButton = { type, text: '' };

        if (type === 'PHONE_NUMBER') {
            newButton = { ...newButton, phoneNumber: '', countryCode: '+91' };
        } else if (type === 'URL') {
            newButton = { ...newButton, url: '', urlType: 'https://', enableAnalytics: false };
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

    // Check if any URL button already has a variable
    const hasUrlVariable = (excludeIndex) => {
        const btns = getButtonsComponent().buttons || [];
        return btns.some(
            (btn, i) => i !== excludeIndex && btn.type === 'URL' && btn.url && /\{\{[^}]+\}\}/.test(btn.url)
        );
    };

    const addVariableToUrl = (index) => {
        const currentButtons = [...(getButtonsComponent().buttons || [])];
        const btn = currentButtons[index];
        if (btn.type !== 'URL') return;
        // Only one variable allowed across all URL buttons
        if (hasUrlVariable(index)) return;
        if (/\{\{[^}]+\}\}/.test(btn.url || '')) return; // already has variable
        const newUrl = (btn.url || '') + '{{1}}';
        currentButtons[index] = { ...currentButtons[index], url: newUrl };
        updateButtons(currentButtons);
    };

    const buttons = getButtonsComponent().buttons || [];

    // Separate buttons by category
    const ctaButtons = buttons
        .map((btn, idx) => ({ ...btn, _originalIndex: idx }))
        .filter((btn) => btn.type === 'URL' || btn.type === 'PHONE_NUMBER');
    const quickReplyButtons = buttons
        .map((btn, idx) => ({ ...btn, _originalIndex: idx }))
        .filter((btn) => btn.type === 'QUICK_REPLY');

    return (
        <Box>
            {/* Title */}
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5, fontSize: '1.1rem' }}>
                Buttons
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Create buttons that let customers respond to your message or take action
            </Typography>

            {/* Add button + count */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Button
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    startIcon={<AddIcon />}
                    endIcon={<KeyboardArrowDownIcon />}
                    disabled={buttons.length >= MAX_BUTTONS}
                    sx={{
                        textTransform: 'none',
                        borderColor: 'divider',
                        color: 'text.primary',
                        borderRadius: '6px',
                    }}
                >
                    Add a button
                </Button>
                <Typography variant="body2" color="text.secondary">
                    {buttons.length}/{MAX_BUTTONS} buttons
                </Typography>
            </Box>

            {buttons.length > 3 && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                    If you add more than 3 buttons, they will appear in a list
                </Typography>
            )}

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <MenuItem disabled sx={{ opacity: 0.7, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.5 }}>
                    QUICK REPLY
                </MenuItem>
                <MenuItem onClick={() => handleAddButton('QUICK_REPLY')}>Custom button</MenuItem>
                <MenuItem onClick={() => { handleAddButton('QUICK_REPLY'); }}>Marketing opt-out</MenuItem>
                <Divider />
                <MenuItem disabled sx={{ opacity: 0.7, fontSize: '0.75rem', fontWeight: 700, letterSpacing: 0.5 }}>
                    CALL TO ACTION
                </MenuItem>
                <MenuItem onClick={() => handleAddButton('URL')}>Visit website</MenuItem>
                <MenuItem onClick={() => handleAddButton('PHONE_NUMBER')}>Call phone number</MenuItem>
            </Menu>

            {/* Call to Action Section */}
            {ctaButtons.length > 0 && (
                <Paper variant="outlined" sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fafafa' }}>
                        <SwapVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Call to action
                        </Typography>
                    </Box>
                    <Divider />

                    {ctaButtons.map((btn, localIdx) => (
                        <Box key={btn._originalIndex}>
                            {localIdx > 0 && <Divider />}
                            <Box sx={{ p: 2 }}>
                                {btn.type === 'URL' && (
                                    <UrlButtonEditor
                                        btn={btn}
                                        onUpdate={(field, value) => handleUpdateButton(btn._originalIndex, field, value)}
                                        onDelete={() => handleDeleteButton(btn._originalIndex)}
                                        onAddVariable={() => addVariableToUrl(btn._originalIndex)}
                                        canAddVariable={!hasUrlVariable(btn._originalIndex) && !/\{\{[^}]+\}\}/.test(btn.url || '')}
                                    />
                                )}
                                {btn.type === 'PHONE_NUMBER' && (
                                    <PhoneButtonEditor
                                        btn={btn}
                                        onUpdate={(field, value) => handleUpdateButton(btn._originalIndex, field, value)}
                                        onDelete={() => handleDeleteButton(btn._originalIndex)}
                                    />
                                )}
                            </Box>
                        </Box>
                    ))}
                </Paper>
            )}

            {/* Quick Reply Section */}
            {quickReplyButtons.length > 0 && (
                <Paper variant="outlined" sx={{ borderRadius: 2, mb: 3, overflow: 'hidden' }}>
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fafafa' }}>
                        <SwapVertIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            Quick Reply
                        </Typography>
                    </Box>
                    <Divider />

                    {quickReplyButtons.map((btn, localIdx) => (
                        <Box key={btn._originalIndex}>
                            {localIdx > 0 && <Divider />}
                            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <DragIndicatorIcon sx={{ color: 'text.disabled', fontSize: 20, cursor: 'grab' }} />
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Button name"
                                    value={btn.text}
                                    onChange={(e) => {
                                        if (e.target.value.length <= MAX_BUTTON_TEXT) {
                                            handleUpdateButton(btn._originalIndex, 'text', e.target.value);
                                        }
                                    }}
                                    InputProps={{
                                        endAdornment: (
                                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                                {(btn.text || '').length}/{MAX_BUTTON_TEXT}
                                            </Typography>
                                        ),
                                    }}
                                />
                                <IconButton size="small" onClick={() => handleDeleteButton(btn._originalIndex)}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        </Box>
                    ))}
                </Paper>
            )}

            {buttons.length === 0 && (
                <Paper
                    variant="outlined"
                    sx={{ p: 6, borderRadius: 2, textAlign: 'center', borderStyle: 'dashed' }}
                >
                    <Typography variant="body2" color="text.secondary">
                        No buttons added. Click "Add a button" to start.
                    </Typography>
                </Paper>
            )}
        </Box>
    );
}

// ─── URL Button Editor ───────────────────────────────────────

function UrlButtonEditor({ btn, onUpdate, onDelete, onAddVariable, canAddVariable }) {
    const [varAnchor, setVarAnchor] = useState(null);

    return (
        <Box>
            {/* Row 1: Type + Button name */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'center' }}>
                <DragIndicatorIcon sx={{ color: 'text.disabled', fontSize: 20, cursor: 'grab', flexShrink: 0 }} />
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Type of action</InputLabel>
                    <Select
                        value="URL"
                        label="Type of action"
                        readOnly
                    >
                        {ACTION_TYPES.map((a) => (
                            <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    size="small"
                    label="Button name"
                    value={btn.text || ''}
                    onChange={(e) => {
                        if (e.target.value.length <= MAX_BUTTON_TEXT) {
                            onUpdate('text', e.target.value);
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                {(btn.text || '').length}/{MAX_BUTTON_TEXT}
                            </Typography>
                        ),
                    }}
                />
            </Box>

            {/* Row 2: URL type + Website URL */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, pl: 4.5, alignItems: 'center' }}>
                <FormControl size="small" sx={{ minWidth: 100 }}>
                    <InputLabel>URL type</InputLabel>
                    <Select
                        value={btn.urlType || 'https://'}
                        label="URL type"
                        onChange={(e) => onUpdate('urlType', e.target.value)}
                    >
                        {URL_TYPES.map((u) => (
                            <MenuItem key={u.value} value={u.value}>{u.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    size="small"
                    label="Website URL"
                    value={btn.url || ''}
                    onChange={(e) => {
                        if (e.target.value.length <= MAX_URL_LENGTH) {
                            onUpdate('url', e.target.value);
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexShrink: 0 }}>
                                <Typography variant="caption" color="text.secondary">
                                    {(btn.url || '').length}/{MAX_URL_LENGTH}
                                </Typography>
                                <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                            </Box>
                        ),
                    }}
                />
                <IconButton size="small" onClick={onDelete}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>

            {/* Row 3: Analytics checkbox + Add variable */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pl: 4.5 }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            size="small"
                            checked={btn.enableAnalytics || false}
                            onChange={(e) => onUpdate('enableAnalytics', e.target.checked)}
                        />
                    }
                    label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Typography variant="body2">Enable analytics for your link</Typography>
                            <InfoOutlinedIcon sx={{ fontSize: 14, color: 'text.disabled' }} />
                        </Box>
                    }
                />
                <Button
                    size="small"
                    startIcon={<AddIcon />}
                    endIcon={<KeyboardArrowDownIcon sx={{ fontSize: '16px !important' }} />}
                    disabled={!canAddVariable}
                    onClick={(e) => setVarAnchor(e.currentTarget)}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '6px',
                        color: canAddVariable ? 'text.primary' : 'text.disabled',
                    }}
                >
                    Add variable
                </Button>
                <Menu
                    anchorEl={varAnchor}
                    open={Boolean(varAnchor)}
                    onClose={() => setVarAnchor(null)}
                >
                    <MenuItem
                        onClick={() => {
                            onAddVariable();
                            setVarAnchor(null);
                        }}
                    >
                        {'{{1}} - Dynamic URL suffix'}
                    </MenuItem>
                </Menu>
            </Box>
        </Box>
    );
}

// ─── Phone Button Editor ─────────────────────────────────────

function PhoneButtonEditor({ btn, onUpdate, onDelete }) {
    return (
        <Box>
            {/* Row 1: Type + Button name */}
            <Box sx={{ display: 'flex', gap: 1.5, mb: 1.5, alignItems: 'center' }}>
                <DragIndicatorIcon sx={{ color: 'text.disabled', fontSize: 20, cursor: 'grab', flexShrink: 0 }} />
                <FormControl size="small" sx={{ minWidth: 140 }}>
                    <InputLabel>Type of action</InputLabel>
                    <Select
                        value="PHONE_NUMBER"
                        label="Type of action"
                        readOnly
                    >
                        {ACTION_TYPES.map((a) => (
                            <MenuItem key={a.value} value={a.value}>{a.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    size="small"
                    label="Button name"
                    value={btn.text || ''}
                    onChange={(e) => {
                        if (e.target.value.length <= MAX_BUTTON_TEXT) {
                            onUpdate('text', e.target.value);
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                {(btn.text || '').length}/{MAX_BUTTON_TEXT}
                            </Typography>
                        ),
                    }}
                />
            </Box>

            {/* Row 2: Country code + Phone */}
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', pl: 4.5 }}>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '6px',
                        px: 1.5,
                        py: 0.8,
                        gap: 0.5,
                        flexShrink: 0,
                        minWidth: 80,
                    }}
                >
                    <Typography sx={{ fontSize: '1rem' }}>🇮🇳</Typography>
                    <Select
                        variant="standard"
                        disableUnderline
                        value={btn.countryCode || '+91'}
                        onChange={(e) => onUpdate('countryCode', e.target.value)}
                        sx={{ fontSize: '0.85rem', '& .MuiSelect-select': { py: 0 } }}
                    >
                        <MenuItem value="+91">+91</MenuItem>
                        <MenuItem value="+1">+1</MenuItem>
                        <MenuItem value="+44">+44</MenuItem>
                        <MenuItem value="+971">+971</MenuItem>
                        <MenuItem value="+61">+61</MenuItem>
                        <MenuItem value="+65">+65</MenuItem>
                        <MenuItem value="+86">+86</MenuItem>
                    </Select>
                </Box>
                <TextField
                    fullWidth
                    size="small"
                    label="Phone Number"
                    value={btn.phoneNumber || ''}
                    onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        if (val.length <= MAX_PHONE_LENGTH) {
                            onUpdate('phoneNumber', val);
                        }
                    }}
                    InputProps={{
                        endAdornment: (
                            <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
                                {(btn.phoneNumber || '').length}/{MAX_PHONE_LENGTH}
                            </Typography>
                        ),
                    }}
                />
                <IconButton size="small" onClick={onDelete}>
                    <CloseIcon fontSize="small" />
                </IconButton>
            </Box>
        </Box>
    );
}
