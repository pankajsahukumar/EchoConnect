import { useEffect, useRef, useState } from 'react';
import { Box, ClickAwayListener, IconButton, Popper } from '@mui/material';
import { styled } from '@mui/material/styles';
import ReplyIcon from '@mui/icons-material/Reply';
import ShortcutIcon from '@mui/icons-material/Shortcut';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import useChatColors from './shared/chatColors';
import TemplateMessage from './TemplateMessage';
import TextMessage from './TextMessage';
import SystemMessage from './SystemMessage';
import QuotedMessage from './QuotedMessage';
import ImageMessage from './ImageMessage';
import InteractiveMessage from './InteractiveMessage';
import ButtonMessage from './ButtonMessage';
import DocumentMessage from './DocumentMessage';
import VideoMessage from './VideoMessage';

// ─── Styled wrappers ────────────────────────────────────────────────────────

const MessageRow = styled('div')({
  display: 'flex',
  width: '100%',
  marginBottom: '2px',
  padding: '0 63px',
  '&.contact + .me, &.me + .contact': { marginTop: '12px' },
});

const HoverArrow = styled('div')({
  position: 'absolute',
  top: 3,
  right: 3,
  display: 'none',
  zIndex: 1,
  '& .MuiIconButton-root': {
    width: 28,
    height: 28,
    borderRadius: '50%',
    '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
  },
});

const ContextMenu = styled('div')({
  backgroundColor: '#233138',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
  overflow: 'hidden',
  minWidth: 160,
  padding: '6px 0',
  zIndex: 10,
});

const ContextMenuItem = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: '10px 20px 10px 16px',
  cursor: 'pointer',
  fontSize: '14.5px',
  color: '#e9edef',
  transition: 'background-color 0.15s',
  '&:hover': { backgroundColor: 'rgba(255,255,255,0.06)' },
  '& svg': { fontSize: 18, color: '#aebac1' },
});

// ─── Component ──────────────────────────────────────────────────────────────

const RenderMessage = ({
  message,
  messageType,
  messageOriginType,
  isMine,
  showTail,
  senderName,
  messageId,
  quote,
  highlightedMessageId,
  setHighlightedMessageId,
  onReply,
  onCopy,
  onForward,
  onDelete,
  onEmojiSelect,
  onQuoteClick,
  Data,
}) => {
  const c = useChatColors();
  const [menuOpen, setMenuOpen] = useState(false);
  const arrowRef = useRef(null);

  // ── System messages get their own centered layout ──
  if (messageOriginType === 'SYSTEM') {
    return <SystemMessage message={message} Data={Data} />;
  }

  // ── Helpers ──
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  const highlightMessage = (id) => {
    setHighlightedMessageId?.(id);
    setTimeout(() => setHighlightedMessageId?.(null), 2000);
    document.getElementById(`message-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const getPreview = () => {
    switch (messageType) {
      case 'template': {
        const t = message?.templateMessage || message?.payload?.template;
        return t?.body?.data?.[0]?.text || t?.body?.text || 'Template message';
      }
      case 'text':
        return message?.text || 'Text message';
      case 'interactive':
        return message?.interactiveMessage?.body?.text || 'Interactive message';
      case 'image':
        return 'Photo';
      case 'video':
        return 'Video';
      case 'document':
        return message?.fileName || 'Document';
      case 'audio':
        return 'Audio';
      default:
        return 'Message';
    }
  };

  // ── Common props forwarded to every child component ──
  const childProps = { message, isMine, senderName, Data };

  const renderContent = () => {
    switch (messageType) {
      case 'text':
        return <TextMessage {...childProps} />;
      case 'template':
        return <TemplateMessage {...childProps} />;
      case 'interactive':
        return <InteractiveMessage {...childProps} />;
      case 'button':
        return <ButtonMessage {...childProps} />;
      case 'image':
        return <ImageMessage {...childProps} />;
      case 'video':
        return <VideoMessage {...childProps} />;
      case 'document':
        return <DocumentMessage {...childProps} />;
      default:
        // Fallback — render text if there is any
        if (message?.text) return <TextMessage {...childProps} />;
        return null;
    }
  };

  const bubbleBg = isMine ? c.outgoingBubble : c.incomingBubble;
  const isHighlighted = highlightedMessageId === messageId;

  return (
    <MessageRow
      className={isMine ? 'me' : 'contact'}
      id={`message-${messageId}`}
      style={{ justifyContent: isMine ? 'flex-end' : 'flex-start' }}
    >
      <Box
        sx={{
          position: 'relative',
          maxWidth: '65%',
          borderRadius: '7.5px',
          ...(showTail && {
            [isMine ? 'borderTopRightRadius' : 'borderTopLeftRadius']: 0,
          }),
          backgroundColor: bubbleBg,
          boxShadow: c.bubbleShadow,
          color: c.primaryText,
          transition: 'background-color 0.2s',
          ...(isHighlighted && {
            backgroundColor: 'rgba(0, 168, 132, 0.15)',
            animation: 'highlight-pulse 2s ease-out',
          }),
          '&:hover .hover-arrow': { display: 'flex' },
          '@keyframes highlight-pulse': {
            '0%': { backgroundColor: 'rgba(0, 168, 132, 0.35)' },
            '100%': { backgroundColor: bubbleBg },
          },
        }}
      >
        {/* WhatsApp bubble tail */}
        {showTail && (
          <svg
            viewBox="0 0 8 13"
            width="8"
            height="13"
            style={{
              position: 'absolute',
              top: 0,
              [isMine ? 'right' : 'left']: -8,
              display: 'block',
            }}
          >
            <path
              fill={bubbleBg}
              d={
                isMine
                  ? 'M0 0h3c2.2 0 3.3 1.7 2.1 3.2L0 10V0z'
                  : 'M8 0H5C2.8 0 1.7 1.7 2.9 3.2L8 10V0z'
              }
            />
          </svg>
        )}

        {/* Quoted reply */}
        {quote && (
          <QuotedMessage
            quote={quote}
            isMine={isMine}
            onQuoteClick={(q) => {
              highlightMessage(q.id);
              onQuoteClick?.(q);
            }}
          />
        )}

        {/* Hover arrow & context menu */}
        <HoverArrow className="hover-arrow">
          <IconButton ref={arrowRef} size="small" onClick={toggleMenu} sx={{ color: c.secondaryText }}>
            <FuseSvgIcon size={16}>heroicons-outline:chevron-down</FuseSvgIcon>
          </IconButton>
        </HoverArrow>

        <Popper
          open={menuOpen}
          anchorEl={arrowRef.current}
          placement={isMine ? 'bottom-end' : 'bottom-start'}
          style={{ zIndex: 1300 }}
        >
          <ClickAwayListener onClickAway={closeMenu}>
            <ContextMenu>
              <ContextMenuItem
                onClick={() => {
                  onReply?.({
                    quoted: {
                      id: messageId,
                      type: messageType,
                      preview: getPreview(),
                      authorName: senderName || (isMine ? 'You' : 'Contact'),
                    },
                  });
                  highlightMessage(messageId);
                  closeMenu();
                }}
              >
                <ReplyIcon /> Reply
              </ContextMenuItem>
              <ContextMenuItem onClick={() => { onForward?.(message); closeMenu(); }}>
                <ShortcutIcon /> Forward
              </ContextMenuItem>
              <ContextMenuItem onClick={() => { onCopy?.(message); closeMenu(); }}>
                <ContentCopyIcon /> Copy
              </ContextMenuItem>
              <ContextMenuItem onClick={() => { onDelete?.(message); closeMenu(); }}>
                <DeleteOutlineIcon /> Delete
              </ContextMenuItem>
            </ContextMenu>
          </ClickAwayListener>
        </Popper>

        {/* Message body */}
        {renderContent()}
      </Box>
    </MessageRow>
  );
};

export default RenderMessage;
