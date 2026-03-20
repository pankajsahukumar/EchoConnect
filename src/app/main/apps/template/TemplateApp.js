import { styled } from '@mui/material/styles';
import { createContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import withReducer from 'app/store/withReducer';
import TemplateSidebar from './TemplateSidebar';
import reducer from './store';
import { getTemplates } from './store/templateSlice';

const drawerWidth = 400;

export const TemplateAppContext = createContext({});

const Root = styled(FusePageSimple)(({ theme }) => ({
    '& .FusePageSimple-content': {
        display: 'flex',
        flexDirection: 'column',
        flex: '1 1 100%',
        height: '100%',
    },
}));

function TemplateApp() {
    const dispatch = useDispatch();
    const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
    const [templateSidebarOpen, setTemplateSidebarOpen] = useState(!isMobile);
    const location = useLocation();

    useEffect(() => {
        dispatch(getTemplates());
    }, [dispatch]);

    useEffect(() => {
        setTemplateSidebarOpen(!isMobile);
    }, [isMobile]);

    useEffect(() => {
        if (isMobile) {
            setTemplateSidebarOpen(false);
        }
    }, [location, isMobile]);

    return (
        <TemplateAppContext.Provider
            value={{ setTemplateSidebarOpen }}
        >
            <Root
                content={<Outlet />}
                leftSidebarContent={<TemplateSidebar />}
                leftSidebarOpen={templateSidebarOpen}
                leftSidebarOnClose={() => {
                    setTemplateSidebarOpen(false);
                }}
                leftSidebarWidth={400}
                scroll="content"
            />
        </TemplateAppContext.Provider>
    );
}

export default withReducer('templateApp', reducer)(TemplateApp);
