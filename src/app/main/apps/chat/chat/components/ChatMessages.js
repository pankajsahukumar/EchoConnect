import FuseScrollbars from "@fuse/core/FuseScrollbars";
import clsx from "clsx";
import RenderMessage from "./Messages/RenderMessage";
import { useEffect } from "react";

export default function ChatMessages({
  chat,
  highlightedMessageId,
  onReply,
  onCopy,
  onForward,
  onDelete,
  onEmojiSelect,
  onQuoteClick,
  chatRef,
  className
}) {
  
    const getMessagePreview = (message, messageType) => {
      console.log(message,messageType,"this is info")
        if (!message) return "Message";
    
        switch (messageType) {
          case "text":
            return message.text || message.payload?.text?.body || "Text message";
          case "template":
            return message.templateMessage?.name || "Template message";
          case "interactive":
            return message.interactiveMessage?.body?.text || "Interactive message";
          default:
            return "Message";
        }
      };
  useEffect(() => {
    if (chatRef.current) {
      console.log("ChatMessages: chat or chatRef changed, attempting to update scroll.");
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.updateScroll();
          console.log("ChatMessages: Scroll updated.");
        }
      }, 50);
    }
  }, [chat, chatRef]);
  return (
    <div className="flex flex-auto h-full min-h-0 w-full">
    <div
      className={clsx(
        "flex flex-1 z-10 flex-col relative",
        className
      )}
    >
      <FuseScrollbars
        ref={chatRef}
        className="flex flex-1 flex-col overflow-y-auto"
        option={{ suppressScrollX: true, wheelPropagation: true }}
        style={{
          backgroundColor: "#000",
          backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(0.5) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='hsla(0,0%25,100%25,0)'/%3e%3cpath d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z' stroke-width='0.5' stroke='hsla(0,0%25,100%25,0.05)' fill='none'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='800%25' height='800%25' transform='translate(0,0)' fill='url(%23a)'/%3e%3c/svg%3e")`,
        }}
      >
        {chat.map((msg) => {
          const messageType = msg.message?.messageType;
          const isMine = msg.messageOriginType === "USER";
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
                msg.replyMessage.messageOriginType === "USER"
                  ? "You"
                  : msg.replyMessage.senderUser?.name || "Contact",
            };
          }

          return (
            <RenderMessage
              key={msg.id}
              message={msg.message}
              messageType={messageType}
              messageOriginType={msg.messageOriginType}
              isMine={isMine}
              senderName={
                !isMine ? msg.senderUser?.name || "Contact" : "You"
              }
              messageId={msg.id}
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
      </FuseScrollbars>
    </div>
  </div>
  );
}
