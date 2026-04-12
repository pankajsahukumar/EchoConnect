import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useMetaOnboarding } from '../hooks/useMetaOnboarding';

const OTP_LENGTH = 6;

export default function Step4_OTPVerify() {
  const {
    otpCode,
    otpSent,
    otpCooldown,
    phoneNumberId,
    loading,
    updateOtpCode,
    updateOtpCooldown,
    sendOtp,
    submitOtp,
  } = useMetaOnboarding();

  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(''));
  const inputRefs = useRef([]);
  const cooldownRef = useRef(null);

  // Sync digits array → Redux otpCode string
  useEffect(() => {
    updateOtpCode(digits.join(''));
  }, [digits]);

  // Countdown timer for resend
  useEffect(() => {
    if (otpCooldown > 0) {
      cooldownRef.current = setInterval(() => {
        updateOtpCooldown(otpCooldown - 1);
      }, 1000);
    }
    return () => clearInterval(cooldownRef.current);
  }, [otpCooldown]);

  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleResend = () => {
    if (otpCooldown > 0 || loading) return;
    sendOtp({ phoneNumberId, codeMethod: 'SMS', language: 'en_US' });
  };

  const handleSubmit = () => {
    if (otpCode.length < OTP_LENGTH || loading) return;
    submitOtp({ phoneNumberId, code: otpCode });
  };

  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            bgcolor: 'success.50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 2,
          }}
        >
          <LockOutlinedIcon sx={{ color: 'success.main', fontSize: 36 }} />
        </Box>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          Verify your phone number
        </Typography>
        <Typography variant="body2" color="text.secondary">
          A 6-digit verification code has been sent to your WhatsApp Business phone number
          via SMS. Enter it below to complete the setup.
        </Typography>
      </Box>

      {/* OTP digit inputs */}
      <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mb: 3 }}>
        {digits.map((digit, i) => (
          <TextField
            key={i}
            inputRef={(el) => { inputRefs.current[i] = el; }}
            value={digit}
            onChange={(e) => handleDigitChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: 'center',
                fontSize: 24,
                fontWeight: 700,
                padding: '12px 0',
              },
            }}
            sx={{
              width: 52,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&.Mui-focused fieldset': { borderWidth: 2 },
              },
            }}
          />
        ))}
      </Box>

      {/* Resend */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        {otpCooldown > 0 ? (
          <Typography variant="caption" color="text.secondary">
            Resend OTP in {otpCooldown}s
          </Typography>
        ) : (
          <Typography variant="caption" color="text.secondary">
            Didn't receive it?{' '}
            <Link
              component="button"
              variant="caption"
              onClick={handleResend}
              disabled={loading}
              sx={{ textDecoration: 'none', fontWeight: 600 }}
            >
              Resend OTP
            </Link>
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        size="large"
        fullWidth
        endIcon={loading ? <CircularProgress size={18} color="inherit" /> : <ArrowForwardIcon />}
        onClick={handleSubmit}
        disabled={otpCode.length < OTP_LENGTH || loading}
        sx={{ textTransform: 'none', borderRadius: 2, py: 1.5 }}
      >
        {loading ? 'Verifying...' : 'Verify & Complete Setup'}
      </Button>
    </Box>
  );
}
