import { lazy } from 'react';

const TemplateApp = lazy(() => import('./TemplateApp'));
const TemplateCreator = lazy(() => import('./TemplateCreator'));

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
                    element: <TemplateCreator />, // Default to creator or empty state? User said "template builder", maybe default to new? Or list?
                    // Actually, if we have a sidebar list, the main view is the content.
                    // Let's make the default view an "Empty/Select a template" screen, or "Create New" if that's the primary goal.
                    // Given "Double Tick" style, usually you see the list and a "Welcome/Select" screen.
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
