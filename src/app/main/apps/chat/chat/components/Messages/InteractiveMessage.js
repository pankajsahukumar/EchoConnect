import React, { useState } from 'react';
import { Box, Button, List, ListItem, ListItemText, Typography, Popover } from '@mui/material';
import { styled } from '@mui/material/styles';


const InteractiveContainer = styled(Box)(({ isMine }) => ({
    maxWidth: 320,
    backgroundColor: isMine ? "#d9fdd3" : "#fff",
    borderRadius: "7.5px",
    overflow: "hidden",
    fontFamily:
      "Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif",
    position: "relative",
    marginBottom: "0px",
  }));

const Header = styled(Typography)(() => ({
  fontSize: '14.2px',
  fontWeight: 500,
  color: '#111b21',
  padding: '8px 0',
  borderBottom: '1px solid #e9edef',
}));

const Body = styled(Typography)(() => ({
  fontSize: '14.2px',
  color: '#111b21',
  padding: '8px 0',
  whiteSpace: 'pre-wrap',
}));

const StyledList = styled(List)(() => ({
  padding: 0,
  margin: 0,
  backgroundColor: '#fff',
  minWidth: '280px',
  maxWidth: '320px',
  boxShadow: '0 2px 5px rgba(11,20,26,.26),0 2px 10px rgba(11,20,26,.16)',
  borderRadius: '3px',
}));

const StyledListItem = styled(ListItem)(() => ({
  padding: '8px 0',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#f0f2f5',
  },
  borderBottom: '1px solid #e9edef',
  '&:last-child': {
    borderBottom: 'none',
  },
}));

const ListItemTitle = styled(Typography)(() => ({
  fontSize: '14.2px',
  fontWeight: 500,
  color: '#111b21',
}));

const ListItemDescription = styled(Typography)(() => ({
  fontSize: '14px',
  color: '#667781',
}));


const TemplateButtonBox = styled(Box)({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    borderTop: "1px solid rgba(189, 216, 200, 0.5)",
    position: "relative",
  });

  const TemplateButton = styled(Button)({
    width: "100%",
    backgroundColor: "transparent",
    color: "rgb(0, 157, 226)",
    borderRadius: 0,
    padding: "10px 12px",
    fontSize: "14px",
    fontWeight: 500,
    textTransform: "none",
    "&:hover": { backgroundColor: "rgba(0, 168, 132, 0.05)" },
  });
const SenderName = styled('div')(() => ({
  color: '#00a884',
  fontSize: '12.8px',
  fontWeight: 500,
  marginBottom: '2px',
  padding: '0 0 2px 0',
}));

const TextContent = styled('div')(() => ({
  fontSize: '14.2px',
  lineHeight: '19px',
  color: '#111b21',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif',
}));

const TimeStamp = styled('div')(() => ({
  fontSize: '11px',
  color: '#667781',
  fontWeight: 400,
  marginTop: '4px',
  float: 'right',
  marginLeft: '6px',
  lineHeight: '15px',
}));

const MessageTailSvg = ({ isMine }) => (
  <div
    style={{
      position: 'absolute',
      bottom: 0,
      right: isMine ? -8 : 'auto',
      left: isMine ? 'auto' : -8,
      width: 8,
      height: 13,
      transform: isMine ? 'scaleX(-1)' : 'none',
    }}
  >
    <svg viewBox="0 0 8 13" width="8" height="13">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="1" dy="1" stdDeviation="1" floodColor="#d2d2d2" floodOpacity="0.4" />
        </filter>
      </defs>
      <path
        fill={isMine ? '#d9fdd3' : '#ffffff'}
        d="M5.188 0H0v11.193l6.467-8.625C7.526 1.156 6.958 0 5.188 0z"
        filter="url(#shadow)"
      />
    </svg>
  </div>
);

const InteractiveMessage = ({ message, isMine, senderName }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { interactiveMessage } = message;
  
  // Format time like WhatsApp (HH:MM)
  const createdAt = message.dateCreated ? new Date(message.dateCreated) :
                   message.messageTime ? new Date(message.messageTime) :
                   message.createdAt ? new Date(message.createdAt) : new Date();
  const timeString = createdAt.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleButtonClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (id) => {
    console.log('Selected option:', id);
    handleClose();
  };

  const open = Boolean(anchorEl);

  return (
    <InteractiveContainer isMine={isMine}>
      {/* Sender name for contact messages */}
      {!isMine && senderName && (
        <SenderName>
          {senderName}
        </SenderName>
      )}

      {/* Header */}
      {interactiveMessage.header && (
        <Header>
          {interactiveMessage.header.text}
        </Header>
      )}

      {/* Body */}
      {interactiveMessage.body && (
        <Body>
          {interactiveMessage.body.text}
        </Body>
      )}
       {/* Time and status */}
       <TimeStamp>
        {timeString}
        {isMine && (
          <span style={{ marginLeft: '2px', color: '#00a884' }}>
            ✓✓
          </span>
        )}
      </TimeStamp>
      {interactiveMessage.button && (
        <TemplateButtonBox>
          <TemplateButton onClick={handleButtonClick}>
            {interactiveMessage.button}
          </TemplateButton>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'center',
              horizontal: 'center',
            }}
            anchorReference="anchorPosition"
            anchorPosition={{
              top: window.innerHeight / 2,
              left: window.innerWidth / 2,
            }}
            PaperProps={{
              style: {
                marginTop: '8px',
                padding: '8px 0px',
              },
            }}
          >
            <StyledList>
              {interactiveMessage.sections.map((section, sectionIndex) => (
                <React.Fragment key={sectionIndex}>
                  {section.title && (
                    <ListItemText
                      primary={<ListItemTitle sx={{ padding: '8px 16px', fontWeight: 'bold' }}>{section.title}</ListItemTitle>}
                    />
                  )}
                  {section.rows.map((row) => (
                    <StyledListItem key={row.id} onClick={() => handleOptionClick(row.id)}>
                      <ListItemText
                        primary={<ListItemTitle>{row.title}</ListItemTitle>}
                        secondary={row.description && <ListItemDescription>{row.description}</ListItemDescription>}
                      />
                    </StyledListItem>
                  ))}
                </React.Fragment>
              ))}
            </StyledList>
          </Popover>
        </TemplateButtonBox>
      )}

     
    </InteractiveContainer>
  );
}

export default InteractiveMessage;

