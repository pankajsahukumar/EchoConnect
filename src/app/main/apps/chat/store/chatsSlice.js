import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';
import { apiClient } from 'src/@api/utils/apiClient';

export const getChats = createAsyncThunk('chatApp/chats/getChats', async (params) => {
  const response = await apiClient.get('/api/get/chats');
  const data = await response.data;

  return data;
});

export const addChat = createAsyncThunk('chats/addChat', async (chatData) => {
  // const response = await createChat(chatData);
  return  {
    "id": "ff6bc7f1-449a-4419-af62-b89ce6cae0aa5",
    "contactId": "9d3f0e7f-dcbd-4e56-a5e8-87b8154e9edfg",
    "unreadCount": 2,
    "muted": false,
    "lastMessage": "Testing Pankaj!",
    "lastMessageAt": "2024-01-05T15:56:48.732Z"
  };
});
const chatsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    const timeA = a?.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const timeB = b?.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return timeB - timeA; // newest first
  },
});


export const { selectAll: selectChats, selectById: selectChatById } = chatsAdapter.getSelectors(
  (state) => state.chatApp.chats
);

const chatsSlice = createSlice({
  name: 'chatApp/chats',
  initialState: chatsAdapter.getInitialState(),
  extraReducers: {
    [getChats.fulfilled]: chatsAdapter.setAll,
    [addChat.fulfilled]:  chatsAdapter.addOne,
  },
});

export default chatsSlice.reducer;
