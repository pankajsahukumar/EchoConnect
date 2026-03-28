import { Box, Typography } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DoneIcon from '@mui/icons-material/Done';
import useChatColors from './chatColors';

// ─── Timestamp helpers ──────────────────────────────────────────────────────

/**
 * Extract the best timestamp from a full message object (Data prop).
 */
export function getMsgTime(Data) {
  const raw =
    Data?.dateCreated ??
    Data?.messageTime ??
    Data?.statusTimestamp ??
    Data?.createdAt ??
    Data?.timestamp ??
    Data?.createdDate ??
    Data?.sentAt ??
    Data?.message?.dateCreated ??
    Data?.message?.timestamp ??
    Data?.message?.createdAt;
  if (!raw) return null;
  const d = typeof raw === 'number' ? new Date(raw) : new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

/**
 * Format a Date as "HH:MM" (24-hour, matching WhatsApp style).
 */
export function formatTime(date) {
  if (!date) return '';
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
}

// ─── React components ───────────────────────────────────────────────────────

/**
 * WhatsApp-style inline timestamp with optional read-tick.
 * Usage: <MsgTimestamp Data={Data} isMine={isMine} />
 */
export function MsgTimestamp({ Data, isMine }) {
  const c = useChatColors();
  const time = formatTime(getMsgTime(Data));
  if (!time) return null;

  const delivered = (Data?.deliveryCount ?? 0) > 0;
  const read = (Data?.readCount ?? 0) > 0;

  return (
    <Box
      component="span"
      sx={{
        float: 'right',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        ml: '8px',
        mt: '4px',
        fontSize: '11px',
        lineHeight: '15px',
        color: c.timestampText,
        userSelect: 'none',
      }}
    >
      {time}
      {isMine &&
        (delivered || read ? (
          <DoneAllIcon sx={{ fontSize: 16, color: read ? c.readTick : c.unreadTick }} />
        ) : (
          <DoneIcon sx={{ fontSize: 16, color: c.unreadTick }} />
        ))}
    </Box>
  );
}

/**
 * Sender name label (shown for contact messages).
 */
export function SenderName({ children }) {
  const c = useChatColors();
  if (!children) return null;
  return (
    <Typography
      sx={{
        color: c.accent,
        fontSize: '12.8px',
        fontWeight: 500,
        mb: '2px',
        px: '4px',
        lineHeight: '20px',
      }}
    >
      {children}
    </Typography>
  );
}

/**
 * Generic padded message body wrapper.
 */
export function MsgBody({ children, sx = {} }) {
  return (
    <Box sx={{ px: '12px', pt: '8px', pb: '10px', minWidth: 80, ...sx }}>
      {children}
    </Box>
  );
}

/**
 * WhatsApp tail SVG.
 */
export function BubbleTail({ isMine, color }) {
  return (
    <svg
      viewBox="0 0 8 13"
      width="8"
      height="13"
      style={{
        position: 'absolute',
        bottom: 0,
        [isMine ? 'right' : 'left']: -8,
        transform: isMine ? 'scaleX(-1)' : 'none',
      }}
    >
      <path
        fill={color}
        d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
      />
    </svg>
  );
}
