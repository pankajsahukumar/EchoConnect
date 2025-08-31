import React from 'react';
import { Box, Typography, Chip, Avatar } from '@mui/material';
import { styled } from '@mui/material/styles';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const SystemContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: '16px 0',
  '& .system-bubble': {
    backgroundColor: theme.palette.mode === 'light' ? '#f0f2f5' : '#2a2a2a',
    borderRadius: 20,
    padding: '8px 16px',
    maxWidth: '80%',
    textAlign: 'center',
    border: '1px solid',
    borderColor: theme.palette.divider,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
}));

const SystemMessage = styled(Typography)(({ theme }) => ({
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
  fontWeight: 500,
  lineHeight: 1.4,
}));

const ActionChip = styled(Chip)(({ theme }) => ({
  height: 20,
  fontSize: '0.7rem',
  marginLeft: 8,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '& .MuiChip-label': {
    padding: '0 8px',
  },
}));

const BotInfo = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
  marginTop: 4,
  '& .bot-avatar': {
    width: 16,
    height: 16,
    fontSize: '0.7rem',
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  '& .bot-name': {
    fontSize: '0.75rem',
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
}));

const SystemMessageComponent = ({ message }) => {
  const { messageType, actionType, actorType, actorId, text, botRunId, botRunLogId } = message;
  
  if (messageType !== 'system_message_v2') {
    return null;
  }

  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'ASSIGN_AGENT':
        return 'heroicons-outline:user-plus';
      case 'SEND_MESSAGE':
        return 'heroicons-outline:chat-bubble-left';
      case 'API_CALL':
        return 'heroicons-outline:server';
      case 'SET_TAGS':
        return 'heroicons-outline:tag';
      default:
        return 'heroicons-outline:information-circle';
    }
  };

  const getActionColor = (actionType) => {
    switch (actionType) {
      case 'ASSIGN_AGENT':
        return 'success';
      case 'SEND_MESSAGE':
        return 'info';
      case 'API_CALL':
        return 'warning';
      case 'SET_TAGS':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const formatSystemText = (text, actionType) => {
    if (actionType === 'ASSIGN_AGENT') {
      return text;
    }
    if (actionType === 'SEND_MESSAGE') {
      return text;
    }
    if (actionType === 'API_CALL') {
      return text;
    }
    if (actionType === 'SET_TAGS') {
      return text;
    }
    return text;
  };

  return (
    <SystemContainer>
      <Box className="system-bubble">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <FuseSvgIcon 
            size={16} 
            color="action"
            sx={{ opacity: 0.7 }}
          >
            {getActionIcon(actionType)}
          </FuseSvgIcon>
          <SystemMessage>
            {formatSystemText(text, actionType)}
          </SystemMessage>
          {actionType && (
            <ActionChip 
              label={actionType.replace('_', ' ')} 
              size="small"
              color={getActionColor(actionType)}
            />
          )}
        </Box>
        
        {/* Bot Info for bot actions */}
        {actorType === 'BOT' && (
          <BotInfo>
            <Avatar className="bot-avatar">
              B
            </Avatar>
            <Typography className="bot-name">
              {actorId ? 'Bot' : 'System'}
            </Typography>
            {botRunId && (
              <Typography className="bot-name" sx={{ opacity: 0.7 }}>
                (ID: {botRunId.slice(-6)})
              </Typography>
            )}
          </BotInfo>
        )}
      </Box>
    </SystemContainer>
  );
};

export default SystemMessageComponent;

