// src/app/main/apps/chat/store/templatesSlice.js
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'src/@api/utils/apiClient'; // keep your apiClient

// ---------- Entity adapter ----------
const templatesAdapter = createEntityAdapter({
  // Optionally add sortComparer: (a, b) => a.name.localeCompare(b.name)
});

// ---------- Thunks ----------

// Fetch list with pagination support. `params` can include pageNumber, pageSize, filters, etc.
export const getTemplates = createAsyncThunk(
  'chatApp/templates/getTemplates',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/templates', { params });
      const wrapper = response?.data;
      // defensive checks
      const content = (wrapper && wrapper.data && Array.isArray(wrapper.data.content)) ? wrapper.data.content : [];
      const pagination = wrapper && wrapper.data ? {
        pageNumber: wrapper.data.pageNumber ?? 1,
        pageSize: wrapper.data.pageSize ?? content.length,
        totalElementCount: wrapper.data.totalElementCount ?? content.length,
        totalPageCount: wrapper.data.totalPageCount ?? 1
      } : {
        pageNumber: 1,
        pageSize: content.length,
        totalElementCount: content.length,
        totalPageCount: 1
      };

      // Return both content array and pagination object
      return { content, pagination };
    } catch (err) {
      // normalize error for rejected action
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

// Add a template — backend expected to return wrapper.data (the created template)
export const addTemplate = createAsyncThunk(
  'chatApp/templates/addTemplate',
  async (templatePayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/api/templates', templatePayload);
      const wrapper = response?.data;
      const created = wrapper && wrapper.data ? wrapper.data : wrapper;
      return created;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

// Get single template by id
export const getTemplateById = createAsyncThunk(
  'chatApp/templates/getTemplateById',
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/api/templates/${templateId}`);
      const wrapper = response?.data;
      const template = wrapper && wrapper.data ? wrapper.data : wrapper;
      return template;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

// Update template — backend returns wrapper.data (updated template)
export const updateTemplate = createAsyncThunk(
  'chatApp/templates/updateTemplate',
  async ({ templateId, templateData }, { rejectWithValue }) => {
    try {
      const response = await apiClient.put(`/api/templates/${templateId}`, templateData);
      const wrapper = response?.data;
      const updated = wrapper && wrapper.data ? wrapper.data : wrapper;
      return updated;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

// Delete template — backend returns wrapper.data with id or object describing deletion
export const deleteTemplate = createAsyncThunk(
  'chatApp/templates/deleteTemplate',
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await apiClient.delete(`/api/templates/${templateId}`);
      const wrapper = response?.data;
      const deleted = wrapper && wrapper.data ? wrapper.data : wrapper;
      // Return the id removed (prefer wrapper.data.id)
      return { id: deleted.id ?? templateId, raw: deleted };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

// ---------- Selectors ----------
export const {
  selectAll: selectTemplates,
  selectById: selectTemplateById,
  selectIds: selectTemplateIds
} = templatesAdapter.getSelectors((state) => state.chatApp.templates);

// ---------- Slice ----------
const initialState = templatesAdapter.getInitialState({
  // UI state
  currentTemplate: null,
  loading: false,
  error: null,
  // pagination metadata
  pagination: {
    pageNumber: 1,
    pageSize: 0,
    totalElementCount: 0,
    totalPageCount: 0
  }
});

const templatesSlice = createSlice({
  name: 'chatApp/templates',
  initialState,
  reducers: {
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
    },
    // Optional: set pagination manually
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload
      };
    }
  },
  extraReducers: (builder) => {
    builder
      // getTemplates
      .addCase(getTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplates.fulfilled, (state, action) => {
        // action.payload = { content: [], pagination: {...} }
        templatesAdapter.setAll(state, action.payload.content || []);
        state.pagination = { ...(action.payload.pagination || state.pagination) };
        state.loading = false;
      })
      .addCase(getTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // addTemplate
      .addCase(addTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTemplate.fulfilled, (state, action) => {
        // action.payload is created template object
        templatesAdapter.addOne(state, action.payload);
        state.currentTemplate = action.payload;
        state.loading = false;
      })
      .addCase(addTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // getTemplateById
      .addCase(getTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplateById.fulfilled, (state, action) => {
        // Upsert the fetched template and set currentTemplate
        templatesAdapter.upsertOne(state, action.payload);
        state.currentTemplate = action.payload;
        state.loading = false;
      })
      .addCase(getTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // updateTemplate
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        // action.payload is the updated template object
        const updated = action.payload;
        templatesAdapter.updateOne(state, {
          id: updated.id,
          changes: updated
        });
        state.currentTemplate = updated;
        state.loading = false;
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      // deleteTemplate
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        // action.payload = { id }
        templatesAdapter.removeOne(state, action.payload.id);
        if (state.currentTemplate && state.currentTemplate.id === action.payload.id) {
          state.currentTemplate = null;
        }
        state.loading = false;
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  }
});

// ---------- Exports ----------
export const {
  setCurrentTemplate,
  resetCurrentTemplate,
  updateCurrentTemplate,
  setPagination
} = templatesSlice.actions;

export const selectPagination = (state) => state.chatApp.templates.pagination;
export const selectLoading = (state) => state.chatApp.templates.loading;
export const selectTemplatesError = (state) => state.chatApp.templates.error;

export default templatesSlice.reducer;
