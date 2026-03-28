import TextComponent from './TextComponent';
import { MsgBody, MsgTimestamp, SenderName } from './shared/MessageParts';

const TextMessage = ({ message, isMine, senderName, Data }) => {
  const text = message?.text || '';
  if (!text) return null;

  return (
    <MsgBody>
      {!isMine && <SenderName>{senderName}</SenderName>}
      <div
        style={{
          fontSize: '14.2px',
          lineHeight: '19px',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <TextComponent text={text} />
      </div>
      <MsgTimestamp Data={Data} isMine={isMine} />
    </MsgBody>
  );
};

export default TextMessage;
