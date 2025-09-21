import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BasicInfoStep from './steps/BasicInfoStep';
import ContentStep from './steps/ContentStep';
import ButtonsStep from './steps/ButtonsStep';
import VariablesStep from './steps/VariablesStep';
import { addTemplate } from '../store/templateSlice';
import TemplatePreview from './TemplatePreview';

const steps = ['Basic Info', 'Content', 'Buttons', 'Variables'];

export default function TemplateCreator() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [template, setTemplate] = useState({
    name: '',
    category: '',
    components: [
      {
        type: 'HEADER',
        format: 'TEXT',
        text: '',
        example: {  }
      },
      {
        type: 'BODY',
        text: '',
        example: { }
      },
      {
        type: 'FOOTER',
        text: '',
      },
      {
        type: 'BUTTONS',
        buttons: []
      }
    ],
    language: 'en_US',
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Format template for Meta API submission
      const metaApiTemplate = formatTemplateForMetaApi(template);
      
      // Submit template to API
      await dispatch(addTemplate(metaApiTemplate));
      navigate('/apps/chat/templates');
    } catch (error) {
      console.error('Failed to create template:', error);
      setError('Failed to create template. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // // Format template to match Meta API requirements
  // const formatTemplateForMetaApi = (template) => {
  //   // Create a deep copy to avoid mutating the original state
  //   const formattedTemplate = {
  //     name: template.name,
  //     language: template.language,
  //     category: template.category.toUpperCase(),
  //     components: []
  //   };
    
  //   // Process each component
  //   template.components.forEach(component => {
  //     // Skip empty components
  //     if (component.type === 'HEADER' && component.format === 'NONE') {
  //       return;
  //     }
      
  //     if (component.type === 'HEADER' && component.format === 'TEXT' && component.text) {
  //       // Format header with text
  //       const headerComponent = {
  //         type: 'HEADER',
  //         format: 'TEXT',
  //         text: component.text,
  //         example: {
  //           header_text: [component.example.header_text || component.text]
  //         }
  //       };
  //       formattedTemplate.components.push(headerComponent);
  //     } else if (component.type === 'HEADER' && component.format === 'IMAGE' && component.image?.url) {
  //       // Format header with image
  //       const headerComponent = {
  //         type: 'HEADER',
  //         format: 'IMAGE',
  //         example: {
  //           header_handle: ['[image]']
  //         }
  //       };
  //       // In a real implementation, you would upload the image to Meta's servers
  //       // and get a handle back, which would be used here
  //       formattedTemplate.components.push(headerComponent);
  //     }
      
  //     if (component.type === 'BODY' && component.text) {
  //       // Extract variables from body text
  //       const variables = extractVariables(component.text);
  //       const bodyComponent = {
  //         type: 'BODY',
  //         text: component.text,
  //         example: {
  //           body_text: [variables.map(v => v.defaultValue || '')]
  //         }
  //       };
  //       formattedTemplate.components.push(bodyComponent);
  //     }
      
  //     if (component.type === 'FOOTER' && component.text) {
  //       const footerComponent = {
  //         type: 'FOOTER',
  //         text: component.text
  //       };
  //       formattedTemplate.components.push(footerComponent);
  //     }
      
  //     if ((component.type === 'BUTTON' || component.type === 'BUTTONS') && component.buttons?.length > 0) {
  //       const buttonsComponent = {
  //         type: 'BUTTONS',
  //         buttons: component.buttons.map(button => ({
  //           type: button.type || 'QUICK_REPLY',
  //           text: button.text
  //         }))
  //       };
  //       formattedTemplate.components.push(buttonsComponent);
  //     }
  //   });
    
  //   return formattedTemplate;
  // };
  
  // // Extract variables from text (e.g., {{1}}, {{variable_name}})
  // const extractVariables = (text) => {
  //   const regex = /{{([^}]+)}}/g;
  //   const variables = [];
  //   let match;
    
  //   while ((match = regex.exec(text)) !== null) {
  //     variables.push({
  //       name: match[1],
  //       defaultValue: ''
  //     });
  //   }
    
  //   return variables;
  // };

  const updateTemplate = useCallback((updates) => {
    setTemplate((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const updateComponent = useCallback((type, updates) => {
    setTemplate((prev) => {
      const newComponents = prev.components.map((comp) => {
        if (comp.type === type) {
          return { ...comp, ...updates };
        }
        return comp;
      });
      return { ...prev, components: newComponents };
    });
  }, []);

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <BasicInfoStep 
            template={template} 
            updateTemplate={updateTemplate} 
          />
        );
      case 1:
        return (
          <ContentStep 
            template={template} 
            updateComponent={updateComponent} 
          />
        );
      case 2:
        return (
          <ButtonsStep 
            template={template} 
            updateComponent={updateComponent} 
          />
        );
      case 3:
        return (
          <VariablesStep 
            template={template} 
            updateTemplate={updateTemplate} 
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center' }}>
        <IconButton edge="start" onClick={() => navigate('/apps/chat/templates')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          New Template
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left side - Form */}
        <Box sx={{ flex: 2, p: 3, overflow: 'auto' }}>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper sx={{ p: 3, mb: 3 }}>
            {getStepContent(activeStep)}
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
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
                >
                  {loading ? 'Submitting...' : 'Submit Template'}
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
        <Box sx={{ flex: 1, bgcolor: '#f5f5f5', p: 3, display: 'flex', flexDirection: 'column' }}>
          <Typography variant="h6" gutterBottom>
            Message preview
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {template.name} ({template.language})
          </Typography>
          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', pt: 3 }}>
            <TemplatePreview template={template} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}