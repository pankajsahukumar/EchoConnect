// src/utils/messageUtils.js
import { TEMPLATE_STEPS } from 'src/Constants/TemplateStepContants';
import * as yup from 'yup';

/**
 * Generate a unique message ID
 */
export const generateMessageId = () => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Validate template data based on the current step
 * @param {Object} template - The template object
 * @param {Number} step - The current step index
 * @returns {Object} - { isValid, errors }
 */
export const validateTemplateData = (template, step) => {
  switch (step) {
    case TEMPLATE_STEPS.BASIC.key: // Basic Info
      return validateBasicInfo(template);
    case TEMPLATE_STEPS.CONTENT.key: // Content
      return validateContent(template);
    case TEMPLATE_STEPS.BUTTONS.key: // Buttons
      return validateButtons(template);
    case TEMPLATE_STEPS.VARIABLES.key: // Variables
      return validateVariables(template);
    default:
      return { isValid: true, errors: {} };
  }
};

/**
 * Validate the basic info step
 */
const validateBasicInfo = (template) => {
  const schema = yup.object().shape({
    name: yup
      .string()
      .required('Template name is required')
      .matches(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers and underscores allowed'),
    category: yup.string().required('Category is required'),
    language: yup.string().required('Language is required')
  });

  try {
    schema.validateSync(template, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.inner.forEach(err => {
      errors[err.path] = err.message;
    });
    return { isValid: false, errors };
  }
};

/**
 * Validate the content step
 */
const validateContent = (template) => {
  const bodyComponent = template.components.find(c => c.type === 'BODY');
  const headerComponent = template.components.find(c => c.type === 'HEADER');

  const errors = {};
  let isValid = true;

  // Validate body
  if (!bodyComponent?.text?.trim()) {
    errors.body = 'Message body is required';
    isValid = false;
  }

  // Validate header (if not NONE)
  if (headerComponent && headerComponent.format !== 'NONE') {
    if (headerComponent.format === 'TEXT' && !headerComponent.text?.trim()) {
      errors.header = 'Header text is required';
      isValid = false;
    } else if (headerComponent.format === 'IMAGE' && !headerComponent.image?.url?.trim()) {
      errors.header = 'Header image is required';
      isValid = false;
    } else if ((headerComponent.format === 'VIDEO' || headerComponent.format === 'DOCUMENT') && !headerComponent.example?.header_handle?.length) {
      errors.header = `${headerComponent.format.toLowerCase()} header is required`;
      isValid = false;
    }
  }

  return { isValid, errors };
};


/**
 * Validate the buttons step
 */
const validateButtons = (template) => {
  // Find the buttons component
  const buttonsComponent = template.components.find(c => c.type === 'BUTTONS');
  const buttons = buttonsComponent?.buttons || [];
  
  const errors = {};
  let isValid = true;

  buttons.forEach((button, index) => {
    // Skip STOP button if added automatically
    if (button.text === 'STOP') return;

    // Validate button text
    if (!button.text || !button.text.trim()) {
      errors[index] = 'Button text is required';
      isValid = false;
      return;
    }

    // Validate URL type
    if (button.type === 'URL') {
      const urlSchema = yup.string().url('Invalid URL').required('URL is required');
      try {
        urlSchema.validateSync(button.url || '');
      } catch (err) {
        errors[index] = err.message;
        isValid = false;
      }
    }

    // Validate PHONE_NUMBER type
    if (button.type === 'PHONE_NUMBER') {
      const phoneSchema = yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .required('Phone number is required');
      try {
        phoneSchema.validateSync(button.phoneNumber || '');
      } catch (err) {
        errors[index] = err.message;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

/**
 * Validate the variables step
 */
const validateVariables = (template) => {
  // Variables are validated in the VariablesStep component itself
  return { isValid: true, errors: {} };
};

/**
 * Validate the entire template
 */
export const validateTemplate = (template) => {
  const basicInfoValidation = validateBasicInfo(template);
  const contentValidation = validateContent(template);
  const buttonsValidation = validateButtons(template);
  const variablesValidation = validateVariables(template);
  
  const isValid = (
    basicInfoValidation.isValid && 
    contentValidation.isValid && 
    buttonsValidation.isValid && 
    variablesValidation.isValid
  );
  
  const errors = {
    ...basicInfoValidation.errors,
    ...contentValidation.errors,
    ...buttonsValidation.errors,
    ...variablesValidation.errors
  };
  
  return { isValid, errors };
};

/**
 * Format template for Meta API submission
 */
export const formatTemplateForMetaApi = (template) => {
  // Create a deep copy to avoid mutating the original state
  const formattedTemplate = {
    name: template.name,
    language: template.language,
    category: template.category.toUpperCase(),
    components: []
  };
  
  // Process each component
  template.components.forEach(component => {
    // Skip empty components
    if (component.type === 'HEADER' && component.format === 'NONE') {
      return;
    }
    
    if (component.type === 'HEADER' && component.format === 'TEXT' && component.text) {
      // Format header with text
      const headerComponent = {
        type: 'HEADER',
        format: 'TEXT',
        text: component.text,
        example: {
          header_text: [component.example?.header_text || component.text]
        }
      };
      formattedTemplate.components.push(headerComponent);
    } else if (component.type === 'HEADER' && component.format === 'IMAGE' && component.image?.url) {
      // Format header with image
      const headerComponent = {
        type: 'HEADER',
        format: 'IMAGE',
        example: {
          header_handle: [component.image.url]
        }
      };
      formattedTemplate.components.push(headerComponent);
    }
    
    if (component.type === 'BODY' && component.text) {
      // Extract variables from body text
      const variables = extractVariables(component.text);
      const bodyComponent = {
        type: 'BODY',
        text: component.text,
        example: {
          body_text: [variables.map(v => v.defaultValue || '')]
        }
      };
      formattedTemplate.components.push(bodyComponent);
    }
    
    if (component.type === 'FOOTER' && component.text) {
      const footerComponent = {
        type: 'FOOTER',
        text: component.text
      };
      formattedTemplate.components.push(footerComponent);
    }
    
    if ((component.type === 'BUTTON' || component.type === 'BUTTONS') && component.buttons?.length > 0) {
      const buttonsComponent = {
        type: 'BUTTONS',
        buttons: component.buttons.map(button => ({
          type: button.type || 'QUICK_REPLY',
          text: button.text
        }))
      };
      formattedTemplate.components.push(buttonsComponent);
    }
  });
  
  return formattedTemplate;
};

// Extract variables from text (e.g., {{1}}, {{variable_name}})
const extractVariables = (text) => {
  const regex = /{{([^}]+)}}/g;
  const variables = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    variables.push({
      name: match[1],
      defaultValue: ''
    });
  }
  
  return variables;
};