import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { addNewMessage } from "../store/chatSlice";
import RenderMessage from "../chat/components/Messages/RenderMessage";
import useSocket from "src/hooks/useSocket";
import useCurrentChat from "src/hooks/useCurrentChat";

const ChatHandler = () => {
  const { socket } = useSocket('/chats');
  const dispatch = useDispatch();
  const bottomRef = useRef(null);

  const { chat,id } = useCurrentChat();
   const sizeChanged = (prevSize, newSize, newSizeCallback) => {
    console.log('sizeChanged called', prevSize, newSize)
    if (newSize && prevSize) {
      if (newSize > prevSize) {
        return newSizeCallback(newSize, newSize - prevSize);
      }
      return;
    }
    return;
  };
  
  const [scrolled, setScrolled] = useState(false);

  const [currentMessagesSize, setCurrentMessagesSize] = useState(chat.length)

  useEffect(() => {
    if(id){
      socket.emit('init_room', { chat_id: id });
      socket.emit('join_room', { chat_id: id  });
    }

    return () => {
      socket.emit('leave_room', { room_id: id });
      socket.off('get_pid');
    };
  }, [socket, id, dispatch]);

  useEffect(() => {
    socket.on('chatMessage', (message) => {
      dispatch(addNewMessage(message));
    });
    // socket.on('message_status', (messageStatus) => {
    //   dispatch(updateMessageStatus({ chat_id: messageStatus.chat_id, message_id: messageStatus.message_id, new_status: messageStatus.status }));
    // });
    return () => {
      socket.off('message_status');
    };
  }, [socket, dispatch, id]);


  useEffect(() => {
    if (bottomRef) {
      bottomRef.current?.scrollIntoView()
      setScrolled(true)
    }
  }, [bottomRef, id]);

  // useEffect(() => {
  //   sizeChanged(currentMessagesSize, chat.length, (newSize, changedSize) => {
  //     setCurrentMessagesSize(newSize)
  //     console.log('changed size', changedSize)
  //     if (bottomRef && changedSize && changedSize < 2) {
  //       bottomRef.current?.scrollIntoView()
  //     }
  //   })
  // }, [chat, currentMessagesSize])

  useEffect(() => {
    const timer = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);
    return () => clearTimeout(timer);
  }, [chat.length]);
  
  const onReply = (messageId) => {
  }
  const onCopy = (messageId) => {
  }
    const onForward = (messageId) => {
    }
    const onDelete = (messageId) => {
    }
    const onEmojiSelect = (messageId, emoji) => {
    }
    const onQuoteClick = (messageId) => {
    }
    const highlightedMessageId = null;
  return (
    <>
      <div className="flex flex-auto h-full min-h-0 w-full">
        <div className={"flex flex-1 z-10 flex-col relative"}>
          <FuseScrollbars
            className="flex flex-1 flex-col overflow-y-auto"
            option={{ suppressScrollX: true, wheelPropagation: true }}
            style={{
              backgroundColor: "#000",
              backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(0.5) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='hsla(0,0%25,100%25,0)'/%3e%3cpath d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z' stroke-width='0.5' stroke='hsla(0,0%25,100%25,0.05)' fill='none'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='800%25' height='800%25' transform='translate(0,0)' fill='url(%23a)'/%3e%3c/svg%3e")`,
            }}
          >
            {chat.map((msg) => {
              const messageType = msg.message?.messageType;
              const isMine = msg.senderType === "USER";
              let messageQuote = null;
              if (msg.replyMessage) {
                messageQuote = {
                  id: msg.replyMessageId,
                  type: msg.replyMessage?.messageType || "text",
                  preview: getMessagePreview(
                    msg.replyMessage,
                    msg.replyMessage?.messageType
                  ),
                  authorName:
                    msg.replyMessage.senderType === "USER"
                      ? "You"
                      : msg.replyMessage.senderUser?.name || "Contact",
                };
              }

              return (
                <RenderMessage
                  key={msg.messageId || msg.id}
                  message={msg.message}
                  messageType={messageType}
                  messageOriginType={msg.senderType}
                  isMine={isMine}
                  senderName={
                    !isMine ? msg.senderUser?.name || "Contact" : "You"
                  }
                  messageId={msg.messageId || msg.id}
                  quote={messageQuote}
                  highlightedMessageId={highlightedMessageId}
                  onReply={onReply}
                  onCopy={onCopy}
                  onForward={onForward}
                  onDelete={onDelete}
                  onEmojiSelect={onEmojiSelect}
                  onQuoteClick={onQuoteClick}
                  Data={msg}
                />
              );
            })}
            <div ref={bottomRef} style={{marginTop:10}}></div>
          </FuseScrollbars>
          {/* <div ref={bottomRef}></div> */}
        </div>
      </div>
    </>
  );
};

export default ChatHandler;
