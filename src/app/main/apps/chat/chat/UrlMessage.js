import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const UrlContainer = styled(Box)(({ theme }) => ({
  maxWidth: 350,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  border: '1px solid',
  borderColor: theme.palette.divider,
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  transition: 'all 0.2s ease',
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
    transform: 'translateY(-1px)',
  },
}));

const UrlPreview = styled(Box)(({ theme }) => ({
  padding: '16px',
  '& .url-title': {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
    marginBottom: '8px',
    wordBreak: 'break-word',
  },
  '& .url-domain': {
    fontSize: '0.8rem',
    color: theme.palette.text.secondary,
    marginBottom: '12px',
    fontFamily: 'monospace',
  },
  '& .url-button': {
    width: '100%',
    padding: '8px 16px',
    borderRadius: 6,
    textTransform: 'none',
    fontSize: '0.85rem',
    fontWeight: 600,
    '&:hover': {
      transform: 'translateY(-1px)',
      boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
    },
    transition: 'all 0.2s ease',
  },
}));

const UrlMessage = ({ message, isMine }) => {
  const { text, messageType } = message;
  
  if (messageType !== 'text' || !text) {
    return null;
  }

  // Check if the message contains a URL
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);
  
  if (!urls) {
    return null;
  }

  const getDomain = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  };

  const getUrlTitle = (url) => {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.split('/').pop() || urlObj.hostname;
    } catch {
      return 'Link';
    }
  };

  return (
    <UrlContainer>
      <UrlPreview>
        <Typography className="url-title">
          {getUrlTitle(urls[0])}
        </Typography>
        <Typography className="url-domain">
          {getDomain(urls[0])}
        </Typography>
        <Button
          className="url-button"
          variant="outlined"
          color="primary"
          component="a"
          href={urls[0]}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<FuseSvgIcon>heroicons-outline:external-link</FuseSvgIcon>}
        >
          Open Link
        </Button>
      </UrlPreview>
    </UrlContainer>
  );
};

export default UrlMessage;

