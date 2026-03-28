import TextComponent from './TextComponent';
import { MsgBody, MsgTimestamp, SenderName } from './shared/MessageParts';

/**
 * Button-reply message — sent by the CUSTOMER when they tap a quick-reply /
 * interactive button.  Rendered exactly like a text bubble.
 */
const ButtonMessage = ({ message, isMine, senderName, Data }) => {
  const text = message?.text || message?.description || '';
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

export default ButtonMessage;
