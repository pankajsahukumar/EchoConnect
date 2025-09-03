import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const ImageContainer = styled(Box)(() => ({
  width: '100%',
  maxWidth: '330px',
  position: 'relative',
  padding: '6px',
  borderRadius: '7.5px',
  overflow: 'hidden',
}));

const StyledImage = styled('img')(() => ({
  width: '100%',
  height: 'auto',
  maxHeight: '330px',
  objectFit: 'cover',
  borderRadius: '6px',
  cursor: 'pointer',
}));

const ImageOverlay = styled(Box)(() => ({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '8px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)',
  width: '100%',
}));



const SenderName = styled('div')(() => ({
  color: '#00a884',
  fontSize: '12.8px',
  fontWeight: 500,
  marginBottom: '2px',
  padding: '0 0 2px 0',
}));

const TextContent = styled('div')(() => ({
  fontSize: '14.2px',
  lineHeight: '19px',
  color: '#111b21',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif',
}));

const TimeStamp = styled('div')(() => ({
  fontSize: '11px',
  color: '#667781',
  fontWeight: 400,
  marginTop: '4px',
  float: 'right',
  marginLeft: '6px',
  lineHeight: '15px',
}));

const MessageTailSvg = ({ isMine }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      right: isMine ? -8 : 'auto',
      left: isMine ? 'auto' : -8,
      width: 8,
      height: 13,
      transform: isMine ? 'scaleX(-1)' : 'none',
    }}
  >
    <svg viewBox="0 0 8 13" width="8" height="13">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#d2d2d2" floodOpacity="0.4" />
        </filter>
      </defs>
      <path
        fill={isMine ? '#d9fdd3' : '#ffffff'}
        d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
        filter="url(#shadow)"
      />
    </svg>
  </div>
);

const ImageMessage = ({ message, isMine, senderName }) => {
  // Format time like WhatsApp (HH:MM)
  const createdAt = message.dateCreated ? new Date(message.dateCreated) :
                   message.messageTime ? new Date(message.messageTime) :
                   message.createdAt ? new Date(message.createdAt) : new Date();
  const timeString = createdAt.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleImageClick = () => {
    window.open(message.fileUrl, '_blank');
  };

  const handleDownload = (e) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = message.fileUrl;
    link.download = message.fileName || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <ImageContainer>
      {/* Sender name for contact messages */}
      {!isMine && senderName && (
        <SenderName>
          {senderName}
        </SenderName>
      )}

      {/* Image with overlay */}
      <Box position="relative">
        <StyledImage
          src={message.thumbnailUrl || message.fileUrl}
          alt={message.fileName || 'Image'}
          onClick={handleImageClick}
          loading="lazy"
        />
        <ImageOverlay>
          <IconButton
            size="small"
            onClick={handleDownload}
            sx={{ color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
          <TimeStamp sx={{ color: 'white', margin: 0 }}>
            {timeString}
            {isMine && (
              <span style={{ marginLeft: '2px', color: '#fff' }}>
                ✓✓
              </span>
            )}
          </TimeStamp>
        </ImageOverlay>
      </Box>
    </ImageContainer>
  );
}

export default ImageMessage;

