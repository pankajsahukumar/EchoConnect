import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useDispatch } from 'react-redux';
import { getCustomers } from './store/customersSlice';

export default function CustomerListHeader() {
  const dispatch = useDispatch();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" fontWeight={600}>
        Customers
      </Typography>
      <Tooltip title="Refresh">
        <IconButton onClick={() => dispatch(getCustomers())}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
