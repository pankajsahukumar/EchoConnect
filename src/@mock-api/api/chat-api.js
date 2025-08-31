import _ from '@lodash';
import FuseUtils from '@fuse/utils';
import mockApi from '../mock-api.json';
import mock from '../mock';

const contactsDB = mockApi.components.examples.chat_contacts.value;
let userDB = mockApi.components.examples.chat_profile.value;
const userChatListDB = mockApi.components.examples.chat_chats.value;
const messages = mockApi.components.examples.chat_messages.value;
const chatsDB = userChatListDB.map((chat) => ({
  ...chat,
  messages: messages.map((message) => ({
    ...message,
    contactId: message.contactId === '' ? chat.contactId : userDB.id,
  })),
}));

mock.onGet('/api/chat/contacts').reply((config) => {
  return [200, contactsDB];
});

mock.onGet('/api/chat/chats').reply((config) => {
  userChatListDB.sort(
    (d1, d2) => new Date(d2.lastMessageAt).getTime() - new Date(d1.lastMessageAt).getTime()
  );

  return [200, userChatListDB];
});

mock.onGet(/\/api\/chat\/chats\/[^/]+/).reply((config) => {
  const { contactId } = config.url.match(/\/api\/chat\/chats\/(?<contactId>[^/]+)/).groups;
  const contact = _.find(contactsDB, { id: contactId });

  if (!contact) {
    return [404, 'Requested data do not exist.'];
  }

  const data = _.find(chatsDB, { contactId })?.messages;
  console.log("this is the chats", chatsDB);
  if (data) {
    return [200, data];
  }

  return [200, []];
});

mock.onPost(/\/api\/chat\/chats\/[^/]+/).reply(({ url, data }) => {
  const { contactId } = url.match(/\/api\/chat\/chats\/(?<contactId>[^/]+)/).groups;
  const contact = _.find(contactsDB, { id: contactId });
  
  if (!contact) {
    return [404, 'Requested data do not exist.'];
  }

  const contactChat = _.find(chatsDB, { contactId });
  console.log("this is the contact chat", contactChat);

  if (!contactChat) {
    createNewChat(contactId);
  }

  // Parse the data if it's a string
  const messageData = typeof data === 'string' ? JSON.parse(data) : data;
  console.log("this is the message data", data);
  const newMessage = createNewMessage(messageData, contactId);

  return [200, newMessage];
});

mock.onGet('/api/chat/user').reply((config) => {
  return [200, userDB];
});

mock.onPost('/api/chat/user').reply(({ data }) => {
  const userData = JSON.parse(data);
  userDB = _.merge({}, userDB, userData);
  return [200, userDB];
});

function createNewMessage(messageData, contactId) {
  // Handle both old format (simple string) and new format (object with type, payload, etc.)
  const isOldFormat = typeof messageData === 'string';

  const message = {
    id: FuseUtils.generateGUID(),
    contactId: userDB.id,
    messageOriginType: 'USER',
    messageType: isOldFormat ? 'text' : messageData.type,
    message: isOldFormat ? {
      messageType: 'text',
      text: messageData
    } : {
      messageType: messageData.type,
      text: messageData.payload?.text?.body || messageData.messageText || '',
      payload: messageData.payload
    },
    dateCreated: new Date().toISOString(),
    dateUpdated: new Date().toISOString(),
    messageTime: Date.now(),
    messageMetadata: { status: 'sent' },
    context: messageData.context || null,
    replyMessageId: messageData.context?.message_id || null,
    replyMessage: null, // Will be populated if this is a reply
    readCount: 1,
    deliveryCount: 1,
    erroredCount: 0,
    totalCount: 1,
    errorMessage: null,
    adReferralData: null,
    senderUser: {
      id: userDB.id,
      name: userDB.name,
      phoneNumber: userDB.phoneNumber
    }
  };

  // If this is a reply, find the original message
  if (message.replyMessageId) {
    const selectedChat = _.find(chatsDB, { contactId });
    if (selectedChat) {
      const originalMessage = selectedChat.messages.find(msg => msg.id === message.replyMessageId);
      if (originalMessage) {
        message.replyMessage = {
          id: originalMessage.id,
          messageOriginType: originalMessage.messageOriginType,
          message: originalMessage.message,
          senderUser: originalMessage.senderUser || {},
          messageTime: originalMessage.messageTime
        };
      }
    }
  }

  const selectedChat = _.find(chatsDB, { contactId });
  const userSelectedChat = _.find(userChatListDB, { contactId });

  if (selectedChat) {
    selectedChat.messages.push(message);
    selectedChat.lastMessage = message.message.text || 'Message';
    selectedChat.lastMessageAt = message.dateCreated;
  }

  if (userSelectedChat) {
    userSelectedChat.lastMessage = message.message.text || 'Message';
    userSelectedChat.lastMessageAt = message.dateCreated;
  }

  return message;
}

function createNewChat(contactId) {
  const newChat = {
    id: FuseUtils.generateGUID(),
    contactId,
    unreadCount: 0,
    muted: false,
    lastMessage: '',
    lastMessageAt: '',
  };

  userChatListDB.push(newChat);

  const newMessageData = {
    ...newChat,
    messages: [],
  };

  chatsDB.push(newMessageData);

  return newMessageData;
}
