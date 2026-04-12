import { Box, Button, TextField, Typography, InputAdornment } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useMetaOnboarding } from '../hooks/useMetaOnboarding';

export default function Step1_Intro() {
  const {
    businessName,
    businessPhone,
    updateBusinessName,
    updateBusinessPhone,
    goNext,
    STEPS,
    activeStep,
  } = useMetaOnboarding();

  const handleNext = () => {
    goNext();
  };

  return (
    <Box>
      {/* Hero */}
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Box
          component="img"
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          sx={{ width: 64, height: 64, mb: 2 }}
        />
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Connect your WhatsApp Business
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 480, mx: 'auto' }}>
          Link your WhatsApp Business Account to EchoConnect to start sending and receiving
          messages. The process takes about 2 minutes.
        </Typography>
      </Box>

      {/* Form */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Business Name"
          placeholder="e.g. Acme Corp"
          value={businessName}
          onChange={(e) => updateBusinessName(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BusinessIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          label="Business Phone Number"
          placeholder="e.g. +91 98765 43210"
          value={businessPhone}
          onChange={(e) => updateBusinessPhone(e.target.value)}
          fullWidth
          helperText="The WhatsApp number you want to register"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PhoneIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        {/* What happens next */}
        <Box sx={{ bgcolor: 'grey.50', borderRadius: 2, p: 2.5, mt: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            What happens next?
          </Typography>
          {[
            'You\'ll log in with your Facebook account',
            'Select or create your Meta Business Portfolio',
            'Create a WhatsApp Business Account (WABA)',
            'Register your phone number',
            'Verify with a one-time OTP',
          ].map((item, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: 11,
                  fontWeight: 700,
                  mt: 0.1,
                }}
              >
                {i + 1}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {item}
              </Typography>
            </Box>
          ))}
        </Box>

        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          onClick={handleNext}
          sx={{ textTransform: 'none', borderRadius: 2, py: 1.5 }}
        >
          Get Started
        </Button>
      </Box>
    </Box>
  );
}
