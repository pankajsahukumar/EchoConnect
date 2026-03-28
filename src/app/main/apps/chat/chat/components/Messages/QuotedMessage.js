import { Box, Typography } from '@mui/material';
import useChatColors from './shared/chatColors';

function QuotedMessage({ quote, isMine, onQuoteClick }) {
  const c = useChatColors();
  if (!quote) return null;

  const author = quote.authorName || (isMine ? 'You' : 'Contact');
  const preview = quote.preview || 'Message';

  return (
    <Box
      onClick={() => onQuoteClick?.(quote)}
      sx={{
        borderLeft: `4px solid ${c.quoteBorder}`,
        backgroundColor: c.quoteBg,
        borderRadius: '7.5px',
        px: '10px',
        py: '6px',
        mx: '5px',
        mt: '5px',
        cursor: 'pointer',
        '&:hover': { opacity: 0.85 },
      }}
    >
      <Typography sx={{ fontSize: '12.8px', fontWeight: 600, color: c.accent, lineHeight: '18px' }}>
        {author}
      </Typography>
      <Typography
        sx={{
          fontSize: '13px',
          color: c.timestampText,
          lineHeight: '18px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          whiteSpace: 'pre-wrap',
        }}
      >
        {preview}
      </Typography>
    </Box>
  );
}

export default QuotedMessage;
