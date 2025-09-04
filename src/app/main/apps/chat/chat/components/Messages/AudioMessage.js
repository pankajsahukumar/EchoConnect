import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const AudioContainer = styled(Box)(({ theme }) => ({
  padding: '8px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '280px',
  maxWidth: '400px',
}));

const AudioPlayer = styled('audio')({
  width: '100%',
  height: '40px',
  '&::-webkit-media-controls-panel': {
    backgroundColor: 'transparent',
  },
});

const AudioMessage = ({ message, isMine, senderName }) => {
  const audioUrl = message?.payload?.audio?.url;
  const filename = message?.payload?.audio?.filename;

  if (!audioUrl) {
    return null;
  }

  return (
    <AudioContainer>
      <IconButton size="small">
        <FuseSvgIcon size={24}>heroicons-outline:musical-note</FuseSvgIcon>
      </IconButton>
      <Box sx={{ flex: 1 }}>
        {filename && (
          <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
            {filename}
          </Typography>
        )}
        <AudioPlayer controls src={audioUrl} />
      </Box>
    </AudioContainer>
  );
};

export default AudioMessage;