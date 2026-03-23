import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getTemplates } from './store/templateSlice';

export default function TemplateManagementHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h5" fontWeight={600}>
        Templates
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Tooltip title="Refresh">
          <IconButton onClick={() => dispatch(getTemplates())}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/apps/templates/create')}
          sx={{
            bgcolor: '#25D366',
            '&:hover': { bgcolor: '#1da851' },
            textTransform: 'none',
            borderRadius: '8px',
            px: 3,
          }}
        >
          New Template
        </Button>
      </Box>
    </Box>
  );
}
