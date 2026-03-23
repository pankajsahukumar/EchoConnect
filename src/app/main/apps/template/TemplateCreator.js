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
    Container,
    Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BasicInfoStep from "./steps/BasicInfoStep";
import ContentStep from "./steps/ContentStep";
import ButtonsStep from "./steps/ButtonsStep";
import TemplatePreview from "./TemplatePreview";
import {
    selectCurrentTemplate,
    setCurrentTemplate,
    resetCurrentTemplate,
    updateCurrentTemplate
} from "./store/templateFormSlice";
import { addTemplate, updateTemplate, getTemplateById, selectTemplateById } from "./store/templateSlice";
import TemplateModel from "src/@models/TemplateModel";

const steps = [
    { label: "Basic Info", key: "basic" },
    { label: "Content", key: "content" },
    { label: "Buttons", key: "buttons" },
];

export default function TemplateCreator({ mode = 'create' }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { templateId } = useParams();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const template = useSelector(selectCurrentTemplate);

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

            if (mode === 'edit') {
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
        switch (stepIndex) {
            case 0:
                return <BasicInfoStep template={template} dispatch={dispatch} updateCurrentTemplate={updateCurrentTemplate} />;
            case 1:
                return <ContentStep template={template} dispatch={dispatch} updateCurrentTemplate={updateCurrentTemplate} />;
            case 2:
                return <ButtonsStep template={template} dispatch={dispatch} updateCurrentTemplate={updateCurrentTemplate} />;
            default:
                return "Unknown step";
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#f5f7f9' }}>
            {/* Header Stepper */}
            <Paper elevation={0} sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Container maxWidth="lg">
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {steps.map((step) => (
                            <Step key={step.key}>
                                <StepLabel>{step.label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Container>
            </Paper>

            {/* Main Content */}
            <Box sx={{ flex: 1, overflow: 'hidden', p: 3 }}>
                <Container maxWidth="xl" sx={{ height: '100%' }}>
                    <Grid container spacing={3} sx={{ height: '100%' }}>
                        {/* Left: Form */}
                        <Grid item xs={12} md={8} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Paper sx={{ p: 4, flex: 1, overflow: 'auto', borderRadius: 2 }}>
                                {getStepContent(activeStep)}
                            </Paper>

                            {/* Navigation Buttons */}
                            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    variant="outlined"
                                >
                                    Back
                                </Button>
                                <Box>
                                    {activeStep === steps.length - 1 ? (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            startIcon={loading && <CircularProgress size={20} color="inherit" />}
                                            sx={{ bgcolor: '#128C7E', '&:hover': { bgcolor: '#075E54' } }}
                                        >
                                            {mode === 'edit' ? 'Update Template' : 'Submit Template'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={handleNext}
                                            sx={{ bgcolor: '#128C7E', '&:hover': { bgcolor: '#075E54' } }}
                                        >
                                            Next
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right: Preview */}
                        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
                            <Paper sx={{ p: 2, height: '100%', borderRadius: 2, bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Message preview
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {template.name || 'Template Name'} ({template.language || 'en'})
                                </Typography>
                                <Box sx={{ flex: 1, mt: 2, overflow: 'auto' }}>
                                    <TemplatePreview template={template} />
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
}
