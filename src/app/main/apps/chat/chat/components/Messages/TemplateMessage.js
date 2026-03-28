import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PhoneIcon from '@mui/icons-material/Phone';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ReplyIcon from '@mui/icons-material/Reply';
import TextComponent from './TextComponent';
import useChatColors from './shared/chatColors';
import { MsgTimestamp, SenderName } from './shared/MessageParts';

// ─── Sub-components ──────────────────────────────────────────────────────────

function TemplateHeader({ header }) {
  if (!header?.data?.length) return null;

  return header.data.map((item, i) => {
    if (item.type === 'text' && item.text) {
      return (
        <Box key={i} sx={{ px: '12px', pt: '8px' }}>
          <Typography sx={{ fontSize: '15px', fontWeight: 600, lineHeight: '20px' }}>
            {item.text}
          </Typography>
        </Box>
      );
    }
    if ((item.type === 'image' || item.type === 'video') && item.link) {
      return (
        <Box key={i} sx={{ px: '3px', pt: '3px' }}>
          {item.type === 'image' ? (
            <img
              src={item.link}
              alt="header"
              style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: '6px', display: 'block' }}
            />
          ) : (
            <video controls style={{ width: '100%', maxHeight: 250, borderRadius: '6px', display: 'block' }}>
              <source src={item.link} type="video/mp4" />
            </video>
          )}
        </Box>
      );
    }
    return null;
  });
}

function TemplateButtons({ buttons, colors }) {
  const [copyToast, setCopyToast] = useState('');

  if (!buttons?.data?.length) return null;

  const handleClick = (btn) => {
    if (btn.type === 'URL' && btn.url) window.open(btn.url, '_blank');
    if (btn.type === 'PHONE_NUMBER' && btn.phoneNumber) window.open(`tel:${btn.phoneNumber}`);
    if ((btn.type === 'OTP' || btn.otp_type === 'COPY_CODE') && btn.otp) {
      navigator.clipboard.writeText(btn.otp).then(() => {
        setCopyToast('Code copied!');
        setTimeout(() => setCopyToast(''), 2000);
      });
    }
  };

  const getIcon = (type) => {
    if (type === 'URL') return <OpenInNewIcon sx={{ fontSize: 16, mr: 0.5 }} />;
    if (type === 'PHONE_NUMBER') return <PhoneIcon sx={{ fontSize: 16, mr: 0.5 }} />;
    if (type === 'OTP') return <ContentCopyIcon sx={{ fontSize: 16, mr: 0.5 }} />;
    if (type === 'QUICK_REPLY') return <ReplyIcon sx={{ fontSize: 16, mr: 0.5 }} />;
    return null;
  };

  return (
    <Box sx={{ borderTop: `1px solid ${colors.divider}`, position: 'relative' }}>
      {copyToast && (
        <Box
          sx={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            bgcolor: 'rgba(0,0,0,0.8)',
            color: '#fff',
            px: '12px',
            py: '6px',
            borderRadius: '4px',
            fontSize: 12,
            mb: 1,
            zIndex: 10,
          }}
        >
          {copyToast}
        </Box>
      )}
      {buttons.data.map((btn, idx) => (
        <Button
          key={idx}
          fullWidth
          onClick={() => handleClick(btn)}
          sx={{
            color: colors.buttonBlue,
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            borderRadius: 0,
            py: '10px',
            borderTop: idx > 0 ? `1px solid ${colors.divider}` : 'none',
            '&:hover': { bgcolor: 'rgba(0, 168, 132, 0.05)' },
          }}
        >
          {getIcon(btn.type)}
          {btn.text}
        </Button>
      ))}
    </Box>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

const TemplateMessage = ({ message, isMine, senderName, Data }) => {
  const c = useChatColors();

  const template = message?.templateMessage || message?.payload?.template;
  if (!template) return null;

  const { header, body, footer, button } = template;
  const bodyText = body?.text || body?.data?.[0]?.text || '';
  const footerText = footer?.text || footer?.data?.[0]?.text || '';

  return (
    <Box sx={{ maxWidth: 320, overflow: 'hidden' }}>
      {!isMine && (
        <Box sx={{ px: '9px', pt: '6px' }}>
          <SenderName>{senderName}</SenderName>
        </Box>
      )}

      {/* Header (image / video / text) */}
      <TemplateHeader header={header} />

      {/* Body */}
      {bodyText && (
        <Box sx={{ px: '12px', pt: '6px', pb: '2px', fontSize: '14.2px', lineHeight: '19px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <TextComponent text={bodyText} />
        </Box>
      )}

      {/* Footer + timestamp */}
      <Box sx={{ px: '12px', pb: '6px' }}>
        {footerText && (
          <Typography sx={{ fontSize: '12px', color: c.timestampText, mt: '4px', lineHeight: '16px' }}>
            {footerText}
          </Typography>
        )}
        <MsgTimestamp Data={Data} isMine={isMine} />
      </Box>

      {/* Action buttons */}
      <TemplateButtons buttons={button} colors={c} />
    </Box>
  );
};

export default TemplateMessage;
