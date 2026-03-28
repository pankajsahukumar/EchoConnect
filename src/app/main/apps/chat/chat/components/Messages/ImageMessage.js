import { useMemo } from 'react';
import { Box, IconButton } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { calculateScaledDimensions } from 'src/utils/calculateScaledDimensions';
import TextComponent from './TextComponent';
import { MsgTimestamp, SenderName } from './shared/MessageParts';

const ImageMessage = ({ message, isMine, senderName, Data }) => {
  const dims = useMemo(
    () => calculateScaledDimensions(message?.width, message?.height, 300, 300, 200, 200),
    [message?.width, message?.height],
  );

  const src = message?.thumbnailUrl || message?.fileUrl;
  if (!src) return null;

  const handleOpen = () => window.open(message.fileUrl, '_blank');
  const handleDownload = (e) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = message.fileUrl;
    a.download = message.fileName || 'image';
    a.click();
  };

  return (
    <Box sx={{ p: '3px', maxWidth: 330 }}>
      {!isMine && (
        <Box sx={{ px: '6px', pt: '4px' }}>
          <SenderName>{senderName}</SenderName>
        </Box>
      )}

      {/* Image + overlay */}
      <Box
        sx={{
          position: 'relative',
          borderRadius: '6px',
          overflow: 'hidden',
          cursor: 'pointer',
          width: dims.width,
          height: dims.height,
        }}
        onClick={handleOpen}
      >
        <img
          src={src}
          alt={message.fileName || 'Image'}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
        {/* Top gradient with download */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            p: '6px',
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)',
          }}
        >
          <IconButton
            size="small"
            onClick={handleDownload}
            sx={{ color: '#fff', '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' } }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Box>
        {/* Bottom gradient with time */}
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

export default ImageMessage;
