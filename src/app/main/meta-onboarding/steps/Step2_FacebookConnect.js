import { useState } from 'react';
import { Box, Button, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { loadFbSdk, launchWhatsAppSignup } from '../utils/fbSdkLoader';
import { useMetaOnboarding } from '../hooks/useMetaOnboarding';

const FB_APP_ID = process.env.REACT_APP_FB_APP_ID;
const FB_CONFIG_ID = process.env.REACT_APP_FB_CONFIG_ID;
const FB_SOLUTION_ID = process.env.REACT_APP_FB_SOLUTION_ID;

export default function Step2_FacebookConnect() {
  const {
    updateFbAuthCode,
    updateWabaData,
    updatePopupOpen,
    submitExchangeCode,
    sendOtp,
    goToStep,
    STEPS,
  } = useMetaOnboarding();

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleConnect = async () => {
    setLocalError(null);
    setLocalLoading(true);
    updatePopupOpen(true);

    try {
      // 1. Load the FB SDK (no-op if already loaded)
      await loadFbSdk(FB_APP_ID);

      // 2. Launch Meta Embedded Signup popup.
      //    This opens a Facebook-hosted popup where the user:
      //    - Logs in to Facebook
      //    - Selects / creates a Business Portfolio
      //    - Creates a WhatsApp Business Account (WABA)
      //    - Adds a phone number
      //    The popup posts a window.message event with waba_id + phone_number_id when done.
      const { code, wabaId, phoneNumberId } = await launchWhatsAppSignup(
        FB_CONFIG_ID,
        FB_SOLUTION_ID
      );

      // Store in Redux
      updateFbAuthCode(code);
      updateWabaData({ wabaId, phoneNumberId });

      // 3. Advance stepper through steps 2–4 instantly (they all happened in the popup).
      //    Then tell the Java backend to exchange the code for a System User Token.
      goToStep(STEPS.SELECT_BUSINESS);
      setTimeout(() => goToStep(STEPS.CREATE_WABA), 400);
      setTimeout(() => goToStep(STEPS.ADD_PHONE), 800);
      setTimeout(async () => {
        await submitExchangeCode({ code, wabaId, phoneNumberId });
        await sendOtp({ phoneNumberId, codeMethod: 'SMS', language: 'en_US' });
        goToStep(STEPS.VERIFY_OTP);
      }, 1200);
    } catch (err) {
      setLocalError(err.message || 'Something went wrong. Please try again.');
      updatePopupOpen(false);
    } finally {
      setLocalLoading(false);
      updatePopupOpen(false);
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: '#1877F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <FacebookIcon sx={{ color: 'white', fontSize: 40 }} />
        </Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Connect with Facebook
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 440, mx: 'auto' }}>
          Click the button below to open a secure Facebook window. You'll complete the
          following steps inside that window:
        </Typography>
      </Box>

      {/* Steps that happen inside the popup */}
      <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5, mb: 3 }}>
        {[
          { label: 'Select Business Account', desc: 'Choose an existing Meta Business Portfolio or create a new one' },
          { label: 'Create WhatsApp Business Account', desc: 'Set up your WABA under the selected business' },
          { label: 'Add Phone Number', desc: 'Register the phone number you want to use for WhatsApp messaging' },
        ].map((item, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 2, mt: i === 0 ? 0 : 2 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: 'primary.50',
                border: '2px solid',
                borderColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 13,
                fontWeight: 700,
                color: 'primary.main',
              }}
            >
              {i + 1}
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                {item.label}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {item.desc}
              </Typography>
            </Box>
          </Box>
        ))}
      </Paper>

      {localError && (
        <Alert severity="error" onClose={() => setLocalError(null)} sx={{ mb: 2 }}>
          {localError}
        </Alert>
      )}

      <Button
        variant="contained"
        size="large"
        fullWidth
        startIcon={localLoading ? <CircularProgress size={18} color="inherit" /> : <FacebookIcon />}
        onClick={handleConnect}
        disabled={localLoading}
        sx={{
          textTransform: 'none',
          borderRadius: 2,
          py: 1.5,
          bgcolor: '#1877F2',
          '&:hover': { bgcolor: '#1565C0' },
          fontSize: 16,
          fontWeight: 600,
        }}
      >
        {localLoading ? 'Connecting...' : 'Connect with Facebook'}
      </Button>

      {/* Security note */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 2 }}>
        <LockOutlinedIcon fontSize="small" sx={{ color: 'text.disabled', fontSize: 14 }} />
        <Typography variant="caption" color="text.disabled">
          This flow is hosted and secured by Meta. We never see your Facebook password.
        </Typography>
      </Box>
    </Box>
  );
}
