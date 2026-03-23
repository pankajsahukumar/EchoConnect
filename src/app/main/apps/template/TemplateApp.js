import { styled } from '@mui/material/styles';
import { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import { getTemplates } from './store/templateSlice';

export const TemplateAppContext = createContext({});

const Root = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
});

function TemplateApp() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getTemplates());
    }, [dispatch]);

    return (
        <TemplateAppContext.Provider value={{}}>
            <Root>
                <Outlet />
            </Root>
        </TemplateAppContext.Provider>
    );
}

export default withReducer('templateApp', reducer)(TemplateApp);
