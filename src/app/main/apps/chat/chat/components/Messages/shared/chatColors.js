import { useTheme, alpha } from '@mui/material/styles';
import { useMemo } from 'react';

/**
 * WhatsApp-style colors derived from the MUI theme.
 * All message components should use this hook instead of hardcoding hex values.
 */
export default function useChatColors() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return useMemo(
    () => ({
      // Message bubbles
      outgoingBubble: isDark ? '#005c4b' : '#d9fdd3',
      incomingBubble: isDark ? '#202c33' : '#ffffff',

      // Text
      primaryText: theme.palette.text.primary,
      secondaryText: theme.palette.text.secondary,
      timestampText: isDark ? '#8696a0' : '#667781',

      // Accent
      accent: isDark ? '#00a884' : '#00a884',
      linkBlue: isDark ? '#53bdeb' : '#039be5',
      buttonBlue: isDark ? '#53bdeb' : '#009de2',

      // Status ticks
      readTick: isDark ? '#53bdeb' : '#53bdeb',
      unreadTick: isDark ? '#8696a0' : '#667781',

      // Bubble shadow
      bubbleShadow: isDark
        ? '0 1px 0.5px rgba(0,0,0,.35)'
        : '0 1px 0.5px rgba(11,20,26,.13)',

      // System messages
      systemBg: isDark ? alpha('#fff', 0.06) : alpha('#000', 0.05),
      systemText: isDark ? '#8696a0' : '#667781',

      // Quote
      quoteBg: isDark ? 'rgba(0, 168, 132, 0.12)' : 'rgba(0, 168, 132, 0.1)',
      quoteBorder: '#00a884',

      // Divider
      divider: theme.palette.divider,

      // Chat background
      chatBg: isDark ? '#0b141a' : '#efeae2',
    }),
    [theme, isDark],
  );
}
