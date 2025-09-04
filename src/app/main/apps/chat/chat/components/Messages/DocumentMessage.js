import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

const DocumentContainer = styled(Box)(({ theme }) => ({
  padding: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  minWidth: '280px',
  maxWidth: '400px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

const FileInfo = styled(Box)({
  flex: 1,
  overflow: 'hidden',
});

const FileName = styled(Typography)({
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

const FileSize = styled(Typography)({
  color: 'text.secondary',
});

const DocumentMessage = ({ message, isMine, senderName }) => {
  const docUrl = message?.payload?.document?.url;
  const filename = message?.payload?.document?.filename;
  const filesize = message?.payload?.document?.filesize;
  const mimetype = message?.payload?.document?.mimetype;

  if (!docUrl) {
    return null;
  }

  const getFileIcon = (mimetype) => {
    if (mimetype?.includes('pdf')) {
      return 'heroicons-outline:document';
    } else if (mimetype?.includes('spreadsheet') || mimetype?.includes('excel')) {
      return 'heroicons-outline:table-cells';
    } else if (mimetype?.includes('presentation') || mimetype?.includes('powerpoint')) {
      return 'heroicons-outline:presentation-chart-bar';
    } else if (mimetype?.includes('word')) {
      return 'heroicons-outline:document-text';
    }
    return 'heroicons-outline:document';
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const handleDocumentClick = () => {
    window.open(docUrl, '_blank');
  };

  return (
    <DocumentContainer onClick={handleDocumentClick}>
      <IconButton size="small">
        <FuseSvgIcon size={24}>{getFileIcon(mimetype)}</FuseSvgIcon>
      </IconButton>
      <FileInfo>
        <FileName variant="subtitle2">{filename || 'Document'}</FileName>
        <FileSize variant="caption">{formatFileSize(filesize)}</FileSize>
      </FileInfo>
      <IconButton size="small">
        <FuseSvgIcon size={20}>heroicons-outline:arrow-down-tray</FuseSvgIcon>
      </IconButton>
    </DocumentContainer>
  );
};

export default DocumentMessage;