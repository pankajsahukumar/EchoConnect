import { lazy } from 'react';

const TemplateApp = lazy(() => import('./TemplateApp'));
const TemplateCreator = lazy(() => import('./TemplateCreator'));
const TemplateManagement = lazy(() => import('./TemplateManagement'));

const TemplateAppConfig = {
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
            path: 'apps/templates',
            element: <TemplateApp />,
            children: [
                {
                    path: '',
                    element: <TemplateManagement />,
                },
                {
                    path: 'create',
                    element: <TemplateCreator mode="create" />,
                },
                {
                    path: 'edit/:templateId',
                    element: <TemplateCreator mode="edit" />,
                },
            ],
        },
    ],
};

export default TemplateAppConfig;
