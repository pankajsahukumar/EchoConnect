import { useState } from 'react';
import {
    Box,
    TextField,
    Typography,
    Paper,
    MenuItem,
    Radio,
    RadioGroup,
    FormControlLabel,
    Collapse,
    Chip,
    Grid,
} from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const CATEGORIES = [
    {
        value: 'MARKETING',
        label: 'Marketing',
        deliveryRate: '40-50% estimated delivery rate',
        description: 'Send promotions or information about your products, services or business.',
        icon: <CampaignIcon fontSize="large" />,
        subTypes: [
            { value: 'CUSTOM', label: 'Custom', description: 'Send promotions or information about your products, services or business.' },
            { value: 'CAROUSEL', label: 'Carousel', description: 'Send a carousel of cards with images and buttons.' },
        ],
    },
    {
        value: 'UTILITY',
        label: 'Utility',
        deliveryRate: '99% estimated delivery rate',
        description: 'Send messages about an existing order or account',
        icon: <NotificationsIcon fontSize="large" />,
        subTypes: [
            { value: 'CUSTOM', label: 'Custom', description: 'Send communication about an ongoing request with the customer for example - order updates, reminders, alerts, etc.' },
            { value: 'CALL_PERMISSION', label: 'Call Permission', description: 'Create a call permission request template to send users outside the service window.', disabled: true },
        ],
    },
    {
        value: 'AUTHENTICATION',
        label: 'Authentication',
        deliveryRate: '99% estimated delivery rate',
        description: 'Send verification code for transaction confirmation, account login or identity verification.',
        icon: <SecurityIcon fontSize="large" />,
        subTypes: [
            { value: 'OTP', label: 'OTP', description: 'Send a one-time password for verification.' },
            { value: 'COPY_CODE', label: 'Copy Code', description: 'Send a code that user can copy to verify.', disabled: true },
        ],
    },
];

const LANGUAGES = [
    { value: 'af', label: 'Afrikaans' },
    { value: 'sq', label: 'Albanian' },
    { value: 'ar', label: 'Arabic' },
    { value: 'az', label: 'Azerbaijani' },
    { value: 'bn', label: 'Bengali' },
    { value: 'bg', label: 'Bulgarian' },
    { value: 'ca', label: 'Catalan' },
    { value: 'zh_CN', label: 'Chinese (CHN)' },
    { value: 'zh_HK', label: 'Chinese (HKG)' },
    { value: 'zh_TW', label: 'Chinese (TAI)' },
    { value: 'hr', label: 'Croatian' },
    { value: 'cs', label: 'Czech' },
    { value: 'da', label: 'Danish' },
    { value: 'nl', label: 'Dutch' },
    { value: 'en', label: 'English' },
    { value: 'en_GB', label: 'English (UK)' },
    { value: 'en_US', label: 'English (US)' },
    { value: 'et', label: 'Estonian' },
    { value: 'fil', label: 'Filipino' },
    { value: 'fi', label: 'Finnish' },
    { value: 'fr', label: 'French' },
    { value: 'ka', label: 'Georgian' },
    { value: 'de', label: 'German' },
    { value: 'el', label: 'Greek' },
    { value: 'gu', label: 'Gujarati' },
    { value: 'ha', label: 'Hausa' },
    { value: 'he', label: 'Hebrew' },
    { value: 'hi', label: 'Hindi' },
    { value: 'hu', label: 'Hungarian' },
    { value: 'id', label: 'Indonesian' },
    { value: 'ga', label: 'Irish' },
    { value: 'it', label: 'Italian' },
    { value: 'ja', label: 'Japanese' },
    { value: 'kn', label: 'Kannada' },
    { value: 'kk', label: 'Kazakh' },
    { value: 'rw_RW', label: 'Kinyarwanda' },
    { value: 'ko', label: 'Korean' },
    { value: 'ky_KG', label: 'Kyrgyz' },
    { value: 'lo', label: 'Lao' },
    { value: 'lv', label: 'Latvian' },
    { value: 'lt', label: 'Lithuanian' },
    { value: 'mk', label: 'Macedonian' },
    { value: 'ms', label: 'Malay' },
    { value: 'ml', label: 'Malayalam' },
    { value: 'mr', label: 'Marathi' },
    { value: 'nb', label: 'Norwegian' },
    { value: 'fa', label: 'Persian' },
    { value: 'pl', label: 'Polish' },
    { value: 'pt_BR', label: 'Portuguese (BR)' },
    { value: 'pt_PT', label: 'Portuguese (POR)' },
    { value: 'pa', label: 'Punjabi' },
    { value: 'ro', label: 'Romanian' },
    { value: 'ru', label: 'Russian' },
    { value: 'sr', label: 'Serbian' },
    { value: 'sk', label: 'Slovak' },
    { value: 'sl', label: 'Slovenian' },
    { value: 'es', label: 'Spanish' },
    { value: 'es_AR', label: 'Spanish (ARG)' },
    { value: 'es_MX', label: 'Spanish (MEX)' },
    { value: 'sw', label: 'Swahili' },
    { value: 'sv', label: 'Swedish' },
    { value: 'ta', label: 'Tamil' },
    { value: 'te', label: 'Telugu' },
    { value: 'th', label: 'Thai' },
    { value: 'tr', label: 'Turkish' },
    { value: 'uk', label: 'Ukrainian' },
    { value: 'ur', label: 'Urdu' },
    { value: 'uz', label: 'Uzbek' },
    { value: 'vi', label: 'Vietnamese' },
    { value: 'zu', label: 'Zulu' },
];

const WABAS = [
    { value: 'waba_1', label: 'Double Tick 8010679679' },
    { value: 'waba_2', label: 'EchoConnect Business' },
];

const NAME_REGEX = /^[a-z0-9_]*$/;
const MAX_NAME_LENGTH = 512;

export default function BasicInfoStep({ template, dispatch, updateCurrentTemplate }) {
    const [nameError, setNameError] = useState('');

    const handleChange = (field, value) => {
        dispatch(updateCurrentTemplate({ [field]: value }));
    };

    const handleNameChange = (value) => {
        if (value.length > MAX_NAME_LENGTH) return;
        if (value && !NAME_REGEX.test(value)) {
            setNameError('Only lower case letters(a), numbers(0) and underscore (_) allowed E.g.: stock1_clearance_sale');
        } else {
            setNameError('');
        }
        // Only update if valid or empty
        if (!value || NAME_REGEX.test(value)) {
            handleChange('name', value);
        }
    };

    const handleCategoryChange = (categoryValue) => {
        const cat = CATEGORIES.find((c) => c.value === categoryValue);
        const defaultSubType = cat?.subTypes?.[0]?.value || 'CUSTOM';
        handleChange('category', categoryValue);
        handleChange('subCategory', defaultSubType);
    };

    const handleSubTypeChange = (subType) => {
        handleChange('subCategory', subType);
    };

    const selectedCategory = CATEGORIES.find((c) => c.value === template.category);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Template Name */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Template name
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Enter template name
                </Typography>
                <TextField
                    fullWidth
                    value={template.name || ''}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Type template name"
                    error={!!nameError}
                    helperText={
                        nameError || 'Only lower case letters(a), numbers(0) and underscore (_) allowed E.g.: stock1_clearance_sale'
                    }
                    FormHelperTextProps={{
                        sx: { color: nameError ? 'error.main' : '#e65100', fontSize: '0.75rem' },
                    }}
                    InputProps={{
                        endAdornment: (
                            <Typography variant="caption" color="text.secondary">
                                {(template.name || '').length}/{MAX_NAME_LENGTH}
                            </Typography>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: nameError ? 'error.main' : '#e65100' },
                            '&:hover fieldset': { borderColor: nameError ? 'error.main' : '#e65100' },
                            '&.Mui-focused fieldset': { borderColor: nameError ? 'error.main' : '#e65100' },
                        },
                        '& input::placeholder': { color: '#e65100', opacity: 1 },
                    }}
                />
            </Paper>

            {/* Category */}
            <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Category
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Choose a category that describes your message template.{' '}
                    <Typography component="span" variant="body2" sx={{ color: 'primary.main', cursor: 'pointer' }}>
                        Learn more about categories
                    </Typography>
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {CATEGORIES.map((cat) => {
                        const isSelected = template.category === cat.value;
                        return (
                            <Paper
                                key={cat.value}
                                variant="outlined"
                                sx={{
                                    borderRadius: 2,
                                    borderColor: isSelected ? '#25D366' : 'divider',
                                    bgcolor: isSelected ? '#f0faf4' : 'transparent',
                                    overflow: 'hidden',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer',
                                    '&:hover': { borderColor: '#25D366' },
                                }}
                                onClick={() => handleCategoryChange(cat.value)}
                            >
                                {/* Category header */}
                                <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: '50%',
                                            bgcolor: isSelected ? '#e8f5e9' : '#f5f5f5',
                                            mr: 2,
                                            display: 'flex',
                                            color: isSelected ? '#25D366' : 'text.secondary',
                                        }}
                                    >
                                        {cat.icon}
                                    </Box>
                                    <Box sx={{ flex: 1 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                {cat.label}
                                            </Typography>
                                            <Chip
                                                icon={<CheckCircleIcon sx={{ fontSize: 14 }} />}
                                                label={cat.deliveryRate}
                                                size="small"
                                                sx={{
                                                    fontSize: '0.65rem',
                                                    height: 22,
                                                    bgcolor: isSelected ? '#e8f5e9' : '#f5f5f5',
                                                    color: 'text.secondary',
                                                    '& .MuiChip-icon': { color: '#25D366' },
                                                }}
                                            />
                                            <InfoOutlinedIcon sx={{ fontSize: 16, color: 'text.disabled', cursor: 'pointer' }} />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">
                                            {cat.description}
                                        </Typography>
                                    </Box>
                                </Box>

                                {/* Sub-types (shown when selected) */}
                                <Collapse in={isSelected}>
                                    <Box sx={{ px: 2, pb: 2, pl: 8 }}>
                                        <RadioGroup
                                            value={template.subCategory || cat.subTypes[0]?.value}
                                            onChange={(e) => handleSubTypeChange(e.target.value)}
                                        >
                                            {cat.subTypes.map((sub) => (
                                                <FormControlLabel
                                                    key={sub.value}
                                                    value={sub.value}
                                                    disabled={sub.disabled}
                                                    control={
                                                        <Radio
                                                            size="small"
                                                            sx={{ '&.Mui-checked': { color: '#25D366' } }}
                                                        />
                                                    }
                                                    label={
                                                        <Box>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    fontWeight: 500,
                                                                    color: sub.disabled ? 'text.disabled' : 'text.primary',
                                                                }}
                                                            >
                                                                {sub.label}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                color={sub.disabled ? 'text.disabled' : 'text.secondary'}
                                                            >
                                                                {sub.description}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    sx={{ alignItems: 'flex-start', mb: 0.5 }}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </Box>
                                </Collapse>
                            </Paper>
                        );
                    })}
                </Box>
            </Paper>

            {/* Language & WABA */}
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Language
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Choose language for this template
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            label="Language"
                            value={template.language || 'en'}
                            onChange={(e) => handleChange('language', e.target.value)}
                        >
                            {LANGUAGES.map((lang) => (
                                <MenuItem key={lang.value} value={lang.value}>
                                    {lang.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            WABAs
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Select WABAs to create this template in
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            label=""
                            value={template.waba || WABAS[0].value}
                            onChange={(e) => handleChange('waba', e.target.value)}
                        >
                            {WABAS.map((w) => (
                                <MenuItem key={w.value} value={w.value}>
                                    {w.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
