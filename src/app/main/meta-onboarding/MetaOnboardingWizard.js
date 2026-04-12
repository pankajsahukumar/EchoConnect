import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Step,
  StepLabel,
  Stepper,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useMetaOnboarding } from './hooks/useMetaOnboarding';
import { STEP_LABELS, ONBOARDING_STEPS } from './store/metaOnboardingSlice';

import Step1_Intro from './steps/Step1_Intro';
import Step2_FacebookConnect from './steps/Step2_FacebookConnect';
import Step3_InProgress from './steps/Step3_InProgress';
import Step4_OTPVerify from './steps/Step4_OTPVerify';
import Step5_Done from './steps/Step5_Done';

const STEP_COMPONENTS = {
  [ONBOARDING_STEPS.INTRO]: Step1_Intro,
  [ONBOARDING_STEPS.FACEBOOK_CONNECT]: Step2_FacebookConnect,
  [ONBOARDING_STEPS.SELECT_BUSINESS]: Step3_InProgress,
  [ONBOARDING_STEPS.CREATE_WABA]: Step3_InProgress,
  [ONBOARDING_STEPS.ADD_PHONE]: Step3_InProgress,
  [ONBOARDING_STEPS.VERIFY_OTP]: Step4_OTPVerify,
  [ONBOARDING_STEPS.DONE]: Step5_Done,
};

export default function MetaOnboardingWizard() {
  const navigate = useNavigate();
  const { activeStep, loading, error, clearErr, goBack } = useMetaOnboarding();

  const ActiveStepComponent = STEP_COMPONENTS[activeStep] || Step1_Intro;

  // Steps 2–4 (SELECT_BUSINESS, CREATE_WABA, ADD_PHONE) happen inside the FB popup,
  // so the Back button is hidden while the popup flow is in progress.
  const showBack = activeStep === ONBOARDING_STEPS.INTRO;
  const isDone = activeStep === ONBOARDING_STEPS.DONE;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: 'background.default' }}>
      {/* ── Header ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 3,
          py: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/apps/settings/manage-wabas')}
          sx={{ textTransform: 'none', color: 'text.secondary' }}
        >
          Back to Settings
        </Button>
        <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
          Connect WhatsApp Business
        </Typography>
      </Box>

      {/* ── Stepper ── */}
      {!isDone && (
        <Box sx={{ px: 4, pt: 3, pb: 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider' }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {STEP_LABELS.map((label, index) => (
              <Step key={label} completed={index < activeStep}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}

      {/* ── Content ── */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: { xs: 2, sm: 4, md: 8 }, py: 4, maxWidth: 720, width: '100%', mx: 'auto' }}>
        {error && (
          <Alert severity="error" onClose={clearErr} sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        <ActiveStepComponent />
      </Box>

      {/* ── Bottom nav (Back only — each step owns its own Next/Submit) ── */}
      {showBack && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            px: { xs: 2, sm: 4, md: 8 },
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            maxWidth: 720,
            width: '100%',
            mx: 'auto',
          }}
        >
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={goBack}
            disabled={activeStep === 0 || loading}
            sx={{ textTransform: 'none' }}
          >
            Back
          </Button>
        </Box>
      )}
    </Box>
  );
}
