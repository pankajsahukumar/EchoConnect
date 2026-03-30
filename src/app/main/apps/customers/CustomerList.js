import { useEffect, useCallback } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  getCustomers,
  selectCustomers,
  selectCustomersLoading,
  selectSearchText,
  setSearchText,
} from './store/customersSlice';
import CustomerListHeader from './CustomerListHeader';
import CustomerListFilters from './CustomerListFilters';
import CustomerListTable from './CustomerListTable';

export default function CustomerList() {
  const dispatch = useDispatch();
  const customers = useSelector(selectCustomers);
  const loading = useSelector(selectCustomersLoading);
  const searchText = useSelector(selectSearchText);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch, searchText]);

  const handleSearchChange = useCallback(
    (value) => {
      dispatch(setSearchText(value));
    },
    [dispatch]
  );

  return (
    <Box
      sx={{
        p: 3,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2.5,
        overflow: 'hidden',
        minWidth: 0,
      }}
    >
      <CustomerListHeader />
      <CustomerListFilters searchText={searchText} onSearchChange={handleSearchChange} />
      <CustomerListTable customers={customers} loading={loading} />
    </Box>
  );
}
