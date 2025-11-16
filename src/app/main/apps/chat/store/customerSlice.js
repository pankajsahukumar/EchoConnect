import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from 'src/@api/utils/apiClient';

export const getCustomer = createAsyncThunk(
  'chatApp/customer/getCustomer',
  async (contactId, { dispatch, getState }) => {
    const response = await apiClient.get(`/api/customers/details/${contactId}`);
    const data = await response.data.data;
    return data;
  }
);

const customerAdapter = createEntityAdapter({});

// export const { selectAll: selectContacts, selectById: selectContactById } =
//   contactsAdapter.getSelectors((state) => state.chatApp.contacts);

const customerSlice = createSlice({
  name: 'chatApp/customer',
  initialState: null,
  reducers: {
    setSelectedCustomer: (state, action) => action.payload,
  },
  extraReducers: {
    [getCustomer.fulfilled]: (state, action) => action.payload,
  },
});
export const { setSelectedCustomer } = customerSlice.actions;
export const selectCustomer = ({ chatApp }) => chatApp.customer;
export default customerSlice.reducer;
