import { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography, Popover } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TextComponent from './TextComponent';
import useChatColors from './shared/chatColors';
import { MsgTimestamp, SenderName } from './shared/MessageParts';

const InteractiveMessage = ({ message, isMine, senderName, Data }) => {
  const c = useChatColors();
  const [anchorEl, setAnchorEl] = useState(null);

  const im = message?.interactiveMessage;
  if (!im) return null;

  const openList = (e) => setAnchorEl(e.currentTarget);
  const closeList = () => setAnchorEl(null);
  const handleSelect = (id) => {
    closeList();
  };

  return (
    <Box sx={{ maxWidth: 320, overflow: 'hidden' }}>
      {!isMine && (
        <Box sx={{ px: '9px', pt: '6px' }}>
          <SenderName>{senderName}</SenderName>
        </Box>
      )}

      {/* Header */}
      {im.header?.text && (
        <Box sx={{ px: '12px', pt: '8px' }}>
          <Typography sx={{ fontSize: '14.2px', fontWeight: 600, lineHeight: '19px' }}>
            {im.header.text}
          </Typography>
        </Box>
      )}

      {/* Body */}
      {im.body?.text && (
        <Box sx={{ px: '12px', pt: '4px', pb: '2px', fontSize: '14.2px', lineHeight: '19px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <TextComponent text={im.body.text} />
        </Box>
      )}

      {/* Timestamp */}
      <Box sx={{ px: '12px', pb: '6px' }}>
        <MsgTimestamp Data={Data} isMine={isMine} />
      </Box>

      {/* List / button action */}
      {im.button && (
        <>
          <Box sx={{ borderTop: `1px solid ${c.divider}` }}>
            <Button
              fullWidth
              onClick={openList}
              startIcon={<ListAltIcon sx={{ fontSize: 16 }} />}
              sx={{
                color: c.buttonBlue,
                textTransform: 'none',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: 0,
                py: '10px',
                '&:hover': { bgcolor: 'rgba(0, 168, 132, 0.05)' },
              }}
            >
              {im.button}
            </Button>
          </Box>

          {/* Popover list */}
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={closeList}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(11,20,26,.26)',
                  minWidth: 260,
                  maxWidth: 320,
                },
              },
            }}
          >
            {/* Title bar */}
            <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${c.divider}` }}>
              <Typography sx={{ fontSize: 15, fontWeight: 600 }}>{im.button}</Typography>
            </Box>

            <List disablePadding>
              {(im.sections || []).map((section, si) => (
                <Box key={si}>
                  {section.title && (
                    <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
                      <Typography sx={{ fontSize: 12, fontWeight: 700, color: c.accent, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        {section.title}
                      </Typography>
                    </Box>
                  )}
                  {(section.rows || []).map((row) => (
                    <ListItem
                      key={row.id}
                      button
                      onClick={() => handleSelect(row.id)}
                      sx={{
                        px: 2,
                        py: 1,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' },
                        borderBottom: `1px solid ${c.divider}`,
                        '&:last-child': { borderBottom: 'none' },
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography sx={{ fontSize: '14.2px', fontWeight: 500 }}>
                            {row.title}
                          </Typography>
                        }
                        secondary={
                          row.description ? (
                            <Typography sx={{ fontSize: 13, color: c.timestampText }}>
                              {row.description}
                            </Typography>
                          ) : null
                        }
                      />
                    </ListItem>
                  ))}
                </Box>
              ))}
            </List>
          </Popover>
        </>
      )}
    </Box>
  );
};

export default InteractiveMessage;
