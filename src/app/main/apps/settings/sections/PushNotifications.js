import { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  Button,
  Tabs,
  Tab,
} from '@mui/material';

const BROWSER_TABS = [
  { id: 'chrome', label: 'Chrome' },
  { id: 'firefox', label: 'Firefox' },
  { id: 'edge', label: 'Edge' },
  { id: 'safari', label: 'Safari' },
];

const BROWSER_INSTRUCTIONS = {
  chrome: {
    title: 'Instructions to enable notifications in Chrome:',
    steps: [
      'Click the lock icon (or tune icon) in the address bar.',
      <><b>Site settings</b> will open.</>,
      <>Find <b>Notifications</b> and set it to <b>"Allow"</b>.</>,
      <><b>Refresh</b> this page when done.</>,
    ],
  },
  firefox: {
    title: 'Instructions to enable notifications in Firefox:',
    steps: [
      'Click the lock icon in the address bar.',
      <>Click <b>Connection secure</b> → <b>More Information</b>.</>,
      <>Go to the <b>Permissions</b> tab.</>,
      <>Find <b>Send Notifications</b> and check <b>"Allow"</b>.</>,
      <><b>Refresh</b> this page when done.</>,
    ],
  },
  edge: {
    title: 'Instructions to enable notifications in Edge:',
    steps: [
      'Click the lock icon in the address bar.',
      <>Click <b>Permissions for this site</b>.</>,
      <>Find <b>Notifications</b> and set it to <b>"Allow"</b>.</>,
      <><b>Refresh</b> this page when done.</>,
    ],
  },
  safari: {
    title: 'Instructions to enable notifications in Safari:',
    steps: [
      'Click Safari in the top menu.',
      <>Select <b>Preferences</b>.</>,
      'Click the Websites tab.',
    ],
    subSteps: [
      { text: <>Select <b>Notifications</b> in the sidebar</>, hint: 'Find web.doubletick.io and set to "Allow"' },
      { text: <>Select <b>Auto-Play</b> in the sidebar</>, hint: 'Set web.doubletick.io to "Allow All Auto-Play"' },
    ],
    finalStep: <><b>Refresh</b> this page when done</>,
  },
};

export default function PushNotifications() {
  const [desktopEnabled, setDesktopEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserTab, setBrowserTab] = useState('safari');

  const handleTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Test Notification', {
        body: 'Push notifications are working!',
      });
    } else if ('Notification' in window) {
      Notification.requestPermission();
    }
  };

  const instructions = BROWSER_INSTRUCTIONS[browserTab];

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          Push Notifications
        </Typography>
        <Button
          variant="text"
          color="primary"
          size="small"
          onClick={handleTestNotification}
          sx={{ textTransform: 'none' }}
        >
          Test notification
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2 }}>
        {/* Enable desktop notifications */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5,
            mb: 2,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Enable notifications on desktop
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Stay updated with all chat activities and alerts
            </Typography>
          </Box>
          <Switch
            checked={desktopEnabled}
            onChange={(e) => setDesktopEnabled(e.target.checked)}
            color="primary"
          />
        </Box>

        {/* Enable sound */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2.5,
            mb: 3,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <Box>
            <Typography variant="subtitle2" fontWeight={600}>
              Enable sound for notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Play a sound when receiving notifications
            </Typography>
          </Box>
          <Switch
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            color="primary"
          />
        </Box>

        {/* Manual instructions section */}
        <Box
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            mb: 3,
          }}
        >
          <Box sx={{ px: 2.5, pt: 2.5, pb: 1 }}>
            <Typography variant="subtitle2" fontWeight={600}>
              Manually enable notifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Choose your browser below & follow the instructions to enable notifications
            </Typography>
          </Box>

          {/* Browser tabs */}
          <Tabs
            value={browserTab}
            onChange={(_, val) => setBrowserTab(val)}
            sx={{
              px: 2.5,
              minHeight: 40,
              '& .MuiTab-root': {
                textTransform: 'none',
                minHeight: 40,
                fontSize: 13,
                fontWeight: 500,
              },
              '& .MuiTabs-indicator': {
                bgcolor: 'primary.main',
              },
            }}
          >
            {BROWSER_TABS.map((b) => (
              <Tab key={b.id} value={b.id} label={b.label} />
            ))}
          </Tabs>

          {/* Instructions */}
          <Box sx={{ px: 2.5, py: 2 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              {instructions.title}
            </Typography>

            <Box component="ol" sx={{ pl: 2.5, m: 0 }}>
              {instructions.steps.map((step, i) => (
                <Typography component="li" variant="body2" key={i} sx={{ mb: 0.5 }}>
                  {step}
                </Typography>
              ))}

              {/* Safari-specific sub-steps */}
              {instructions.subSteps && (
                <Box component="ul" sx={{ pl: 2, my: 0.5 }}>
                  {instructions.subSteps.map((sub, i) => (
                    <li key={i}>
                      <Typography variant="body2">{sub.text}</Typography>
                      <Typography variant="body2" color="primary.main" sx={{ fontSize: 12 }}>
                        {sub.hint}
                      </Typography>
                    </li>
                  ))}
                </Box>
              )}

              {instructions.finalStep && (
                <Typography component="li" variant="body2" sx={{ mt: 0.5 }}>
                  {instructions.finalStep}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

        {/* Sound test info */}
        <Box
          sx={{
            p: 2.5,
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.default',
          }}
        >
          <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
            To test sound:
          </Typography>
          <Box component="ul" sx={{ pl: 2, m: 0 }}>
            <Typography component="li" variant="body2" sx={{ mb: 0.3 }}>
              Ensure your device is not muted
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 0.3 }}>
              Check that your system volume is turned up
            </Typography>
            <Typography component="li" variant="body2">
              Verify your speakers/headphones are connected
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
