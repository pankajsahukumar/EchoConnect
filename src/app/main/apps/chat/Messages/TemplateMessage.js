import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { inherit } from 'tailwindcss/colors';

const TemplateContainer = styled(Box)(() => ({
  maxWidth: 320,
  backgroundColor: 'inherit', // Inherit from parent StyledMessageRow
  borderRadius: '7.5px',
  overflow: 'visible',
  fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif',
  position: 'relative',
}));

const MessageTail = styled('div')(({ isMine }) => ({
  position: 'absolute',
  bottom: 0,
  right: isMine ? -8 : 'auto',
  left: isMine ? 'auto' : -8,
  width: 8,
  height: 13,
  '& svg': {
    width: 8,
    height: 13,
    color: isMine ? '#ffff ' : 'rgba(189, 216, 200, 0.5)',
    transform: isMine ? 'scaleX(-1)' : 'none',
  },
}));

const SenderName = styled('div')(() => ({
  color: '#00a884',
  fontSize: '12.8px',
  fontWeight: 500,
  marginBottom: '2px',
  padding:"9px 7px 0 9px",
}));

const TemplateContent = styled(Box)(() => ({
  backgroundColor: 'transparent',
  borderRadius: '7.5px',
  overflow: 'hidden',
}));

const TemplateImage = styled('img')(() => ({
  width: '100%',
  height: 'auto',
  display: 'block',
  maxHeight: '200px',
  objectFit: 'cover',
}));

const TemplateTextContent = styled(Box)(() => ({
  padding: '12px 16px',
  '& .template-text': {
    fontSize: '14.2px',
    lineHeight: '19px',
    color: '#111b21',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    marginBottom: '8px',
    '&:last-child': {
      marginBottom: 0,
    },
  },
}));
const TemplateButtonBox = styled(Box)(() => ({
  width: '100%',
  fontWeight: 700,
  textDecoration: 'none',
  color: 'rgb(0, 157, 226)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
  background: inherit,
  borderRight: 'none',
  borderBottom: 'none',
  borderLeft: 'none',
  borderTop: '1px solid rgba(189, 216, 200, 0.5)',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 168, 132, 0.05)',
  },
}));
const TemplateButton = styled(Button)(() => ({
  width: '100%',
  backgroundColor: 'transparent',
  color: 'rgb(0, 157, 226)',
  border: 'none',
  borderRadius: 0,
  padding: '12px 0',
  fontSize: '14.2px',
  fontWeight: 500,
  textTransform: 'none',
  fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif',
  boxShadow: 'none',
  '&:hover': {
    backgroundColor: 'rgba(0, 168, 132, 0.05)',
    border: 'none',
    borderTop: '1px solid #e9edef',
    boxShadow: 'none',
  },
  '&:focus': {
    backgroundColor: 'rgba(0, 168, 132, 0.05)',
    boxShadow: 'none',
  },
  '&:active': {
    boxShadow: 'none',
  },
}));

const TimeStamp = styled('div')(() => ({
  fontSize: '11px',
  color: '#667781',
  fontWeight: 400,
  marginTop: '4px',
  float: 'right',
  marginLeft: '6px',
  lineHeight: '15px',
  padding: '0 9px 6px 0',
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

const TemplateMessage = ({ message, isMine, senderName }) => {
  const template = message?.payload?.template || message?.templateMessage;

  if (!template) {
    return null;
  }

  // Handle the JSON structure from dummy data
  const { header, body, buttons, footer } = template;
  const bodyText = body?.data?.[0]?.text || body?.text;
  const footerText = footer?.data?.[0]?.text || footer?.text;

  // Format time like WhatsApp (HH:MM)
  const createdAt = message.dateCreated ? new Date(message.dateCreated) :
                   message.messageTime ? new Date(message.messageTime) :
                   message.createdAt ? new Date(message.createdAt) : new Date();
  const timeString = createdAt.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <TemplateContainer>
      {/* Sender name for contact messages */}
      {!isMine && senderName && (
        <SenderName>
          {senderName}
        </SenderName>
      )}

      <TemplateContent>
        {/* Header with image */}
        {header?.type === 'IMAGE' && header.image?.link && (
          <TemplateImage
            src={header.image.link}
            alt="Template header"
          />
        )}

        {/* Body text content */}
        <TemplateTextContent>
          {header?.type === 'TEXT' && header.text && (
            <Typography className="template-text" style={{ fontWeight: 600 }}>
              {header.text}
            </Typography>
          )}

          {bodyText && (
            <Typography className="template-text">
              {bodyText}
            </Typography>
          )}

          {footerText && (
            <Typography className="template-text" style={{ fontSize: '12px', color: '#667781', marginTop: '8px' }}>
              {footerText}
            </Typography>
          )}
        </TemplateTextContent>
        <TimeStamp>
        {timeString}
        {isMine && (
          <span style={{ marginLeft: '2px', color: '#00a884' }}>
            ✓✓
          </span>
        )}
      </TimeStamp>
        {buttons && buttons.length > 0 && (
          <>
            {buttons.map((button, index) => (
                <TemplateButtonBox>
              <TemplateButton
                key={index}
                onClick={() => {
                  if (button.type === 'URL' && button.url) {
                    window.open(button.url, '_blank');
                  }
                }}
                startIcon={
                  button.type === 'URL' ? (
                    <span style={{ fontSize: '14px' }}>🔗</span>
                  ) : null
                }
              >
                {button.text}
              </TemplateButton>
              </TemplateButtonBox>
            ))}
          </>
        )}
      </TemplateContent>

      {/* WhatsApp-style message tail */}
      <MessageTailSvg isMine={isMine} />
    </TemplateContainer>
  );
};

export default TemplateMessage;

