import { Box, IconButton, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import DownloadIcon from '@mui/icons-material/Download';
import useChatColors from './shared/chatColors';
import { MsgTimestamp, SenderName } from './shared/MessageParts';

function getFileIcon(fileName) {
  const ext = (fileName || '').split('.').pop().toLowerCase();
  const sx = { fontSize: 36 };
  if (ext === 'pdf') return <PictureAsPdfIcon sx={{ ...sx, color: '#D93025' }} />;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return <ImageIcon sx={{ ...sx, color: '#1A73E8' }} />;
  if (['doc', 'docx'].includes(ext)) return <ArticleIcon sx={{ ...sx, color: '#185ABD' }} />;
  return <DescriptionIcon sx={{ ...sx, color: '#00A884' }} />;
}

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const DocumentMessage = ({ message, isMine, senderName, Data }) => {
  const c = useChatColors();

  const handleDownload = () => {
    if (!message?.fileUrl) return;
    const a = document.createElement('a');
    a.href = message.fileUrl;
    a.download = message.fileName || 'document';
    a.click();
  };

  return (
    <Box sx={{ maxWidth: 320, p: '4px' }}>
      {!isMine && (
        <Box sx={{ px: '6px', pt: '2px' }}>
          <SenderName>{senderName}</SenderName>
        </Box>
      )}

      {/* Document card */}
      <Box
        onClick={handleDownload}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: '12px',
          py: '10px',
          mx: '3px',
          borderRadius: '7.5px',
          backgroundColor: c.quoteBg,
          cursor: 'pointer',
          '&:hover': { opacity: 0.85 },
        }}
      >
        {getFileIcon(message?.fileName)}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {message?.fileName || 'Untitled'}
          </Typography>
          {message?.size && (
            <Typography sx={{ fontSize: 12, color: c.timestampText, mt: '2px' }}>
              {formatSize(message.size)}
            </Typography>
          )}
        </Box>
        <IconButton size="small" sx={{ color: c.accent }}>
          <DownloadIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ px: '9px', pb: '4px' }}>
        <MsgTimestamp Data={Data} isMine={isMine} />
      </Box>
    </Box>
  );
};

export default DocumentMessage;
