import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'src/@api/utils/apiClient';

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
    const response = await apiClient.post('/api/templates', templateData);
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
export const { selectAll: selectTemplates, selectById: selectTemplateById } = templatesAdapter.getSelectors(
  (state) => state.chatApp.templates
);

// Create the templates slice
const templatesSlice = createSlice({
  name: 'chatApp/templates',
  initialState: templatesAdapter.getInitialState(),
  reducers: {
    // Add any additional reducers here if needed
  },
  extraReducers: {
    [getTemplates.fulfilled]: templatesAdapter.setAll,
    [addTemplate.fulfilled]: templatesAdapter.addOne,
  },
});

export default templatesSlice.reducer;