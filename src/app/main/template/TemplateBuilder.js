import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Paper,
    Stepper,
    Step,
    StepLabel,
    Typography,
    CircularProgress,
    Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BasicInfoStep from "./steps/BasicInfoStep";
import ContentStep from "./steps/ContentStep";
import ButtonsStep from "./steps/ButtonsStep";
import VariablesStep from "./steps/VariablesStep";
import TemplatePreview from "./TemplatePreview";
import {
    selectCurrentTemplate,
    setCurrentTemplate,
    resetCurrentTemplate,
    updateCurrentTemplate,
} from "./store/templateFormSlice";
import { addTemplate, updateTemplate, getTemplateById } from "./store/templateSlice";
import TemplateModel from "src/@models/TemplateModel";

const ALL_STEPS = [
    { label: "Basic Info", key: "basic" },
    { label: "Content", key: "content" },
    { label: "Buttons", key: "buttons" },
    { label: "Variables", key: "variables" },
];

const AUTH_STEPS = [
    { label: "Basic Info", key: "basic" },
    { label: "Content", key: "content" },
    { label: "Buttons", key: "buttons" },
];

export default function TemplateBuilder({ mode = "create" }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { templateId } = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const template = useSelector(selectCurrentTemplate);

    const isAuthentication = template.category === "AUTHENTICATION";
    const steps = isAuthentication ? AUTH_STEPS : ALL_STEPS;

    useEffect(() => {
        if (mode === "edit" && templateId) {
            dispatch(getTemplateById(templateId))
                .unwrap()
                .then((tmpl) => {
                    dispatch(setCurrentTemplate(new TemplateModel(tmpl)));
                })
                .catch(() => {});
        } else {
            dispatch(resetCurrentTemplate());
        }
    }, [mode, templateId, dispatch]);

    // When switching to AUTHENTICATION, set default body and reset step if needed
    useEffect(() => {
        if (isAuthentication) {
            const bodyComp = template.components?.find((c) => c.type === "BODY");
            if (!bodyComp?.text) {
                const components = template.components ? [...template.components] : [];
                const idx = components.findIndex((c) => c.type === "BODY");
                const authBody = { type: "BODY", text: "{{1}} is your verification code." };
                if (idx >= 0) {
                    components[idx] = { ...components[idx], ...authBody };
                } else {
                    components.push(authBody);
                }
                dispatch(updateCurrentTemplate({ components }));
            }
            // Clamp step if we're on Variables step which doesn't exist for auth
            if (activeStep >= steps.length) {
                setActiveStep(steps.length - 1);
            }
        }
    }, [isAuthentication]);

    const handleNext = () => {
        setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        setActiveStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const templateModel = new TemplateModel(template);
            const payload = templateModel.toApiPayload();

            if (mode === "edit") {
                await dispatch(
                    updateTemplate({ templateId: template.id, templateData: payload })
                ).unwrap();
            } else {
                await dispatch(addTemplate(payload)).unwrap();
            }
            navigate("/template");
        } catch (error) {
            console.error("Failed to save template:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStepContent = (stepIndex) => {
        const props = { template, dispatch, updateCurrentTemplate };
        switch (stepIndex) {
            case 0:
                return <BasicInfoStep {...props} />;
            case 1:
                return <ContentStep {...props} />;
            case 2:
                return <ButtonsStep {...props} />;
            case 3:
                return <VariablesStep {...props} />;
            default:
                return null;
        }
    };

    const isLastStep = activeStep === steps.length - 1;

    return (
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column", bgcolor: "#f5f7f9" }}>
            {/* Top Header with back arrow and title */}
            <Paper
                elevation={0}
                sx={{
                    px: 3,
                    py: 1.5,
                    borderBottom: 1,
                    borderColor: "divider",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                }}
            >
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/template")}
                    sx={{ color: "text.primary", textTransform: "none" }}
                >
                    Create new template
                </Button>
            </Paper>

            {/* Stepper */}
            <Paper elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Box sx={{ maxWidth: 900, mx: "auto", py: 1 }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((step, index) => (
                            <Step key={step.key} completed={activeStep > index}>
                                <StepLabel
                                    sx={{
                                        cursor: "pointer",
                                        "& .MuiStepLabel-label": {
                                            fontSize: "0.85rem",
                                        },
                                    }}
                                    onClick={() => setActiveStep(index)}
                                >
                                    {step.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Paper>

            {/* Main Content Area */}
            <Box sx={{ flex: 1, overflow: "hidden", p: 3 }}>
                <Grid container spacing={3} sx={{ height: "100%" }}>
                    {/* Left: Form */}
                    <Grid
                        item
                        xs={12}
                        md={8}
                        sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <Box sx={{ flex: 1, overflow: "auto", pb: 2 }}>
                            {getStepContent(activeStep)}
                        </Box>

                        {/* Navigation Buttons */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                                pt: 2,
                            }}
                        >
                            {activeStep > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={handleBack}
                                    sx={{ textTransform: "none" }}
                                >
                                    Back
                                </Button>
                            )}

                            {isLastStep ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    startIcon={
                                        loading && <CircularProgress size={18} color="inherit" />
                                    }
                                    sx={{
                                        bgcolor: "#128C7E",
                                        "&:hover": { bgcolor: "#075E54" },
                                        textTransform: "none",
                                        px: 4,
                                    }}
                                >
                                    {mode === "edit" ? "Update Template" : "Submit Template"}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        bgcolor: "#128C7E",
                                        "&:hover": { bgcolor: "#075E54" },
                                        textTransform: "none",
                                        px: 4,
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Grid>

                    {/* Right: Preview */}
                    <Grid item xs={12} md={4} sx={{ height: "100%" }}>
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Typography
                                variant="subtitle1"
                                sx={{ fontWeight: 600, mb: 2, alignSelf: "flex-start" }}
                            >
                                Message preview
                            </Typography>
                            <TemplatePreview template={template} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
