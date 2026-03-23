import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { templateApi } from 'src/@api/api/template-api';

const templatesAdapter = createEntityAdapter({});

// ─── Thunks ───────────────────────────────────────────────────

export const getTemplates = createAsyncThunk(
    'templateApp/templates/getTemplates',
    async (params = {}, { getState, rejectWithValue }) => {
        try {
            const { searchText, filters, pagination } = getState().templateApp.templates;
            const queryParams = {
                search: searchText,
                ...filters,
                page: pagination.page,
                pageSize: pagination.pageSize,
                ...params,
            };
            const response = await templateApi.getTemplates(queryParams);
            const wrapper = response?.data;
            const content = (wrapper && wrapper.data && Array.isArray(wrapper.data.content)) ? wrapper.data.content : [];
            const paginationData = wrapper?.data ? {
                page: wrapper.data.page ?? 1,
                pageSize: wrapper.data.pageSize ?? content.length,
                totalElements: wrapper.data.totalElements ?? content.length,
                totalPages: wrapper.data.totalPages ?? 1,
            } : {};
            return { content, pagination: paginationData };
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message || err);
        }
    }
);

export const addTemplate = createAsyncThunk(
    'templateApp/templates/addTemplate',
    async (templatePayload, { rejectWithValue }) => {
        try {
            const response = await templateApi.createTemplate(templatePayload);
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
            const response = await templateApi.getTemplateById(templateId);
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
            const response = await templateApi.updateTemplate(templateId, templateData);
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
            await templateApi.deleteTemplate(templateId);
            return { id: templateId };
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message || err);
        }
    }
);

export const getWABAs = createAsyncThunk(
    'templateApp/templates/getWABAs',
    async (_, { rejectWithValue }) => {
        try {
            const response = await templateApi.getWABAs();
            return response?.data?.data || [];
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message || err);
        }
    }
);

export const getAgents = createAsyncThunk(
    'templateApp/templates/getAgents',
    async (_, { rejectWithValue }) => {
        try {
            const response = await templateApi.getAgents();
            return response?.data?.data || [];
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message || err);
        }
    }
);

// ─── Selectors ────────────────────────────────────────────────

export const {
    selectAll: selectTemplates,
    selectById: selectTemplateById,
    selectIds: selectTemplateIds
} = templatesAdapter.getSelectors((state) => state.templateApp.templates);

// ─── Slice ────────────────────────────────────────────────────

const templatesSlice = createSlice({
    name: 'templateApp/templates',
    initialState: templatesAdapter.getInitialState({
        loading: false,
        error: null,
        searchText: '',
        filters: {
            status: 'all',
            category: 'all',
            waba: 'all',
            agent: 'all',
        },
        pagination: {
            page: 1,
            pageSize: 20,
            totalElements: 0,
            totalPages: 0,
        },
        wabaOptions: [],
        agentOptions: [],
    }),
    reducers: {
        setSearchText: (state, action) => {
            state.searchText = action.payload;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetFilters: (state) => {
            state.searchText = '';
            state.filters = { status: 'all', category: 'all', waba: 'all', agent: 'all' };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getTemplates.fulfilled, (state, action) => {
                templatesAdapter.setAll(state, action.payload.content);
                state.pagination = { ...state.pagination, ...action.payload.pagination };
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
            })
            .addCase(getWABAs.fulfilled, (state, action) => {
                state.wabaOptions = action.payload;
            })
            .addCase(getAgents.fulfilled, (state, action) => {
                state.agentOptions = action.payload;
            });
    }
});

export const { setSearchText, setFilters, resetFilters } = templatesSlice.actions;

export const selectLoading = (state) => state.templateApp.templates.loading;
export const selectTemplateFilters = (state) => state.templateApp.templates.filters;
export const selectSearchText = (state) => state.templateApp.templates.searchText;
export const selectPagination = (state) => state.templateApp.templates.pagination;
export const selectWabaOptions = (state) => state.templateApp.templates.wabaOptions;
export const selectAgentOptions = (state) => state.templateApp.templates.agentOptions;

export default templatesSlice.reducer;
