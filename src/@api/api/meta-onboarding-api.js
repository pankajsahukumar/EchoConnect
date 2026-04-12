import { apiClient } from '../utils/apiClient';

// Set to false when Java backend endpoints are ready
const USE_DUMMY = true;

export const metaOnboardingApi = {
  // Exchange FB auth code for System User Access Token (backend handles Meta Graph API call)
  // payload: { code, wabaId, phoneNumberId }
  async exchangeCodeAndSetup(payload) {
    if (USE_DUMMY) return { data: { success: true } };
    return apiClient.post('/api/meta/auth/exchange', payload);
  },

  // Trigger OTP delivery to the registered phone number
  // payload: { phoneNumberId, codeMethod: 'SMS' | 'VOICE', language: 'en_US' }
  async requestOtp(payload) {
    if (USE_DUMMY) return { data: { success: true } };
    return apiClient.post('/api/meta/phone-number/verify/send', payload);
  },

  // Validate the 6-digit OTP the user entered
  // payload: { phoneNumberId, code }
  async verifyOtp(payload) {
    if (USE_DUMMY) return { data: { verified: true } };
    return apiClient.post('/api/meta/phone-number/verify/confirm', payload);
  },
};
