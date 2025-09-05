import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';



const botSlice = createSlice({
  name: 'botFlowApp/chat',
  initialState: [],
  reducers: {
    removeChat: (state, action) => action.payload,
    addTempMessage: (state, action) => [...state, action.payload],
  },
//   extraReducers: {
//     [getChat.fulfilled]: (state, action) => action.payload,
//     [sendMessage.fulfilled]: (state, action) => [...state, action.payload],
//   },
});
export const { addTempMessage } = botSlice.actions;
export const selectBot = ({ botFlowApp }) => botFlowApp.chat;

export default botSlice.reducer;
