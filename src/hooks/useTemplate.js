
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentTemplate, selectTemplateErrors, setTemplateErrors, updateCurrentTemplate } from 'src/app/main/apps/chat/store/templateFormSlice';
import * as MessageUtils from 'src/utils/messageUtils';

export function useTemplate() {
  const dispatch = useDispatch();
  const storeTemplate = useSelector(selectCurrentTemplate);
  const errors = useSelector(selectTemplateErrors);
  
  // Use template from store or initialize with default values
  const template = storeTemplate;

  const updateTemplate = (changes) => {
    dispatch(updateCurrentTemplate(changes));
  };

  const updateComponent = (type, data) => {
    const components = template?.components?.filter(c => c.type !== type) || [];
    components.push({ type, ...data });
    dispatch(updateCurrentTemplate({ components }));
  };

  /**
   * Validate the entire template
   */
  const validateTemplate = () => {
    return MessageUtils.validateTemplate(template);
  };

  /**
   * Validate template data based on the current step
   */
  const validateCurrentStep = (step) => {
    let validationResult=MessageUtils.validateTemplateData(template,step);
    if(!validationResult.isValid){
        dispatch(setTemplateErrors({step,errors:validationResult.errors}));
      return false;
    }
    dispatch(setTemplateErrors({ step: step, errors: {} }));
    return true;
  };

  /**
   * Format template for submission
   */
  const formatTemplateForSubmission = () => {
    return MessageUtils.formatTemplateForMetaApi(template);
  };

  return { 
    template, 
    errors,
    updateTemplate, 
    updateComponent, 
    validateTemplate, 
    validateCurrentStep,
    formatTemplateForSubmission
  };
}
