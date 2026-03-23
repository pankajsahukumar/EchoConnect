import Template from './Template';

const TemplateConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    routes: [
        {
            path: 'template',
            element: <Template mode="create" />,
        },
        {
            path: 'template/create',
            element: <Template mode="create" />,
        },
        {
            path: 'template/edit/:templateId',
            element: <Template mode="edit" />,
        },
    ],
};

export default TemplateConfig;
