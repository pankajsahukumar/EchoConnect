import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { customerApi } from 'src/@api/api/customer-api';

const customersAdapter = createEntityAdapter({});

// ─── Thunks ───────────────────────────────────────────────────

export const getCustomers = createAsyncThunk(
  'customersApp/customers/getCustomers',
  async (params = {}, { getState, rejectWithValue }) => {
    try {
      const { searchText, pagination } = getState().customersApp.customers;
      const queryParams = {
        search: searchText || undefined,
        pageNumber: pagination.page,
        pageSize: pagination.pageSize,
        ...params,
      };
      const response = await customerApi.getCustomers(queryParams);
      const wrapper = response?.data;
      const content =
        wrapper && wrapper.data && Array.isArray(wrapper.data.content)
          ? wrapper.data.content
          : [];
      const paginationData = wrapper?.data
        ? {
            page: wrapper.data.page ?? 1,
            pageSize: wrapper.data.pageSize ?? content.length,
            totalElements: wrapper.data.totalElements ?? content.length,
            totalPages: wrapper.data.totalPages ?? 1,
          }
        : {};
      return { content, pagination: paginationData };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

export const getCustomerDetail = createAsyncThunk(
  'customersApp/customers/getCustomerDetail',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await customerApi.getCustomerDetails(contactId);
      return response?.data?.data || response?.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message || err);
    }
  }
);

// ─── Selectors ────────────────────────────────────────────────

export const {
  selectAll: selectCustomers,
  selectById: selectCustomerById,
} = customersAdapter.getSelectors((state) => state.customersApp.customers);

// ─── Slice ────────────────────────────────────────────────────

const customersSlice = createSlice({
  name: 'customersApp/customers',
  initialState: customersAdapter.getInitialState({
    loading: false,
    error: null,
    searchText: '',
    pagination: {
      page: 1,
      pageSize: 20,
      totalElements: 0,
      totalPages: 0,
    },
    selectedCustomer: null,
    selectedCustomerLoading: false,
  }),
  reducers: {
    setSearchText: (state, action) => {
      state.searchText = action.payload;
    },
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        customersAdapter.setAll(state, action.payload.content);
        state.pagination = { ...state.pagination, ...action.payload.pagination };
        state.loading = false;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCustomerDetail.pending, (state) => {
        state.selectedCustomerLoading = true;
      })
      .addCase(getCustomerDetail.fulfilled, (state, action) => {
        state.selectedCustomer = action.payload;
        state.selectedCustomerLoading = false;
      })
      .addCase(getCustomerDetail.rejected, (state, action) => {
        state.selectedCustomerLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchText, clearSelectedCustomer } = customersSlice.actions;

export const selectCustomersLoading = (state) => state.customersApp.customers.loading;
export const selectSearchText = (state) => state.customersApp.customers.searchText;
export const selectPagination = (state) => state.customersApp.customers.pagination;
export const selectSelectedCustomer = (state) => state.customersApp.customers.selectedCustomer;
export const selectSelectedCustomerLoading = (state) => state.customersApp.customers.selectedCustomerLoading;

export default customersSlice.reducer;
