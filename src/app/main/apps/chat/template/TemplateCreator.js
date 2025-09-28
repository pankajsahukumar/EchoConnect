import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTemplate } from "src/hooks/useTemplate";
import {
  Box,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BasicInfoStep from "./steps/BasicInfoStep";
import ContentStep from "./steps/ContentStep";
import ButtonsStep from "./steps/ButtonsStep";
import VariablesStep from "./steps/VariablesStep";
import { addTemplate } from "../store/templateSlice";
import TemplatePreview from "./TemplatePreview";
import { TEMPLATE_STEPS, TEMPLATE_STEPS_LIST } from "src/Constants/TemplateStepContants";
import { setTemplateErrors } from "../store/templateFormSlice";

const steps = ["basicinfo", "Content", "Buttons", "Variables"];

export default function TemplateCreator() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(TEMPLATE_STEPS.BASIC.key);
  const [loading, setLoading] = useState(false);
  // Use the Redux-connected template hook
  const {
    template,
    errors,
    validateTemplate,
    validateCurrentStep,
    formatTemplateForSubmission,
  } = useTemplate();
  const handleNext = () => {
    // Validate current step before proceeding
    const isValidState = validateCurrentStep(activeStep);
    console.log(isValidState,"this is valid state",activeStep,"this is active")
    if (!isValidState) {
      // Set error message
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // Validate the entire template before submission
      const validationResult = validateTemplate();
      console.log(validationResult,"this is validateion error")
      if (!validationResult.isValid) {
        // setError(validationResult.error);
        return;
      }

      // setLoading(true);
      // setError(null);

      // // Format template for Meta API submission using the utility from useTemplate
      // const metaApiTemplate = formatTemplateForSubmission();

      // // Submit template to API
      // await dispatch(addTemplate(metaApiTemplate));
      // navigate("/apps/chat/templates");
      console.log(template,"this is tmplae to submit");
    } catch (error) {
      console.error("Failed to create template:", error);
      
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step) => {
    // Destructure the functions from useTemplate hook
    const { updateTemplate, updateComponent } = useTemplate();

    switch (step) {
      case TEMPLATE_STEPS.BASIC.key:
        return (
          <BasicInfoStep
            template={template}
            updateTemplate={updateTemplate}
            validateCurrentStep={() => validateCurrentStep(TEMPLATE_STEPS.BASIC.key)}
          />
        );
      case TEMPLATE_STEPS.CONTENT.key:
        return (
          <ContentStep
            template={template}
            updateComponent={updateComponent}
            validateCurrentStep={() => validateCurrentStep(TEMPLATE_STEPS.CONTENT.key)}
          />
        );
      case TEMPLATE_STEPS.BUTTONS.key:
        return (
          <ButtonsStep
            template={template}
            updateComponent={updateComponent}
            validateCurrentStep={() => validateCurrentStep(TEMPLATE_STEPS.BUTTONS.key)}
          />
        );
      case TEMPLATE_STEPS.VARIABLES.key:
        return (
          <VariablesStep
            template={template}
            updateTemplate={updateTemplate}
            validateCurrentStep={() => validateCurrentStep(TEMPLATE_STEPS.VARIABLES.key)}
          />
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
        }}
      >
        <IconButton
          edge="start"
          onClick={() => navigate("/apps/chat/templates")}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          New Template
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left side - Form */}
        <Box sx={{ flex: 2, p: 3, overflow: "auto" }}>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {TEMPLATE_STEPS_LIST.map((item) => {
              return (
                <Step key={item.key}>
                  <StepLabel>{item.displayName}</StepLabel>{" "}
                </Step>
              );
            })}
          </Stepper>

          <Paper sx={{ p: 3, mb: 3 }}>{getStepContent(activeStep)}</Paper>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              disabled={activeStep === TEMPLATE_STEPS.BASIC.key}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>
            <Box>
              {activeStep === TEMPLATE_STEPS.VARIABLES.key ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={
                    loading && <CircularProgress size={20} color="inherit" />
                  }
                >
                  {loading ? "Submitting..." : "Submit Template"}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                >
                  Next
                </Button>
              )}
            </Box>
          </Box>
        </Box>

        {/* Right side - Preview */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#f5f5f5",
            p: 3,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Message preview
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {template.name} ({template.language})
          </Typography>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              pt: 3,
            }}
          >
            <TemplatePreview template={template} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
