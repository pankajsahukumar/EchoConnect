import React from 'react';
import { styled } from '@mui/material/styles';
import TextComponent from './TextComponent';
import MessageTimeStamp from 'app/shared-components/common/MessageTimeStamp';
import MessageContainer from 'app/shared-components/common/MessageContainer';

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


const TextMessage = ({ message, isMine, senderName }) => {
  const messageText = message?.text ||
                     'No text content';

  return (
    <MessageContainer>
      {isMine && senderName && (
        <SenderName>
          {senderName}
        </SenderName>
      )}
      <TextContent>
         <TextComponent text={messageText} />
      </TextContent>
     <MessageTimeStamp isRead={isMine} message={message} />
    </MessageContainer>
  );
}

export default TextMessage;

