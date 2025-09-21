import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'src/@api/utils/apiClient';
import axios from 'axios';

// Async thunk to fetch templates from the API
export const getTemplates = createAsyncThunk(
  'chatApp/templates/getTemplates',
  async (params) => {
    const response = await apiClient.get('/api/get/templates');
    const data = await response.data;

    return data;
  }
);

// Async thunk to add a new template
export const addTemplate = createAsyncThunk(
  'chatApp/templates/addTemplate',
  async (templateData) => {
    try {
      // First, format the template for Meta API
      const metaTemplate = {
        name: templateData.name,
        language: templateData.language || 'en_US',
        category: templateData.category || 'MARKETING',
        components: []
      };

      // Process components for Meta API format
      templateData.components.forEach(component => {
        const formattedComponent = {
          type: component.type
        };

        if (component.type === 'HEADER') {
          formattedComponent.format = component.format || 'TEXT';
          
          if (component.format === 'TEXT' && component.text) {
            formattedComponent.text = component.text;
            
            // Extract variables and create example
            const variables = extractVariables(component.text);
            if (variables.length > 0) {
              formattedComponent.example = {
                header_text: variables.map(v => v.example || v.placeholder || '')
              };
            }
          } else if (component.format === 'IMAGE' && component.image?.url) {
            formattedComponent.example = {
              header_handle: [component.image.url]
            };
          }
        } 
        else if (component.type === 'BODY' && component.text) {
          formattedComponent.text = component.text;
          
          // Extract variables and create example
          const variables = extractVariables(component.text);
          if (variables.length > 0) {
            formattedComponent.example = {
              body_text: [variables.map(v => v.example || v.placeholder || '')]
            };
          }
        } 
        else if (component.type === 'FOOTER' && component.text) {
          formattedComponent.text = component.text;
        } 
        else if ((component.type === 'BUTTONS' || component.type === 'BUTTON') && component.buttons) {
          formattedComponent.type = 'BUTTONS';
          formattedComponent.buttons = component.buttons.map(button => ({
            type: button.type || 'QUICK_REPLY',
            text: button.text,
            ...(button.type === 'URL' && button.url && { url: button.url }),
            ...(button.type === 'PHONE_NUMBER' && button.phoneNumber && { phone_number: button.phoneNumber })
          }));
        }

        metaTemplate.components.push(formattedComponent);
      });

      // Submit to Meta API
      // For now, we'll just submit to our backend API which will handle the Meta API call
      const response = await apiClient.post('/api/templates', {
        template: metaTemplate,
        originalTemplate: templateData
      });

      const data = await response.data;
      return data;
    } catch (error) {
      console.error('Error submitting template:', error);
      throw error;
    }
  }
);

// Helper function to extract variables from template text
function extractVariables(text) {
  const variables = [];
  const regex = /\{\{([^}]+)\}\}/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const variable = match[1];
    variables.push({
      name: variable,
      placeholder: variable.match(/^\d+$/) ? `Example ${variable}` : variable,
      example: variable.match(/^\d+$/) ? 
        (variable === '1' ? 'Summer Sale' : 
         variable === '2' ? '25OFF' : 
         variable === '3' ? '25%' : `Example ${variable}`) : 
        variable
    });
  }
  
  return variables;
}

// Async thunk to get a template by ID
export const getTemplateById = createAsyncThunk(
  'chatApp/templates/getTemplateById',
  async (templateId) => {
    const response = await apiClient.get(`/api/templates/${templateId}`);
    const data = await response.data;

    return data;
  }
);

// Async thunk to update a template
export const updateTemplate = createAsyncThunk(
  'chatApp/templates/updateTemplate',
  async ({ templateId, templateData }) => {
    const response = await apiClient.put(`/api/templates/${templateId}`, templateData);
    const data = await response.data;

    return data;
  }
);

// Async thunk to delete a template
export const deleteTemplate = createAsyncThunk(
  'chatApp/templates/deleteTemplate',
  async (templateId) => {
    const response = await apiClient.delete(`/api/templates/${templateId}`);
    const data = await response.data;

    return data;
  }
);

// Entity adapter for templates
const templatesAdapter = createEntityAdapter({
  // // Sort templates by name
  // sortComparer: (a, b) => a.name.localeCompare(b.name),
});

// Export selectors
export const { 
  selectAll: selectTemplates, 
  selectById: selectTemplateById 
} = templatesAdapter.getSelectors(
  (state) => state.chatApp.templates
);

// Selector for current template
export const selectCurrentTemplate = (state) => state.chatApp.templates.currentTemplate;

// Create the templates slice
const templatesSlice = createSlice({
  name: 'chatApp/templates',
  initialState: templatesAdapter.getInitialState({
    currentTemplate: null,
    loading: false,
    error: null
  }),
  reducers: {
    // Add reducers for template management
    setCurrentTemplate: (state, action) => {
      state.currentTemplate = action.payload;
    },
    resetCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
    updateCurrentTemplate: (state, action) => {
      state.currentTemplate = {
        ...state.currentTemplate,
        ...action.payload
      };
    }
  },
  extraReducers: {
    // Get templates
    [getTemplates.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getTemplates.fulfilled]: (state, action) => {
      templatesAdapter.setAll(state, action.payload);
      state.loading = false;
    },
    [getTemplates.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    
    // Add template
    [addTemplate.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [addTemplate.fulfilled]: (state, action) => {
      templatesAdapter.addOne(state, action.payload);
      state.currentTemplate = action.payload;
      state.loading = false;
    },
    [addTemplate.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    
    // Get template by ID
    [getTemplateById.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [getTemplateById.fulfilled]: (state, action) => {
      state.currentTemplate = action.payload;
      state.loading = false;
    },
    [getTemplateById.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    
    // Update template
    [updateTemplate.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [updateTemplate.fulfilled]: (state, action) => {
      templatesAdapter.updateOne(state, {
        id: action.payload.id,
        changes: action.payload
      });
      state.currentTemplate = action.payload;
      state.loading = false;
    },
    [updateTemplate.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    },
    
    // Delete template
    [deleteTemplate.pending]: (state) => {
      state.loading = true;
      state.error = null;
    },
    [deleteTemplate.fulfilled]: (state, action) => {
      templatesAdapter.removeOne(state, action.payload.id);
      if (state.currentTemplate && state.currentTemplate.id === action.payload.id) {
        state.currentTemplate = null;
      }
      state.loading = false;
    },
    [deleteTemplate.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    }
  },
});

export const { setCurrentTemplate, resetCurrentTemplate, updateCurrentTemplate } = templatesSlice.actions;

export default templatesSlice.reducer;