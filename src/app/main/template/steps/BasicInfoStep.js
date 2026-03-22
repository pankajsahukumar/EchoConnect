import {
    Box,
    TextField,
    Typography,
    Paper,
    MenuItem,
    Radio,
    FormControlLabel,
    RadioGroup,
    Chip,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";

const CATEGORIES = [
    {
        value: "MARKETING",
        label: "Marketing",
        deliveryRate: "40-50%",
        description: "Send promotions or information about your products, services or business.",
        icon: <CampaignIcon fontSize="large" />,
        subOptions: [
            { value: "CUSTOM", label: "Custom", description: "Send promotional offers, announcements and more to increase awareness and engagement." },
            { value: "CAROUSEL", label: "Carousel", description: "Send messages about your entire catalogue or multiple products from it." },
            { value: "CALL_PERMISSION", label: "Call Permission", description: "Create a call permission request template to send users outside the service window.", disabled: true },
        ],
    },
    {
        value: "UTILITY",
        label: "Utility",
        deliveryRate: "99%",
        description: "Send messages about an existing order or account",
        icon: <NotificationsIcon fontSize="large" />,
        subOptions: [],
    },
    {
        value: "AUTHENTICATION",
        label: "Authentication",
        deliveryRate: "99%",
        description: "Send verification code for transaction confirmation, account login or identity verification.",
        icon: <SecurityIcon fontSize="large" />,
        subOptions: [],
    },
];

const LANGUAGES = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
    { value: "pt", label: "Portuguese" },
    { value: "hi", label: "Hindi" },
    { value: "ar", label: "Arabic" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
];

const WABAS = [
    { value: "default", label: "Double Tick 8010679679" },
];

export default function BasicInfoStep({ template, dispatch, updateCurrentTemplate }) {
    const handleChange = (field, value) => {
        dispatch(updateCurrentTemplate({ [field]: value }));

        // When switching to AUTHENTICATION, set default body text
        if (field === "category" && value === "AUTHENTICATION") {
            const components = template.components ? [...template.components] : [];
            const bodyIdx = components.findIndex((c) => c.type === "BODY");
            const authBody = { type: "BODY", text: "{{1}} is your verification code." };
            if (bodyIdx >= 0) {
                components[bodyIdx] = { ...components[bodyIdx], ...authBody };
            } else {
                components.push(authBody);
            }
            // Remove header for auth templates
            const headerIdx = components.findIndex((c) => c.type === "HEADER");
            if (headerIdx >= 0) {
                components[headerIdx] = { type: "HEADER", format: "NONE" };
            }
            dispatch(updateCurrentTemplate({ components }));
        }
    };

    const isValidName = (name) => /^[a-z0-9_]*$/.test(name);

    const handleNameChange = (e) => {
        const value = e.target.value;
        if (isValidName(value) || value === "") {
            handleChange("name", value);
        }
    };

    return (
        <Box>
            {/* Template Name */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Template name
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Enter template name
                </Typography>
                <TextField
                    fullWidth
                    value={template.name || ""}
                    onChange={handleNameChange}
                    placeholder="Type template name"
                    error={template.name !== "" && !isValidName(template.name)}
                    helperText={
                        <Typography variant="caption" color="error.main">
                            Only lower case letters(a), numbers(0) and underscore (_) allowed E.g.: stock1_clearance_sale
                        </Typography>
                    }
                    inputProps={{ maxLength: 512 }}
                    InputProps={{
                        endAdornment: (
                            <Typography variant="caption" color="text.secondary">
                                {template.name?.length || 0}/512
                            </Typography>
                        ),
                    }}
                />
            </Paper>

            {/* Category */}
            <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Category
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    Choose a category that describes your message template.{" "}
                    <Typography component="span" variant="body2" color="primary" sx={{ cursor: "pointer" }}>
                        Learn more about categories
                    </Typography>
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                    {CATEGORIES.map((cat) => (
                        <Paper
                            key={cat.value}
                            variant="outlined"
                            sx={{
                                p: 2,
                                borderColor: template.category === cat.value ? "success.main" : "divider",
                                bgcolor: template.category === cat.value ? "success.lighter" : "transparent",
                                cursor: "pointer",
                                transition: "all 0.2s",
                                "&:hover": { borderColor: "success.main" },
                            }}
                            onClick={() => handleChange("category", cat.value)}
                        >
                            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                                <Box
                                    sx={{
                                        p: 1,
                                        borderRadius: "50%",
                                        bgcolor: "#f5f5f5",
                                        mr: 2,
                                        display: "flex",
                                        color: "text.secondary",
                                    }}
                                >
                                    {cat.icon}
                                </Box>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                            {cat.label}
                                        </Typography>
                                        <Chip
                                            size="small"
                                            icon={<span style={{ color: "#128C7E", fontSize: 12 }}>~</span>}
                                            label={`${cat.deliveryRate} estimated delivery rate`}
                                            sx={{ fontSize: "0.7rem", height: 22 }}
                                        />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary">
                                        {cat.description}
                                    </Typography>

                                    {/* Sub-options for Marketing */}
                                    {template.category === cat.value && cat.subOptions.length > 0 && (
                                        <RadioGroup
                                            value={template.subCategory || "CUSTOM"}
                                            onChange={(e) => handleChange("subCategory", e.target.value)}
                                            sx={{ mt: 1.5, ml: 1 }}
                                        >
                                            {cat.subOptions.map((sub) => (
                                                <FormControlLabel
                                                    key={sub.value}
                                                    value={sub.value}
                                                    disabled={sub.disabled}
                                                    control={<Radio size="small" color="success" />}
                                                    label={
                                                        <Box>
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                {sub.label}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {sub.description}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            ))}
                                        </RadioGroup>
                                    )}
                                </Box>
                            </Box>
                        </Paper>
                    ))}
                </Box>
            </Paper>

            {/* Language and WABAs */}
            <Box sx={{ display: "flex", gap: 3 }}>
                <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
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
                        size="small"
                    >
                        {LANGUAGES.map((lang) => (
                            <MenuItem key={lang.value} value={lang.value}>
                                {lang.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Paper>

                <Paper variant="outlined" sx={{ p: 3, flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        WABAs
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Select WABAs to create this template in
                    </Typography>
                    <TextField
                        select
                        fullWidth
                        value={template.waba || "default"}
                        onChange={(e) => handleChange("waba", e.target.value)}
                        size="small"
                    >
                        {WABAS.map((w) => (
                            <MenuItem key={w.value} value={w.value}>
                                {w.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Paper>
            </Box>
        </Box>
    );
}
