import { combineReducers } from '@reduxjs/toolkit';
import chats from './chatsSlice';
import chat from './chatSlice';
import contacts from './contactsSlice';
import user from './userSlice';
import customer from './customerSlice';

const reducer = combineReducers({
  user,
  contacts,
  chats,
  chat,
  customer
});

export default reducer;
