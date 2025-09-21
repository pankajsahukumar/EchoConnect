// hooks/useTemplate.js
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentTemplate, updateCurrentTemplate } from 'src/store/templatesSlice';

export function useTemplate() {
  const dispatch = useDispatch();
  const template =  {
    name: '',
    category: 'MARKETING',
    language: 'en_US',
    components: []
  };

  const updateTemplate = (changes) => {
    dispatch(updateCurrentTemplate(changes));
  };

  const updateComponent = (type, data) => {
    const components = template.components.filter(c => c.type !== type);
    components.push({ type, ...data });
    dispatch(updateCurrentTemplate({ components }));
  };

  return { template, updateTemplate, updateComponent };
}
