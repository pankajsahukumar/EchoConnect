import { Box, Button, Chip, Divider, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useNavigate } from 'react-router-dom';
import { useMetaOnboarding } from '../hooks/useMetaOnboarding';

export default function Step5_Done() {
  const navigate = useNavigate();
  const { businessName, wabaId, phoneNumberId, reset } = useMetaOnboarding();

  const handleGoToSettings = () => {
    reset();
    navigate('/apps/settings/manage-wabas');
  };

  const handleStartMessaging = () => {
    reset();
    navigate('/apps/chat');
  };

  return (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      {/* Success icon */}
      <CheckCircleOutlineIcon
        sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
      />

      <Typography variant="h5" fontWeight={700} gutterBottom>
        You're all set!
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Your WhatsApp Business Account has been successfully connected to EchoConnect.
        You can now send and receive messages.
      </Typography>

      {/* Summary card */}
      <Box
        sx={{
          bgcolor: 'grey.50',
          borderRadius: 2,
          p: 3,
          textAlign: 'left',
          mb: 4,
        }}
      >
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Connection Summary
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {[
          { label: 'Business Name', value: businessName || '—' },
          { label: 'WABA ID', value: wabaId || '—' },
          { label: 'Phone Number ID', value: phoneNumberId || '—' },
          {
            label: 'Status',
            value: (
              <Chip label="Connected" color="success" size="small" sx={{ fontWeight: 600 }} />
            ),
          },
        ].map(({ label, value }) => (
          <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            {typeof value === 'string' ? (
              <Typography variant="body2" fontWeight={500}>
                {value}
              </Typography>
            ) : (
              value
            )}
          </Box>
        ))}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button
          variant="outlined"
          fullWidth
          startIcon={<SettingsOutlinedIcon />}
          onClick={handleGoToSettings}
          sx={{ textTransform: 'none', borderRadius: 2, py: 1.5 }}
        >
          Go to Settings
        </Button>
        <Button
          variant="contained"
          fullWidth
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={handleStartMessaging}
          sx={{ textTransform: 'none', borderRadius: 2, py: 1.5 }}
        >
          Start Messaging
        </Button>
      </Box>
    </Box>
  );
}
