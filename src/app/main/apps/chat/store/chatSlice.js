import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { getChats } from './chatsSlice';

export const getChat = createAsyncThunk(
  'chatApp/chat/getChat',
  async (contactId, { dispatch, getState }) => {
    console.log('Getting chat for contactId:', contactId); // Debug log
    const response = await axios.get(`/api/chat/chats/${contactId}`);

    const data = await response.data;

    return data;
  }
);

export const sendMessage = createAsyncThunk(
  'chatApp/chat/sendMessage',
  async ({ contactId, messageText, type, payload, context }, { dispatch, getState }) => {
    const messageData = {
      type,
      payload,
      context,
    };
    const response = await axios.post(`/api/chat/chats/${contactId}`, messageData);

    const data = await response.data;

    // dispatch(getChats());

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

export const selectChat = ({ chatApp }) => chatApp.chat;

export default chatSlice.reducer;
