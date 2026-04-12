import { useSelector, useDispatch } from 'react-redux';
import {
  selectOnboarding,
  selectActiveStep,
  selectLoading,
  selectError,
  setActiveStep,
  setBusinessName,
  setBusinessPhone,
  setFbAuthCode,
  setWabaData,
  setPopupOpen,
  setOtpCode,
  setOtpCooldown,
  clearError,
  resetOnboarding,
  exchangeCodeAndSetup,
  requestOtp,
  verifyOtp,
  ONBOARDING_STEPS,
} from '../store/metaOnboardingSlice';

export function useMetaOnboarding() {
  const dispatch = useDispatch();
  const state = useSelector(selectOnboarding);
  const activeStep = useSelector(selectActiveStep);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  return {
    // State
    ...state,
    activeStep,
    loading,
    error,

    // Navigation
    goToStep: (step) => dispatch(setActiveStep(step)),
    goNext: () => dispatch(setActiveStep(activeStep + 1)),
    goBack: () => dispatch(setActiveStep(activeStep - 1)),

    // Step 1 setters
    updateBusinessName: (v) => dispatch(setBusinessName(v)),
    updateBusinessPhone: (v) => dispatch(setBusinessPhone(v)),

    // Step 2 setters (populated by FB popup)
    updateFbAuthCode: (code) => dispatch(setFbAuthCode(code)),
    updateWabaData: (payload) => dispatch(setWabaData(payload)),
    updatePopupOpen: (open) => dispatch(setPopupOpen(open)),

    // OTP setters
    updateOtpCode: (v) => dispatch(setOtpCode(v)),
    updateOtpCooldown: (v) => dispatch(setOtpCooldown(v)),

    // Async actions
    submitExchangeCode: (payload) => dispatch(exchangeCodeAndSetup(payload)),
    sendOtp: (payload) => dispatch(requestOtp(payload)),
    submitOtp: (payload) => dispatch(verifyOtp(payload)),

    // Misc
    clearErr: () => dispatch(clearError()),
    reset: () => dispatch(resetOnboarding()),

    // Constants
    STEPS: ONBOARDING_STEPS,
  };
}
