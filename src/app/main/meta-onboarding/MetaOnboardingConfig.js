import { lazy } from 'react';

const MetaOnboardingPage = lazy(() => import('./MetaOnboardingPage'));

const MetaOnboardingConfig = {
  settings: {
    layout: {
      config: {
        navbar: { display: true },
        toolbar: { display: true },
        footer: { display: false },
        leftSidePanel: { display: true },
        rightSidePanel: { display: false },
      },
    },
  },
  routes: [
    {
      path: 'apps/meta-onboarding',
      element: <MetaOnboardingPage />,
    },
  ],
};

export default MetaOnboardingConfig;
