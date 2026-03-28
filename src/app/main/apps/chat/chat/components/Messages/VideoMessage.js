import { Box } from '@mui/material';
import TextComponent from './TextComponent';
import { MsgTimestamp, SenderName } from './shared/MessageParts';

const VideoMessage = ({ message, isMine, senderName, Data }) => {
  const src = message?.fileUrl;
  if (!src) return null;

  return (
    <Box sx={{ p: '3px', maxWidth: 330 }}>
      {!isMine && (
        <Box sx={{ px: '6px', pt: '4px' }}>
          <SenderName>{senderName}</SenderName>
        </Box>
      )}

      <Box sx={{ position: 'relative', borderRadius: '6px', overflow: 'hidden' }}>
        <video
          controls
          preload="metadata"
          style={{ width: '100%', maxHeight: 300, display: 'block', borderRadius: '6px' }}
        >
          <source src={src} type={message?.mimeType || 'video/mp4'} />
          Your browser does not support the video tag.
        </video>

        {/* Timestamp overlay on bottom-right */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            px: '8px',
            pb: '4px',
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)',
            pointerEvents: 'none',
          }}
        >
          <Box sx={{ '& span': { color: '#fff !important' }, '& svg': { color: '#fff !important' } }}>
            <MsgTimestamp Data={Data} isMine={isMine} />
          </Box>
        </Box>
      </Box>

      {/* Caption */}
      {message?.caption && (
        <Box sx={{ px: '6px', py: '4px', fontSize: '14.2px', lineHeight: '19px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <TextComponent text={message.caption} />
        </Box>
      )}
    </Box>
  );
};

export default VideoMessage;
