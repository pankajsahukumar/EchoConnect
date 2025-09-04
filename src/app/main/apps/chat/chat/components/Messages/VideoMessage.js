import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const VideoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: '320px',
  borderRadius: '8px',
  overflow: 'hidden',
}));

const VideoThumbnail = styled(Box)({
  position: 'relative',
  width: '100%',
  paddingTop: '56.25%', // 16:9 aspect ratio
  backgroundColor: '#000',
  cursor: 'pointer',
});

const VideoPlayer = styled('video')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
});

const PlayButton = styled(IconButton)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  color: '#fff',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
});

const VideoInfo = styled(Box)({
  padding: '8px 12px',
  backgroundColor: 'rgba(0, 0, 0, 0.04)',
});

const VideoMessage = ({ message, isMine, senderName }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoUrl = message?.payload?.video?.url;
  const filename = message?.payload?.video?.filename;
  const thumbnail = message?.payload?.video?.thumbnail;

  if (!videoUrl) {
    return null;
  }

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  return (
    <VideoContainer>
      <VideoThumbnail>
        {!isPlaying ? (
          <>
            <Box
              component="img"
              src={thumbnail || videoUrl}
              alt="Video thumbnail"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <PlayButton onClick={handlePlayClick}>
              <FuseSvgIcon size={36}>heroicons-outline:play</FuseSvgIcon>
            </PlayButton>
          </>
        ) : (
          <VideoPlayer
            controls
            autoPlay
            src={videoUrl}
            onPause={() => setIsPlaying(false)}
          />
        )}
      </VideoThumbnail>
      {filename && (
        <VideoInfo>
          <Typography variant="caption" color="text.secondary">
            {filename}
          </Typography>
        </VideoInfo>
      )}
    </VideoContainer>
  );
};

export default VideoMessage;