import FuseScrollbars from "@fuse/core/FuseScrollbars";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addNewMessage, loadMoreMessages, selectChatHasMore, selectChatCursor } from "../store/chatSlice";
import RenderMessage from "../chat/components/Messages/RenderMessage";
import useSocket from "src/hooks/useSocket";
import useCurrentChat from "src/hooks/useCurrentChat";

// ── date separator helpers ─────────────────────────────────────────────────
function getDateLabel(timestamp) {
  if (!timestamp) return null;
  const msgDate = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  const same = (a, b) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
  if (same(msgDate, today)) return "Today";
  if (same(msgDate, yesterday)) return "Yesterday";
  return msgDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function DateSeparator({ label }) {
  return (
    <div className="flex items-center justify-center my-8">
      <span style={{
        backgroundColor: "rgba(255,255,255,0.15)",
        color: "#e9edef",
        fontSize: 12,
        fontWeight: 500,
        borderRadius: 8,
        padding: "4px 12px",
        userSelect: "none",
      }}>
        {label}
      </span>
    </div>
  );
}

function getMessagePreview(message, messageType) {
  if (!message) return "Message";
  switch (messageType) {
    case "text": return message.text || "Text message";
    case "template": return message.templateMessage?.name || "Template message";
    case "interactive": return message.interactiveMessage?.body?.text || "Interactive message";
    default: return "Message";
  }
}
// ──────────────────────────────────────────────────────────────────────────

const ChatHandler = () => {
  const { socket } = useSocket("/chats");
  const dispatch = useDispatch();

  const scrollbarRef = useRef(null);
  const bottomRef = useRef(null);
  const isLoadingMore = useRef(false);
  const prevScrollHeight = useRef(null);

  const { chat, id } = useCurrentChat();
  const hasMore = useSelector(selectChatHasMore);
  const nextCursor = useSelector(selectChatCursor);

  // ── keep a ref of latest values so scroll handler is never stale ───────
  const latestRef = useRef({ hasMore, id, nextCursor });
  useEffect(() => {
    latestRef.current = { hasMore, id, nextCursor };
  }, [hasMore, id, nextCursor]);

  // ── socket room ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    socket.emit("join_conversation", { chatId: id });
    return () => {
      socket.emit("leave_conversation", { chatId: id });
    };
  }, [socket, id]);

  useEffect(() => {
    const handler = (message) => dispatch(addNewMessage(message));
    socket.on("chatMessage", handler);
    return () => socket.off("chatMessage", handler);
  }, [socket, dispatch]);

  // ── infinite scroll: native scroll event (works with/without PS) ──────
  // Use latestRef so the handler is added once and never goes stale.
  useEffect(() => {
    let el = scrollbarRef.current;
    let cleanup = () => {};

    const attach = (element) => {
      const onScroll = () => {
        if (element.scrollTop > 80) return; // not near top yet
        const { hasMore, id, nextCursor } = latestRef.current;
        if (!hasMore || isLoadingMore.current || !id || !nextCursor) return;
        isLoadingMore.current = true;
        prevScrollHeight.current = element.scrollHeight;
        dispatch(loadMoreMessages({ chatId: id, cursor: nextCursor })).then((result) => {
          if (loadMoreMessages.rejected.match(result)) {
            // Reset on failure so user can retry
            isLoadingMore.current = false;
            prevScrollHeight.current = null;
          }
        });
      };
      element.addEventListener("scroll", onScroll);
      return () => element.removeEventListener("scroll", onScroll);
    };

    if (el) {
      cleanup = attach(el);
    } else {
      // Ref resolves after HOC wrappers settle — retry next frame
      const raf = requestAnimationFrame(() => {
        el = scrollbarRef.current;
        if (el) cleanup = attach(el);
      });
      return () => cancelAnimationFrame(raf);
    }

    return () => cleanup();
  }, [dispatch]); // only runs once on mount — reads fresh values via latestRef

  // ── scroll position: restore after prepend, else stick to bottom ───────
  useEffect(() => {
    const el = scrollbarRef.current;
    if (!el || !chat.length) return;

    if (prevScrollHeight.current !== null) {
      // Restore position after load-more prepend
      el.scrollTop = el.scrollHeight - prevScrollHeight.current;
      prevScrollHeight.current = null;
      isLoadingMore.current = false;
      return;
    }

    // Auto-scroll to bottom when near bottom or on first load
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;
    if (isNearBottom || chat.length <= 30) {
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [chat]);

  // ── build items list with date separators ─────────────────────────────
  const items = [];
  let lastDateStr = null;
  chat.forEach((msg) => {
    const ts = msg.messageTime || msg.createdAt || msg.statusTimestamp || msg.dateCreated;
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
      <div className="flex flex-1 z-10 flex-col relative">
        <FuseScrollbars
          ref={scrollbarRef}
          className="flex flex-1 flex-col overflow-y-auto"
          option={{ suppressScrollX: true, wheelPropagation: true }}
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
                preview: getMessagePreview(msg.replyMessage, msg.replyMessage?.messageType),
                authorName: msg.replyMessage.senderType === "USER"
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
                highlightedMessageId={null}
                onReply={() => {}}
                onCopy={() => {}}
                onForward={() => {}}
                onDelete={() => {}}
                onEmojiSelect={() => {}}
                onQuoteClick={() => {}}
                Data={msg}
              />
            );
          })}
          <div ref={bottomRef} style={{ marginTop: 10 }} />
        </FuseScrollbars>
      </div>
    </div>
  );
};

export default ChatHandler;
