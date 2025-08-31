import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const QuotedContainer = styled(Box)(({ isMine }) => ({
  borderLeft: `3px solid ${isMine ? '#00a884' : '#00a884'}`,
  backgroundColor: 'rgba(0, 168, 132, 0.1)',
  borderRadius: '7.5px',
  padding: '8px 12px',
  margin: '4px 0 8px 0',
  cursor: 'pointer',
  maxWidth: '100%',
  '&:hover': {
    backgroundColor: 'rgba(0, 168, 132, 0.15)',
  },
}));

const QuotedAuthor = styled(Typography)(() => ({
  fontSize: '12.8px',
  fontWeight: 500,
  color: '#00a884',
  marginBottom: '2px',
  lineHeight: '16px',
}));

const QuotedText = styled(Typography)(() => ({
  fontSize: '13px',
  color: '#667781',
  lineHeight: '18px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  whiteSpace: 'pre-wrap',
}));

function QuotedMessage({ quote, isMine, onQuoteClick }) {
  if (!quote) return null;

  const handleClick = () => {
    if (onQuoteClick && quote.id) {
      onQuoteClick(quote.id);
    }
  };

  const getQuotedText = () => {
    if (quote.type === 'template') {
      return quote.preview || 'Template message';
    }
    return quote.preview || 'Message';
  };

  const getAuthorName = () => {
    if (quote.authorName) {
      return quote.authorName;
    }
    return isMine ? 'You' : 'Contact';
  };

  return (
    <QuotedContainer isMine={isMine} onClick={handleClick}>
      <QuotedAuthor>
        {getAuthorName()}
      </QuotedAuthor>
      <QuotedText>
        {getQuotedText()}
      </QuotedText>
    </QuotedContainer>
  );
}

export default QuotedMessage;
