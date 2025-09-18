import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from 'src/@api/utils/apiClient';

export const getChat = createAsyncThunk(
  'chatApp/chat/getChat',
  async (contactId, { dispatch, getState }) => {
    const response = await apiClient.get(`/api/get/messages/${contactId}`);

    const data = await response.data;

    return data;
  }
);

export const sendMessage = createAsyncThunk(
  'chatApp/chat/sendMessage',
  async (messageData, { dispatch, getState }) => {
    
    const response = await apiClient.post(`/api/chat/send`, messageData);

    const data = await response.data;

    return data;
  }
);

const chatSlice = createSlice({
  name: 'chatApp/chat',
  initialState: [],
  reducers: {
    removeChat: (state, action) => action.payload,
    addTempMessage: (state, action) => [...state, action.payload],
  },
  extraReducers: {
    [getChat.fulfilled]: (state, action) => action.payload,
    [sendMessage.fulfilled]: (state, action) => [...state, action.payload],
  },
});
export const { addTempMessage } = chatSlice.actions;
export const selectChat = ({ chatApp }) => chatApp.chat;

export default chatSlice.reducer;
