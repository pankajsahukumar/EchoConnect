import { lazy } from 'react';

const CustomersApp = lazy(() => import('./CustomersApp'));
const CustomerList = lazy(() => import('./CustomerList'));
const CustomerDetail = lazy(() => import('./CustomerDetail'));

const CustomersAppConfig = {
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
      path: 'apps/customers',
      element: <CustomersApp />,
      children: [
        {
          path: '',
          element: <CustomerList />,
        },
        {
          path: ':customerId',
          element: <CustomerDetail />,
        },
      ],
    },
  ],
};

export default CustomersAppConfig;
