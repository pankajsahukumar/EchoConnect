import { styled } from '@mui/material/styles';
import { createContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import { getCustomers } from './store/customersSlice';

export const CustomersAppContext = createContext({});

const Root = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

function CustomersApp() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  return (
    <CustomersAppContext.Provider value={{}}>
      <Root>
        <Outlet />
      </Root>
    </CustomersAppContext.Provider>
  );
}

export default withReducer('customersApp', reducer)(CustomersApp);
