import { combineReducers } from '@reduxjs/toolkit';
import chats from './chatsSlice';
import chat from './chatSlice';
import contacts from './contactsSlice';
import user from './userSlice';
import customer from './customerSlice';
import templates from './templateSlice';
import templateForm from './templateFormSlice';

const reducer = combineReducers({
  user,
  contacts,
  chats,
  chat,
  customer,
  templates,
  templateForm
});

export default reducer;
