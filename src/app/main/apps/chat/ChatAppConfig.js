import { lazy } from 'react';
import Chat from './chat/Chat';
import ChatFirstScreen from './ChatFirstScreen';

// Template components
const TemplateList = lazy(() => import('./template/TemplateList'));
const TemplateCreator = lazy(() => import('./template/TemplateCreator'));

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
        // Template management routes
        {
          path: 'templates',
          element: <TemplateList />,
        },
        {
          path: 'templates/create',
          element: <TemplateCreator />,
        },
        {
          path: 'templates/edit/:templateId',
          element: <TemplateCreator />,
        },
      ],
    },
  ],
};

export default ChatAppConfig;
