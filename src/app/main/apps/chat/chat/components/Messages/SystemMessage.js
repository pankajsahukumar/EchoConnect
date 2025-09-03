import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const SystemContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  margin: '12px 0',
  width: '100%',
}));

const SystemBadge = styled(Box)(() => ({
  backgroundColor: 'rgba(0, 0, 0, 0.05)',
  borderRadius: '7.5px',
  padding: '6px 12px',
  maxWidth: '80%',
  textAlign: 'center',
}));

const SystemText = styled(Typography)(() => ({
  fontSize: '12.8px',
  color: '#667781',
  fontWeight: 400,
  lineHeight: '16px',
  fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif',
}));



function SystemMessage({ message }) {
  // Get system message text
  const systemText = message?.text ||
                    message?.payload?.text?.body ||
                    'System message';

  // Format date for system messages
  const formatSystemDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Check if this is a date separator type message
  const isDateSeparator = message?.actionType === 'DATE_SEPARATOR' ||
                         systemText.toLowerCase().includes('today') ||
                         systemText.toLowerCase().includes('yesterday');

  const displayText = isDateSeparator ?
    formatSystemDate(message?.dateCreated || new Date()) :
    systemText;

  return (
    <SystemContainer>
      <SystemBadge>
        <SystemText>
          {displayText}
        </SystemText>
      </SystemBadge>
    </SystemContainer>
  );
}

export default SystemMessage;

