import { Box, Button, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { useNavigate } from 'react-router-dom';

export default function ManageWabas() {
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            Manage WABAs
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Edit your WABA profile and manage assignees
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/apps/meta-onboarding')}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            bgcolor: '#25D366',
            '&:hover': { bgcolor: '#128C7E' },
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          Connect WhatsApp Business
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Empty state — replace this with a WABA list once the backend is ready */}
      <Box
        sx={{
          textAlign: 'center',
          py: 8,
          border: '2px dashed',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 56, color: '#25D366', mb: 2 }} />
        <Typography variant="h6" fontWeight={600} gutterBottom>
          No WhatsApp accounts connected yet
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Connect your WhatsApp Business Account to start messaging customers.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => navigate('/apps/meta-onboarding')}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Connect WhatsApp Business
        </Button>
      </Box>
    </Box>
  );
}
