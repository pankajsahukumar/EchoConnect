import i18next from 'i18next';

import en from './i18n/en';
import tr from './i18n/tr';
import ar from './i18n/ar';
import BotFlowApp from './BotFlowApp';

i18next.addResourceBundle('en', 'BotFlowPage', en);
i18next.addResourceBundle('tr', 'BotFlowPage', tr);
i18next.addResourceBundle('ar', 'BotFlowPage', ar);

const BotFlowConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'botflow',
      element: <BotFlowApp />,
    },
  ],
};

export default BotFlowConfig;

/**
 * Lazy load Example
 */
/*
import React from 'react';

const Example = lazy(() => import('./Example'));

const ExampleConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: 'example',
      element: <Example />,
    },
  ],
};

export default ExampleConfig;
*/
