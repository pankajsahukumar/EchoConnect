import { Box, CircularProgress, Typography } from '@mui/material';
import { useMetaOnboarding } from '../hooks/useMetaOnboarding';
import { STEP_LABELS, ONBOARDING_STEPS } from '../store/metaOnboardingSlice';

const POPUP_STEP_LABELS = [
  STEP_LABELS[ONBOARDING_STEPS.SELECT_BUSINESS],
  STEP_LABELS[ONBOARDING_STEPS.CREATE_WABA],
  STEP_LABELS[ONBOARDING_STEPS.ADD_PHONE],
];

export default function Step3_InProgress() {
  const { activeStep } = useMetaOnboarding();

  // Determine which popup step is currently "active" for display
  const popupStepIndex = activeStep - ONBOARDING_STEPS.SELECT_BUSINESS; // 0, 1, or 2

  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <CircularProgress size={56} thickness={3} sx={{ mb: 3 }} />
      <Typography variant="h6" fontWeight={600} gutterBottom>
        Completing in Facebook...
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        Please complete the steps in the Facebook window.
      </Typography>

      <Box sx={{ display: 'inline-flex', flexDirection: 'column', gap: 1.5, textAlign: 'left' }}>
        {POPUP_STEP_LABELS.map((label, i) => (
          <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: i <= popupStepIndex ? 'primary.main' : 'grey.300',
                flexShrink: 0,
              }}
            />
            <Typography
              variant="body2"
              fontWeight={i === popupStepIndex ? 600 : 400}
              color={i === popupStepIndex ? 'primary.main' : i < popupStepIndex ? 'text.primary' : 'text.disabled'}
            >
              {label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
