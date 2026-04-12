import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { metaOnboardingApi } from 'src/@api/api/meta-onboarding-api';

// ─── Step indices ─────────────────────────────────────────────
export const ONBOARDING_STEPS = {
  INTRO: 0,
  FACEBOOK_CONNECT: 1,
  SELECT_BUSINESS: 2,
  CREATE_WABA: 3,
  ADD_PHONE: 4,
  VERIFY_OTP: 5,
  DONE: 6,
};

export const STEP_LABELS = [
  'Business Details',
  'Facebook Login',
  'Select Business',
  'Create WABA',
  'Add Phone',
  'Verify OTP',
  'Done',
];

// ─── Async Thunks ─────────────────────────────────────────────

export const exchangeCodeAndSetup = createAsyncThunk(
  'metaOnboarding/exchangeCodeAndSetup',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await metaOnboardingApi.exchangeCodeAndSetup(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to connect with Facebook');
    }
  }
);

export const requestOtp = createAsyncThunk(
  'metaOnboarding/requestOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await metaOnboardingApi.requestOtp(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Failed to send OTP');
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'metaOnboarding/verifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await metaOnboardingApi.verifyOtp(payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || 'Invalid OTP. Please try again.');
    }
  }
);

// ─── Slice ────────────────────────────────────────────────────

const metaOnboardingSlice = createSlice({
  name: 'metaOnboarding',
  initialState: {
    activeStep: 0,

    // Step 1 – Business Details
    businessName: '',
    businessPhone: '',

    // Step 2 – Facebook Connect (populated by FB popup callbacks)
    fbAuthCode: null,       // authResponse.code from FB.login()
    wabaId: null,           // from window.message WA_EMBEDDED_SIGNUP event
    phoneNumberId: null,    // from window.message WA_EMBEDDED_SIGNUP event
    popupOpen: false,

    // Step 6 – OTP
    otpCode: '',
    otpSent: false,
    otpCooldown: 0,         // seconds remaining before resend allowed

    // Done
    onboardingComplete: false,

    // UI
    loading: false,
    error: null,
  },
  reducers: {
    setActiveStep: (state, action) => {
      state.activeStep = action.payload;
      state.error = null;
    },
    setBusinessName: (state, action) => {
      state.businessName = action.payload;
    },
    setBusinessPhone: (state, action) => {
      state.businessPhone = action.payload;
    },
    setFbAuthCode: (state, action) => {
      state.fbAuthCode = action.payload;
    },
    setWabaData: (state, action) => {
      state.wabaId = action.payload.wabaId;
      state.phoneNumberId = action.payload.phoneNumberId;
    },
    setPopupOpen: (state, action) => {
      state.popupOpen = action.payload;
    },
    setOtpCode: (state, action) => {
      state.otpCode = action.payload;
    },
    setOtpCooldown: (state, action) => {
      state.otpCooldown = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetOnboarding: () => ({
      activeStep: 0,
      businessName: '',
      businessPhone: '',
      fbAuthCode: null,
      wabaId: null,
      phoneNumberId: null,
      popupOpen: false,
      otpCode: '',
      otpSent: false,
      otpCooldown: 0,
      onboardingComplete: false,
      loading: false,
      error: null,
    }),
  },
  extraReducers: (builder) => {
    // exchangeCodeAndSetup
    builder
      .addCase(exchangeCodeAndSetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exchangeCodeAndSetup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exchangeCodeAndSetup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // requestOtp
    builder
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state) => {
        state.loading = false;
        state.otpSent = true;
        state.otpCooldown = 60;
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // verifyOtp
    builder
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
        state.onboardingComplete = true;
        state.activeStep = ONBOARDING_STEPS.DONE;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.otpCode = '';
      });
  },
});

// ─── Selectors ────────────────────────────────────────────────

export const selectOnboarding = (state) => state.metaOnboarding.metaOnboarding;
export const selectActiveStep = (state) => state.metaOnboarding.metaOnboarding.activeStep;
export const selectLoading = (state) => state.metaOnboarding.metaOnboarding.loading;
export const selectError = (state) => state.metaOnboarding.metaOnboarding.error;

export const {
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
} = metaOnboardingSlice.actions;

export default metaOnboardingSlice.reducer;
