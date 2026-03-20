import {
    Box,
    TextField,
    Typography,
    Grid,
    Paper,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import CampaignIcon from '@mui/icons-material/Campaign';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SecurityIcon from '@mui/icons-material/Security';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const CATEGORIES = [
    {
        value: "MARKETING",
        label: "Marketing",
        description: "Send promotions or information about your product, service or business",
        icon: <CampaignIcon fontSize="large" />,
    },
    {
        value: "UTILITY",
        label: "Utility",
        description: "Send messages about an existing order or account",
        icon: <NotificationsIcon fontSize="large" />,
    },
    {
        value: "AUTHENTICATION",
        label: "Authentication",
        description: "Send verification code for transaction confirmation, account login or identity verification.",
        icon: <SecurityIcon fontSize="large" />,
    },
];

const LANGUAGES = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "pt", label: "Portuguese" },
    { value: "hi", label: "Hindi" },
];

export default function BasicInfoStep({ template, dispatch, updateCurrentTemplate }) {
    const handleChange = (field, value) => {
        dispatch(updateCurrentTemplate({ [field]: value }));
    };

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Template name
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Enter template name
                </Typography>
                <TextField
                    fullWidth
                    value={template.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Type template name"
                    helperText="Only lower case letters(a), numbers(0) and underscore (_) allowed E.g.: stock1_clearance_sale"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 24,
                                        bgcolor: "primary.main",
                                        borderRadius: 1,
                                        mr: 1,
                                    }}
                                />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Category
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Choose a category that describes your message template.
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    {CATEGORIES.map((cat) => (
                        <Paper
                            key={cat.value}
                            elevation={0}
                            sx={{
                                p: 2,
                                border: 1,
                                borderColor: template.category === cat.value ? 'primary.main' : 'divider',
                                bgcolor: template.category === cat.value ? 'primary.lighter' : 'transparent',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                transition: 'all 0.2s',
                                '&:hover': {
                                    borderColor: 'primary.main',
                                    bgcolor: 'action.hover',
                                }
                            }}
                            onClick={() => handleChange("category", cat.value)}
                        >
                            <Box
                                sx={{
                                    p: 1.5,
                                    borderRadius: '50%',
                                    bgcolor: '#eee',
                                    mr: 2,
                                    display: 'flex',
                                    color: 'text.secondary'
                                }}
                            >
                                {cat.icon}
                            </Box>
                            <Box>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {cat.label}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {cat.description}
                                </Typography>
                            </Box>
                            {template.category === cat.value && (
                                <Box sx={{ ml: 'auto' }}>
                                    <Box
                                        sx={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: '50%',
                                            border: 5,
                                            borderColor: 'primary.main',
                                        }}
                                    />
                                </Box>
                            )}
                        </Paper>
                    ))}
                </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                    Language
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Choose language for this template
                </Typography>
                <TextField
                    select
                    fullWidth
                    value={template.language || "en"}
                    onChange={(e) => handleChange("language", e.target.value)}
                >
                    {LANGUAGES.map((lang) => (
                        <MenuItem key={lang.value} value={lang.value}>
                            {lang.label}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>
        </Box>
    );
}
