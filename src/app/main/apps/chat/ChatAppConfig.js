import { lazy } from 'react';
import Chat from './chat/Chat';
import ChatFirstScreen from './ChatFirstScreen';

const ChatApp = lazy(() => import('./ChatApp'));

const ChatAppConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: true,
        },
        rightSidePanel: {
          display: true,
        },
      },
    },
  },
  routes: [
    {
      path: 'apps/chat',
      element: <ChatApp />,
      children: [
        {
          path: '',
          element: <ChatFirstScreen />,
        },
        {
          path: ':id',
          element: <Chat />,
        },
      ],
    },
  ],
};

export default ChatAppConfig;
