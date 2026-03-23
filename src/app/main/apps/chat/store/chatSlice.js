import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiClient } from 'src/@api/utils/apiClient';

const PAGE_SIZE = 30;

export const getChat = createAsyncThunk(
  'chatApp/chat/getChat',
  async ({ chatId }) => {
    const response = await apiClient.get(`/api/messages/${chatId}`, { size: PAGE_SIZE });
    const { content, hasMore, nextCursor } = response.data.data;
    return { messages: content ?? [], hasMore: hasMore ?? false, nextCursor: nextCursor ?? null };
  }
);

export const loadMoreMessages = createAsyncThunk(
  'chatApp/chat/loadMoreMessages',
  async ({ chatId, cursor }) => {
    const response = await apiClient.get(`/api/messages/${chatId}`, { size: PAGE_SIZE, cursor });
    const { content, hasMore, nextCursor } = response.data.data;
    return { messages: content ?? [], hasMore: hasMore ?? false, nextCursor: nextCursor ?? null };
  }
);

export const sendMessage = createAsyncThunk(
  'chatApp/chat/sendMessage',
  async (messageData) => {
    const response = await apiClient.post(`/api/messages/send`, messageData);
    return response.data;
  }
);

const chatSlice = createSlice({
  name: 'chatApp/chat',
  initialState: {
    messages: [],
    hasMore: true,
    nextCursor: null,
  },
  reducers: {
    removeChat: (state) => {
      state.messages = [];
      state.hasMore = true;
      state.nextCursor = null;
    },
    addTempMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    addNewMessage: (state, { payload }) => {
      const id = payload.id || payload.messageId;
      const exists = state.messages.some((msg) => (msg.id || msg.messageId) === id);
      if (!exists) state.messages.push(payload);
    },
  },
  extraReducers: {
    [getChat.fulfilled]: (state, action) => {
      state.messages = action.payload.messages;
      state.hasMore = action.payload.hasMore;
      state.nextCursor = action.payload.nextCursor;
    },
    [loadMoreMessages.fulfilled]: (state, action) => {
      const existingIds = new Set(state.messages.map((m) => m.id || m.messageId));
      const fresh = action.payload.messages.filter((m) => !existingIds.has(m.id || m.messageId));
      state.messages = [...fresh, ...state.messages];
      state.hasMore = action.payload.hasMore;
      state.nextCursor = action.payload.nextCursor;
    },
    [loadMoreMessages.rejected]: (state) => {
      // Allow retry after failure
      state.hasMore = true;
    },
    [sendMessage.fulfilled]: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { removeChat, addTempMessage, addNewMessage } = chatSlice.actions;

export const selectChat = ({ chatApp }) => chatApp.chat.messages;
export const selectChatHasMore = ({ chatApp }) => chatApp.chat.hasMore;
export const selectChatCursor = ({ chatApp }) => chatApp.chat.nextCursor;

export default chatSlice.reducer;
