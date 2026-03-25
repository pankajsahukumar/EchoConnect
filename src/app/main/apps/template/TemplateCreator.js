import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Button,
    Stepper,
    Step,
    StepLabel,
    Typography,
    CircularProgress,
    IconButton,
    Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BasicInfoStep from "./steps/BasicInfoStep";
import ContentStep from "./steps/ContentStep";
import ButtonsStep from "./steps/ButtonsStep";
import VariablesStep, { hasVariables } from "./steps/VariablesStep";
import TemplatePreview from "./TemplatePreview";
import {
    selectCurrentTemplate,
    setCurrentTemplate,
    resetCurrentTemplate,
    updateCurrentTemplate
} from "./store/templateFormSlice";
import { addTemplate, updateTemplate, getTemplateById } from "./store/templateSlice";
import TemplateModel from "src/@models/TemplateModel";

const BASE_STEPS = [
    { label: "Basic Info", key: "basic" },
    { label: "Content", key: "content" },
    { label: "Buttons", key: "buttons" },
];

const VARIABLES_STEP = { label: "Variables", key: "variables" };

export default function TemplateCreator({ mode = 'create' }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { templateId } = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const template = useSelector(selectCurrentTemplate);

    // Determine if Variables step should show
    const showVariablesStep = useMemo(() => hasVariables(template), [template]);

    const steps = useMemo(() => {
        if (showVariablesStep) {
            return [...BASE_STEPS, VARIABLES_STEP];
        }
        return BASE_STEPS;
    }, [showVariablesStep]);

    // If Variables step disappears and user was on it, move back
    useEffect(() => {
        if (activeStep >= steps.length) {
            setActiveStep(steps.length - 1);
        }
    }, [steps.length, activeStep]);

    useEffect(() => {
        if (mode === 'edit' && templateId) {
            dispatch(getTemplateById(templateId))
                .unwrap()
                .then((tmpl) => {
                    dispatch(setCurrentTemplate(new TemplateModel(tmpl)));
                })
                .catch(() => {
                    // Handle error
                });
        } else {
            dispatch(resetCurrentTemplate());
        }
    }, [mode, templateId, dispatch]);

    const handleNext = () => {
        setActiveStep((prev) => prev + 1);
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const templateModel = new TemplateModel(template);
            const payload = templateModel.toApiPayload();

            if (mode === 'edit' && template.id) {
                await dispatch(updateTemplate({ templateId: template.id, templateData: payload })).unwrap();
            } else {
                await dispatch(addTemplate(payload)).unwrap();
            }
            navigate('/apps/templates');
        } catch (error) {
            console.error("Failed to save template:", error);
        } finally {
            setLoading(false);
        }
    };

    const getStepContent = (stepIndex) => {
        const stepKey = steps[stepIndex]?.key;
        switch (stepKey) {
            case 'basic':
                return <BasicInfoStep template={template} dispatch={dispatch} updateCurrentTemplate={updateCurrentTemplate} />;
            case 'content':
                return <ContentStep template={template} dispatch={dispatch} updateCurrentTemplate={updateCurrentTemplate} />;
            case 'buttons':
                return <ButtonsStep template={template} dispatch={dispatch} updateCurrentTemplate={updateCurrentTemplate} />;
            case 'variables':
                return <VariablesStep template={template} dispatch={dispatch} updateCurrentTemplate={updateCurrentTemplate} />;
            default:
                return "Unknown step";
        }
    };

    const isLastStep = activeStep === steps.length - 1;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1300,
                bgcolor: '#f5f7f9',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Top Header with back arrow + title */}
            <Box
                sx={{
                    px: 3,
                    py: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    bgcolor: 'white',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    flexShrink: 0,
                }}
            >
                <IconButton onClick={() => navigate('/apps/templates')} sx={{ mr: 1.5 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {mode === 'edit' ? 'Edit template' : 'Create new template'}
                </Typography>
            </Box>

            {/* Stepper */}
            <Box sx={{ bgcolor: 'white', borderBottom: '1px solid', borderColor: 'divider', py: 1.5, flexShrink: 0 }}>
                <Box sx={{ maxWidth: 900, mx: 'auto' }}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((step, index) => (
                            <Step key={step.key}>
                                <StepLabel
                                    StepIconProps={{
                                        sx: {
                                            '&.Mui-active': { color: '#25D366' },
                                            '&.Mui-completed': { color: '#25D366' },
                                        },
                                    }}
                                >
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: activeStep === index ? 600 : 400,
                                            color: activeStep === index ? 'text.primary' : 'text.secondary',
                                        }}
                                    >
                                        {step.label}
                                    </Typography>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', minHeight: 0 }}>
                <Grid container sx={{ height: '100%', flex: 1 }}>
                    {/* Left: Form Area */}
                    <Grid
                        item
                        xs={12}
                        md={8}
                        lg={8}
                        sx={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                flex: 1,
                                overflow: 'auto',
                                p: 3,
                                '&::-webkit-scrollbar': { width: 6 },
                                '&::-webkit-scrollbar-thumb': {
                                    bgcolor: 'rgba(0,0,0,0.15)',
                                    borderRadius: 3,
                                },
                            }}
                        >
                            <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                                {getStepContent(activeStep)}
                            </Box>
                        </Box>

                        {/* Bottom Navigation */}
                        <Box
                            sx={{
                                px: 3,
                                py: 2,
                                bgcolor: 'white',
                                borderTop: '1px solid',
                                borderColor: 'divider',
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: 2,
                                flexShrink: 0,
                            }}
                        >
                            {activeStep > 0 && (
                                <Button
                                    onClick={handleBack}
                                    variant="outlined"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 3,
                                        borderColor: 'divider',
                                        color: 'text.primary',
                                    }}
                                >
                                    Back
                                </Button>
                            )}
                            {isLastStep ? (
                                <Button
                                    variant="contained"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    startIcon={loading && <CircularProgress size={18} color="inherit" />}
                                    sx={{
                                        bgcolor: '#25D366',
                                        '&:hover': { bgcolor: '#1da851' },
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 3,
                                    }}
                                >
                                    {mode === 'edit' ? 'Update Template' : 'Submit Template'}
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        bgcolor: '#25D366',
                                        '&:hover': { bgcolor: '#1da851' },
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 3,
                                    }}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Grid>

                    {/* Right: Message Preview */}
                    <Grid
                        item
                        xs={12}
                        md={4}
                        lg={4}
                        sx={{
                            height: '100%',
                            borderLeft: '1px solid',
                            borderColor: 'divider',
                            bgcolor: 'white',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                        }}
                    >
                        <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                Message preview
                            </Typography>
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                overflow: 'auto',
                                p: 2,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <TemplatePreview template={template} />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
