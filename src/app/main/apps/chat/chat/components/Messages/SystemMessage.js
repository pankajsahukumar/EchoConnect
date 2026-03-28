import { Box, Typography } from '@mui/material';
import useChatColors from './shared/chatColors';

/**
 * Centered system message badge (conversation events, bot actions, date markers).
 * Styled to be visible on the dark chat background.
 */
function SystemMessage({ message, Data }) {
  const c = useChatColors();
  const text = message?.text || 'System message';

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', my: '6px' }}>
      <Box
        sx={{
          backgroundColor: c.systemBg,
          backdropFilter: 'blur(10px)',
          borderRadius: '7.5px',
          px: '12px',
          py: '5px',
          maxWidth: '85%',
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: '12.5px',
            color: c.systemText,
            fontWeight: 400,
            lineHeight: '18px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}

export default SystemMessage;
