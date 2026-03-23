import FuseScrollbars from "@fuse/core/FuseScrollbars";
import clsx from "clsx";
import { useEffect, Fragment } from "react";
import RenderMessage from "./Messages/RenderMessage";

function getDateLabel(timestamp) {
  if (!timestamp) return null;
  const msgDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(msgDate, today)) return "Today";
  if (sameDay(msgDate, yesterday)) return "Yesterday";

  return msgDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DateSeparator({ label }) {
  return (
    <div className="flex items-center justify-center my-8">
      <span
        style={{
          backgroundColor: "rgba(255,255,255,0.15)",
          color: "#e9edef",
          fontSize: 12,
          fontWeight: 500,
          borderRadius: 8,
          padding: "4px 12px",
          backdropFilter: "blur(4px)",
          userSelect: "none",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function ChatMessages({
  chat,
  highlightedMessageId,
  onReply,
  onCopy,
  onForward,
  onDelete,
  onEmojiSelect,
  onQuoteClick,
  onScrollTop,
  chatRef,
  className,
}) {
  const getMessagePreview = (message, messageType) => {
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
      setTimeout(() => {
        if (chatRef.current) chatRef.current.updateScroll?.();
      }, 50);
    }
  }, [chat, chatRef]);

  // Build list with date separators inserted
  const items = [];
  let lastDateStr = null;

  chat.forEach((msg) => {
    // API messages use statusTimestamp; socket messages use messageTime/dateCreated
    const ts = msg.messageTime || msg.statusTimestamp || msg.dateCreated;
    const label = getDateLabel(ts);
    const dateStr = ts ? new Date(ts).toDateString() : null;

    if (label && dateStr !== lastDateStr) {
      items.push({ type: "separator", label, key: `sep-${dateStr}` });
      lastDateStr = dateStr;
    }
    items.push({ type: "message", msg });
  });

  return (
    <div className="flex flex-auto h-full min-h-0 w-full">
      <div className={clsx("flex flex-1 z-10 flex-col relative", className)}>
        <FuseScrollbars
          ref={chatRef}
          className="flex flex-1 flex-col overflow-y-auto"
          option={{ suppressScrollX: true, wheelPropagation: true }}
          onYReachStart={onScrollTop}
          style={{
            backgroundColor: "#000",
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3e%3cdefs%3e%3cpattern id='a' patternUnits='userSpaceOnUse' width='20' height='20' patternTransform='scale(0.5) rotate(0)'%3e%3crect x='0' y='0' width='100%25' height='100%25' fill='hsla(0,0%25,100%25,0)'/%3e%3cpath d='M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z' stroke-width='0.5' stroke='hsla(0,0%25,100%25,0.05)' fill='none'/%3e%3c/pattern%3e%3c/defs%3e%3crect width='800%25' height='800%25' transform='translate(0,0)' fill='url(%23a)'/%3e%3c/svg%3e")`,
          }}
        >
          {items.map((item) => {
            if (item.type === "separator") {
              return <DateSeparator key={item.key} label={item.label} />;
            }

            const { msg } = item;
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
                key={msg.id || msg.messageId}
                message={msg.message}
                messageType={messageType}
                messageOriginType={msg.senderType}
                isMine={isMine}
                senderName={!isMine ? msg.senderUser?.name || "Contact" : "You"}
                messageId={msg.id || msg.messageId}
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
