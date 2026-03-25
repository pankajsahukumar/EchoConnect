import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const SettingsApp = lazy(() => import('./SettingsApp'));
const SettingsContent = lazy(() => import('./SettingsContent'));

const SettingsAppConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: true,
        },
        toolbar: {
          display: true,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: true,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  routes: [
    {
      path: 'apps/settings',
      element: <SettingsApp />,
      children: [
        {
          path: '',
          element: <Navigate to="your-profile" replace />,
        },
        {
          path: ':section',
          element: <SettingsContent />,
        },
      ],
    },
  ],
};

export default SettingsAppConfig;
