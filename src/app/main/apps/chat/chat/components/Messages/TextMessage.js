import React from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import TextComponent from './TextComponent';

const TextContainer = styled(Box)(() => ({
  width: '100%',
  fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif',
  position: 'relative',
  padding: '6px 7px 8px 9px',
  // Remove duplicate styling - let parent handle background, border, shadow
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

const TextMessage = ({ message, isMine, senderName }) => {
  // Get text content from different possible structures
  const messageText = message?.text ||
                     message?.payload?.text?.body ||
                     message?.body?.text ||
                     message?.interactiveMessage?.body?.text ||
                     'No text content';

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
    <TextContainer>
      {/* Sender name for contact messages */}
      {isMine && senderName && (
        <SenderName>
          {senderName}
        </SenderName>
      )}

      {/* Text content */}
      <TextContent>
         <TextComponent text={messageText} />
        {/* {messageText} */}
      </TextContent>

      {/* Time and status */}
      <TimeStamp>
        {timeString}
        {isMine && (
          <span style={{ marginLeft: '2px', color: '#00a884' }}>
            ✓✓
          </span>
        )}
      </TimeStamp>
    </TextContainer>
  );
}

export default TextMessage;

