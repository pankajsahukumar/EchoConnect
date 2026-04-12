// Facebook JS SDK lazy loader + WhatsApp Embedded Signup launcher.
// The SDK is loaded on first use (not in index.html) to avoid blocking
// users who never visit the onboarding flow.

let sdkReady = false;
let sdkLoading = false;
const readyCallbacks = [];

function onSdkReady(cb) {
  if (sdkReady) {
    cb();
    return;
  }
  readyCallbacks.push(cb);
}

/**
 * Load the FB JS SDK lazily. Safe to call multiple times — loads once.
 * @param {string} appId - Your Meta App ID (REACT_APP_FB_APP_ID)
 * @returns {Promise<void>}
 */
export function loadFbSdk(appId) {
  return new Promise((resolve) => {
    if (sdkReady) {
      resolve();
      return;
    }
    onSdkReady(resolve);
    if (sdkLoading) return;
    sdkLoading = true;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId,
        cookie: true,
        xfbml: true,
        version: 'v21.0',
      });
      sdkReady = true;
      sdkLoading = false;
      readyCallbacks.forEach((cb) => cb());
      readyCallbacks.length = 0;
    };

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  });
}

/**
 * Launch Meta WhatsApp Embedded Signup popup.
 *
 * Resolves with { code, wabaId, phoneNumberId } when the user finishes.
 * - wabaId / phoneNumberId come from the window.message WA_EMBEDDED_SIGNUP event.
 * - If that event doesn't arrive within 3 s of the login callback, we resolve
 *   anyway with null IDs so the flow isn't stuck (backend can look them up).
 *
 * @param {string} configId   - Meta App Configuration ID
 * @param {string} solutionId - Partner Solution ID (optional)
 * @returns {Promise<{ code: string, wabaId: string|null, phoneNumberId: string|null }>}
 */
export function launchWhatsAppSignup(configId, solutionId) {
  return new Promise((resolve, reject) => {
    let sessionData = null; // populated by window.message WA_EMBEDDED_SIGNUP event

    // ── Step 1: register the message listener BEFORE calling FB.login() ──
    // This captures waba_id + phone_number_id from the embedded signup popup.
    const messageHandler = (event) => {
      if (event.origin !== 'https://www.facebook.com') return;
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (
          data.type === 'WA_EMBEDDED_SIGNUP' &&
          (data.event === 'FINISH' || data.event === 'FINISH_ONLY_WABA')
        ) {
          sessionData = data.data; // { waba_id, phone_number_id }
        }
      } catch {
        // ignore non-JSON cross-origin messages
      }
    };
    window.addEventListener('message', messageHandler);

    // ── Step 2: build login options ──
    const loginOptions = configId
      ? {
          config_id: configId,
          response_type: 'code',
          override_default_response_type: true,
          extras: {
            setup: solutionId ? { solutionID: solutionId } : {},
            sessionInfoVersion: 3,
            featureType: 'whatsapp_business_app_onboarding',
          },
        }
      : {
          // Fallback when no config_id is set (dev / testing without Embedded Signup config)
          scope: 'whatsapp_business_management,whatsapp_business_messaging,business_management',
          return_scopes: true,
        };

    // ── Step 3: open the FB popup ──
    window.FB.login((response) => {
      window.removeEventListener('message', messageHandler);

      if (!response.authResponse) {
        reject(new Error('Facebook login was cancelled or failed. Please try again.'));
        return;
      }

      const code =
        response.authResponse.code ||
        response.authResponse.accessToken ||
        null;

      // If the window.message already fired before FB.login callback (rare but possible)
      if (sessionData) {
        resolve({
          code,
          wabaId: sessionData.waba_id || null,
          phoneNumberId: sessionData.phone_number_id || null,
        });
        return;
      }

      // window.message hasn't arrived yet — wait up to 3 s for it.
      // This covers the common case where FB.login fires first.
      const waitTimeout = setTimeout(() => {
        window.removeEventListener('message', waitHandler);
        // Resolve with whatever we have; null IDs are handled by the backend.
        resolve({ code, wabaId: null, phoneNumberId: null });
      }, 3000);

      const waitHandler = (event) => {
        if (event.origin !== 'https://www.facebook.com') return;
        try {
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          if (
            data.type === 'WA_EMBEDDED_SIGNUP' &&
            (data.event === 'FINISH' || data.event === 'FINISH_ONLY_WABA')
          ) {
            clearTimeout(waitTimeout);
            window.removeEventListener('message', waitHandler);
            resolve({
              code,
              wabaId: data.data.waba_id || null,
              phoneNumberId: data.data.phone_number_id || null,
            });
          }
        } catch {
          // ignore
        }
      };
      window.addEventListener('message', waitHandler);
    }, loginOptions);
  });
}
