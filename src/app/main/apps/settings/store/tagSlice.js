import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { tagApi } from 'src/@api/api/tag-api';

const tagsAdapter = createEntityAdapter({});

// ─── Thunks ───────────────────────────────────────────────────

export const getTags = createAsyncThunk(
  'settingsApp/tags/getTags',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { searchText } = getState().settingsApp.tags;
      const queryParams = {
        search: searchText,
        ...params,
      };
      const response = await tagApi.getTags(queryParams);
      const data = response?.data?.data;
      return Array.isArray(data) ? data : [];
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

export const addTag = createAsyncThunk(
  'settingsApp/tags/addTag',
  async (tagPayload, { rejectWithValue }) => {
    try {
      const response = await tagApi.createTag(tagPayload);
      return response?.data?.data || response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

export const updateTag = createAsyncThunk(
  'settingsApp/tags/updateTag',
  async ({ tagId, tagData }, { rejectWithValue }) => {
    try {
      const response = await tagApi.updateTag(tagId, tagData);
      return response?.data?.data || response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

export const deleteTag = createAsyncThunk(
  'settingsApp/tags/deleteTag',
  async (tagId, { rejectWithValue }) => {
    try {
      await tagApi.deleteTag(tagId);
      return { id: tagId };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

// ─── Selectors ────────────────────────────────────────────────

export const {
  selectAll: selectTags,
  selectById: selectTagById,
  selectIds: selectTagIds,
} = tagsAdapter.getSelectors((state) => state.settingsApp.tags);

// ─── Slice ────────────────────────────────────────────────────

const tagsSlice = createSlice({
  name: 'settingsApp/tags',
  initialState: tagsAdapter.getInitialState({
    loading: false,
    error: null,
    searchText: '',
  }),
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTags.fulfilled, (state, action) => {
        tagsAdapter.setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTag.fulfilled, (state, action) => {
        tagsAdapter.addOne(state, action.payload);
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        tagsAdapter.upsertOne(state, action.payload);
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        tagsAdapter.removeOne(state, action.payload.id);
      });
  },
});

export const { setSearchText } = tagsSlice.actions;

export const selectTagsLoading = (state) => state.settingsApp.tags.loading;
export const selectTagsSearchText = (state) => state.settingsApp.tags.searchText;
export const selectTagsError = (state) => state.settingsApp.tags.error;

export default tagsSlice.reducer;
