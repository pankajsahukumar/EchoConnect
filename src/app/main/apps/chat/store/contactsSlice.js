import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { apiClient } from 'src/@api/utils/apiClient';

export const getContacts = createAsyncThunk('chatApp/contacts/getContacts', async (params) => {
  const response = await apiClient.get('/api/contacts',{
    pageNumber: 1, pageSize: 10
  });
  const data = await response.data;
  return data.data.content;
});

export const addNewContact = createAsyncThunk('chatApp/contacts/addContact', async (chatData) => {
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
const contactsAdapter = createEntityAdapter({
  sortComparer: (a, b) => {
    const timeA = a?.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const timeB = b?.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return timeB - timeA; // newest first
  },
});


export const { selectAll: selectContacts, selectById: selectContactById } = contactsAdapter.getSelectors(
  (state) => state.chatApp.contacts
);
export const selectContactByMobile = (state, phoneNumber) => {
  const contacts = selectContacts(state);
  return contacts.find((contact) => contact.phoneNumber === phoneNumber);
};
const contactsSlice = createSlice({
  name: 'chatApp/contacts',
  initialState: contactsAdapter.getInitialState({}),
  reducers: {},
  extraReducers: {
    [getContacts.fulfilled]: contactsAdapter.setAll,
     [addNewContact.fulfilled]:  contactsAdapter.addOne,
  },
});

export default contactsSlice.reducer;
