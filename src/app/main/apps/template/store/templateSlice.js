import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'src/@api/utils/apiClient';

const templatesAdapter = createEntityAdapter({});

export const getTemplates = createAsyncThunk(
    'templateApp/templates/getTemplates',
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await apiClient.get('/api/templates', { params });
            const wrapper = response?.data;
            const content = (wrapper && wrapper.data && Array.isArray(wrapper.data.content)) ? wrapper.data.content : [];
            return content;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message || err);
        }
    }
);

export const addTemplate = createAsyncThunk(
    'templateApp/templates/addTemplate',
    async (templatePayload, { rejectWithValue }) => {
        try {
            const response = await apiClient.post('/api/templates', templatePayload);
            return response?.data?.data || response?.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message || err);
        }
    }
);

export const getTemplateById = createAsyncThunk(
    'templateApp/templates/getTemplateById',
    async (templateId, { rejectWithValue }) => {
        try {
            const response = await apiClient.get(`/api/templates/${templateId}`);
            return response?.data?.data || response?.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message || err);
        }
    }
);

export const updateTemplate = createAsyncThunk(
    'templateApp/templates/updateTemplate',
    async ({ templateId, templateData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/api/templates/${templateId}`, templateData);
            return response?.data?.data || response?.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message || err);
        }
    }
);

export const deleteTemplate = createAsyncThunk(
    'templateApp/templates/deleteTemplate',
    async (templateId, { rejectWithValue }) => {
        try {
            const response = await apiClient.delete(`/api/templates/${templateId}`);
            return { id: templateId };
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message || err);
        }
    }
);

export const {
    selectAll: selectTemplates,
    selectById: selectTemplateById,
    selectIds: selectTemplateIds
} = templatesAdapter.getSelectors((state) => state.templateApp.templates);

const templatesSlice = createSlice({
    name: 'templateApp/templates',
    initialState: templatesAdapter.getInitialState({
        loading: false,
        error: null,
    }),
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getTemplates.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTemplates.fulfilled, (state, action) => {
                templatesAdapter.setAll(state, action.payload);
                state.loading = false;
            })
            .addCase(getTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addTemplate.fulfilled, (state, action) => {
                templatesAdapter.addOne(state, action.payload);
            })
            .addCase(getTemplateById.fulfilled, (state, action) => {
                templatesAdapter.upsertOne(state, action.payload);
            })
            .addCase(updateTemplate.fulfilled, (state, action) => {
                templatesAdapter.upsertOne(state, action.payload);
            })
            .addCase(deleteTemplate.fulfilled, (state, action) => {
                templatesAdapter.removeOne(state, action.payload.id);
            });
    }
});

export default templatesSlice.reducer;
